import { sql } from "@/lib/db";

export type TariffType = "luz" | "gas" | "luz_gas" | "solar";
export type CustomerType = "particular" | "empresa";

export type LeadCriteria = {
  tariffType: TariffType;
  customerType: CustomerType | null;
  householdSize: string | null;
  surfaceM2: string | null;
  postalCode: string | null;
  currentCompany: string | null;
};

type CampaignRow = {
  id: number;
  company_id: number;
  company_name: string;
  label: string;
  monthly_price: string;
  customer_types: string[] | null;
  household_sizes: string[] | null;
  surface_m2_options: string[] | null;
  postal_code_prefixes: string[] | null;
  excluded_company_names: string[] | null;
  priority_tier: number;
  priority_weight: number;
  daily_quota: number;
  assigned_count: number;
  illustrative: boolean;
};

export type RankedTariff = {
  campaignId: number;
  companyName: string;
  label: string;
  monthlyPrice: number;
  illustrative: boolean;
  isWinner: boolean;
};

export type RoutingResult = {
  ranked: RankedTariff[];
  winnerCompanyName: string | null;
};

/** Lowercase + strip accents, since current_company is free text ("Endesa", "endesa", "ENDESA S.A."...). */
function normalizeCompanyName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Eligibility is a fail-safe filter: a targeting criterion the lead left
 * blank (household size, surface, postal code are all optional on the form)
 * disqualifies campaigns that restrict on it, rather than passing them
 * through — mirrors how real ping-post lead marketplaces treat missing
 * targeting data.
 */
function eligibilityReason(c: CampaignRow, lead: LeadCriteria): string | null {
  if (c.assigned_count >= c.daily_quota) return "cupo diario agotado";
  if (c.customer_types && c.customer_types.length > 0) {
    if (!lead.customerType || !c.customer_types.includes(lead.customerType)) return "tipo de cliente no coincide";
  }
  if (c.household_sizes && c.household_sizes.length > 0) {
    if (!lead.householdSize || !c.household_sizes.includes(lead.householdSize)) return "nº de personas no coincide";
  }
  if (c.surface_m2_options && c.surface_m2_options.length > 0) {
    if (!lead.surfaceM2 || !c.surface_m2_options.includes(lead.surfaceM2)) return "superficie no coincide";
  }
  if (c.postal_code_prefixes && c.postal_code_prefixes.length > 0) {
    if (!lead.postalCode || !c.postal_code_prefixes.some((p) => lead.postalCode!.startsWith(p))) {
      return "fuera de zona objetivo";
    }
  }
  if (c.excluded_company_names && lead.currentCompany) {
    const normalizedCurrent = normalizeCompanyName(lead.currentCompany);
    const isExcluded = c.excluded_company_names.some((name) => normalizedCurrent.includes(normalizeCompanyName(name)));
    if (isExcluded) return "el lead ya es cliente de esta compañía";
  }
  return null;
}

/** Weighted round-robin: lowest assigned/weight ratio wins within a priority tier. */
function fillRatio(c: CampaignRow): number {
  return c.assigned_count / c.priority_weight;
}

export async function routeLead(leadId: string, criteria: LeadCriteria): Promise<RoutingResult> {
  return sql.begin(async (tx) => {
    const rows = (await tx`
      select
        c.id, c.company_id, co.name as company_name, c.label, c.monthly_price,
        c.customer_types, c.household_sizes, c.surface_m2_options, c.postal_code_prefixes,
        c.excluded_company_names, c.priority_tier, c.priority_weight,
        c.daily_quota, c.assigned_count, c.illustrative
      from campaigns c
      join companies co on co.id = c.company_id
      where c.tariff_type = ${criteria.tariffType}
        and c.active
        and c.valid_from <= now()
        and (c.valid_until is null or c.valid_until > now())
      for update of c
    `) as unknown as CampaignRow[];

    const withReason = rows.map((c) => ({ campaign: c, reason: eligibilityReason(c, criteria) }));
    const eligible = withReason.filter((r) => r.reason === null).map((r) => r.campaign);

    const ranked: RankedTariff[] = eligible
      .slice()
      .sort((a, b) => b.priority_tier - a.priority_tier || Number(a.monthly_price) - Number(b.monthly_price))
      .slice(0, 5)
      .map((c) => ({
        campaignId: c.id,
        companyName: c.company_name,
        label: c.label,
        monthlyPrice: Number(c.monthly_price),
        illustrative: c.illustrative,
        isWinner: false,
      }));

    if (eligible.length === 0) {
      for (let rank = 0; rank < withReason.length; rank++) {
        const r = withReason[rank];
        await tx`
          insert into lead_assignments (lead_id, campaign_id, company_id, rank, is_winner, reason, illustrative)
          values (${leadId}, ${r.campaign.id}, ${r.campaign.company_id}, ${rank + 1}, false, ${r.reason ?? "no elegible"}, true)
        `;
      }
      return { ranked: [], winnerCompanyName: null };
    }

    const topTier = Math.max(...eligible.map((c) => c.priority_tier));
    const topTierCampaigns = eligible.filter((c) => c.priority_tier === topTier);
    const winner = topTierCampaigns
      .slice()
      .sort((a, b) => fillRatio(a) - fillRatio(b) || b.priority_weight - a.priority_weight || a.id - b.id)[0];

    await tx`update campaigns set assigned_count = assigned_count + 1 where id = ${winner.id}`;

    for (let rank = 0; rank < withReason.length; rank++) {
      const r = withReason[rank];
      const isWinner = r.campaign.id === winner.id;
      const reason = r.reason
        ? r.reason
        : isWinner
          ? `tier ${winner.priority_tier}, ratio de reparto ${fillRatio(winner).toFixed(2)} (el más bajo de su tier)`
          : "elegible pero no ganó el reparto ponderado";
      await tx`
        insert into lead_assignments (lead_id, campaign_id, company_id, rank, is_winner, reason, illustrative)
        values (${leadId}, ${r.campaign.id}, ${r.campaign.company_id}, ${rank + 1}, ${isWinner}, ${reason}, true)
      `;
    }

    return {
      ranked: ranked.map((t) => (t.campaignId === winner.id ? { ...t, isWinner: true } : t)),
      winnerCompanyName: winner.company_name,
    };
  });
}
