"use client";

import { useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  created_at: string;
  source: "newsletter" | "comparador" | "lead_magnet";
  campaign: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  tariff_type: string | null;
  postal_code: string | null;
  monthly_bill_estimate: string | null;
  consent: boolean;
  customer_type: string | null;
  household_size: string | null;
  surface_m2: string | null;
  current_company: string | null;
};

type SortKey = keyof Pick<Lead, "created_at" | "source" | "name" | "email" | "tariff_type">;

const SOURCE_LABELS: Record<Lead["source"], string> = {
  newsletter: "Newsletter",
  comparador: "Comparador",
  lead_magnet: "Lead magnet",
};

const SOURCE_COLORS: Record<Lead["source"], string> = {
  newsletter: "bg-card-navy",
  comparador: "bg-orange",
  lead_magnet: "bg-navy",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCSV(rows: Lead[]) {
  const headers = [
    "Fecha", "Origen", "Campaña", "Nombre", "Email", "Teléfono", "Tarifa", "CP", "Factura est.",
    "Tipo cliente", "Nº personas", "Superficie", "Compañía actual", "Consentimiento",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(",")];
  for (const r of rows) {
    lines.push(
      [
        formatDate(r.created_at),
        SOURCE_LABELS[r.source],
        r.campaign ?? "",
        r.name ?? "",
        r.email,
        r.phone ?? "",
        r.tariff_type ?? "",
        r.postal_code ?? "",
        r.monthly_bill_estimate ?? "",
        r.customer_type ?? "",
        r.household_size ?? "",
        r.surface_m2 ?? "",
        r.current_company ?? "",
        r.consent ? "Sí" : "No",
      ]
        .map((v) => escape(String(v)))
        .join(",")
    );
  }
  return lines.join("\n");
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | Lead["source"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((data) => {
        setLeads(data.leads);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const filtered = useMemo(() => {
    let rows = leads;
    if (sourceFilter !== "all") rows = rows.filter((r) => r.source === sourceFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((r) =>
        [r.name, r.email, r.phone].some((f) => f && f.toLowerCase().includes(q))
      );
    }
    const sorted = [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString().toLowerCase();
      const bv = (b[sortKey] ?? "").toString().toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [leads, query, sourceFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleExport() {
    const csv = toCSV(filtered);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tarifalo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "created_at", label: "Fecha" },
    { key: "source", label: "Origen" },
    { key: "name", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "tariff_type", label: "Tarifa" },
  ];

  return (
    <div className="min-h-screen bg-cream px-6 py-12 text-navy md:px-[50px]">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <a href="/" className="font-sans text-lg font-bold lowercase text-navy/50">
              tarífalo
            </a>
            <h1 className="mt-1 font-sans text-3xl font-extrabold text-navy">Leads</h1>
          </div>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="rounded-full bg-orange px-6 py-2.5 font-sans text-sm font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50"
          >
            ⬇ Exportar CSV ({filtered.length})
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono…"
            className="min-w-[260px] flex-1 rounded-xl border border-navy/15 bg-white px-4 py-2.5 font-sans text-sm text-navy focus:border-orange focus:outline-none"
          />
          <div className="flex gap-2">
            {(["all", "lead_magnet", "comparador", "newsletter"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`rounded-full px-4 py-2.5 font-sans text-xs font-semibold transition-colors ${
                  sourceFilter === s ? "bg-navy text-white" : "bg-white text-navy/60 hover:text-navy"
                }`}
              >
                {s === "all" ? "Todos" : SOURCE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" && <p className="font-sans text-sm text-navy/60">Cargando leads…</p>}
        {status === "error" && (
          <p className="font-sans text-sm text-red-600">No se han podido cargar los leads. Revisa la conexión a la base de datos.</p>
        )}

        {status === "ready" && (
          <div className="overflow-x-auto rounded-2xl bg-white">
            <table className="w-full min-w-[900px] border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-card-navy text-left text-white">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 font-semibold"
                    >
                      {col.label}
                      {sortKey === col.key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                    </th>
                  ))}
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Teléfono</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">CP</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Factura est.</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Tipo cliente</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Nº personas</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Superficie</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Compañía actual</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Campaña</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Consiente</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/40"}>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{formatDate(lead.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${SOURCE_COLORS[lead.source]}`}>
                        {SOURCE_LABELS[lead.source]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-navy">{lead.name ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.tariff_type ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.phone ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.postal_code ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">
                      {lead.monthly_bill_estimate ? `${lead.monthly_bill_estimate} €` : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80 capitalize">{lead.customer_type ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.household_size ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.surface_m2 ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/80">{lead.current_company ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-navy/60">{lead.campaign ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3">{lead.consent ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center font-sans text-sm text-navy/50">No hay leads que coincidan con el filtro.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
