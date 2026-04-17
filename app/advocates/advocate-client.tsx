"use client";

// app/advocates/AdvocatesClient.tsx

import { useState, useMemo } from "react";
import type { Lead } from "./page";

const PAGE_SIZE = 30;

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "New", value: "new" },
  { label: "Follow Up", value: "follow_up" },
  { label: "Interested", value: "interested" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Closed", value: "closed" },
];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-sky-100 text-sky-700 border-sky-200",
  follow_up: "bg-amber-100 text-amber-700 border-amber-200",
  interested: "bg-emerald-100 text-emerald-700 border-emerald-200",
  not_interested: "bg-rose-100 text-rose-700 border-rose-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_DOT: Record<string, string> = {
  new: "bg-sky-500",
  follow_up: "bg-amber-500",
  interested: "bg-emerald-500",
  not_interested: "bg-rose-500",
  closed: "bg-slate-400",
};

interface Props {
  leads: Lead[];
}

export default function AdvocatesClient({ leads }: Props) {
  const [statusFilter, setStatusFilter] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [hasWhatsapp, setHasWhatsapp] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasSocial, setHasSocial] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = leads;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.notes?.toLowerCase().includes(q)
      );
    }

    if (statusFilter) list = list.filter((l) => l.status === statusFilter);
    if (hasPhone) list = list.filter((l) => !!l.phone);
    if (hasWhatsapp) list = list.filter((l) => !!l.whatsapp);
    if (hasEmail) list = list.filter((l) => !!l.email);
    if (hasSocial)
      list = list.filter(
        (l) => !!l.instagram || !!l.facebook || !!l.x || !!l.linkedin
      );

    return list;
  }, [leads, statusFilter, hasPhone, hasWhatsapp, hasEmail, hasSocial, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-stone-200 px-6 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-mono">
            Advocates
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {filtered.length} lead{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Page {currentPage}/{totalPages}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, phone, notes…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setStatusFilter(s.value);
                    resetPage();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    statusFilter === s.value
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-stone-200 hidden sm:block" />

            {/* Field filters */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "📞 Phone",
                  state: hasPhone,
                  set: setHasPhone,
                },
                {
                  label: "💬 WhatsApp",
                  state: hasWhatsapp,
                  set: setHasWhatsapp,
                },
                {
                  label: "✉️ Email",
                  state: hasEmail,
                  set: setHasEmail,
                },
                {
                  label: "🌐 Social",
                  state: hasSocial,
                  set: setHasSocial,
                },
              ].map(({ label, state, set }) => (
                <button
                  key={label}
                  onClick={() => {
                    set(!state);
                    resetPage();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    state
                      ? "bg-stone-800 text-white border-stone-800"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Leads Grid ── */}
        {paginated.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No leads match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 disabled:opacity-40 hover:bg-stone-100 transition"
            >
              ← Prev
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 2
                )
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && (arr[i - 1] as number) < p - 1)
                    acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 py-2 text-stone-400 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                        currentPage === item
                          ? "bg-stone-900 text-white"
                          : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 disabled:opacity-40 hover:bg-stone-100 transition"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─────────────────────────────── Lead Card ─────────────────────────────── */

function LeadCard({ lead }: { lead: Lead }) {
  const initials = lead.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === lead.status)?.label ?? lead.status;

  const socials: { icon: string; url: string; label: string }[] = [
    lead.instagram
      ? {
          icon: "IG",
          url: `https://instagram.com/${lead.instagram.replace("@", "")}`,
          label: "Instagram",
        }
      : null,
    lead.facebook
      ? {
          icon: "FB",
          url: lead.facebook.startsWith("http")
            ? lead.facebook
            : `https://facebook.com/${lead.facebook}`,
          label: "Facebook",
        }
      : null,
    lead.x
      ? {
          icon: "𝕏",
          url: `https://x.com/${lead.x.replace("@", "")}`,
          label: "X / Twitter",
        }
      : null,
    lead.linkedin
      ? {
          icon: "in",
          url: lead.linkedin.startsWith("http")
            ? lead.linkedin
            : `https://linkedin.com/in/${lead.linkedin}`,
          label: "LinkedIn",
        }
      : null,
  ].filter(Boolean) as { icon: string; url: string; label: string }[];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      {/* Top row: avatar + name + status */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate leading-tight">
            {lead.name}
          </p>
          {lead.source && (
            <p className="text-xs text-stone-400 truncate">{lead.source}</p>
          )}
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            STATUS_STYLES[lead.status] ?? "bg-stone-100 text-stone-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[lead.status] ?? "bg-stone-400"}`}
          />
          {statusLabel}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {lead.phone && (
          <ActionButton
            href={`tel:${lead.phone}`}
            color="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5s1.5 3 5 5l1.113-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            label="Call"
          />
        )}

        {lead.whatsapp && (
          <ActionButton
            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
            color="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.856L.054 23.25a.75.75 0 00.916.916l5.395-1.478A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.632-.484-5.163-1.334l-.37-.213-3.84 1.05 1.05-3.84-.213-.37A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            }
            label="WhatsApp"
            newTab
          />
        )}

        {lead.email && (
          <ActionButton
            href={`mailto:${lead.email}`}
            color="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            label="Email"
          />
        )}
      </div>

      {/* Social links row */}
      {socials.length > 0 && (
        <div className="flex gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-[11px] font-bold text-stone-600 transition"
            >
              {s.icon}
            </a>
          ))}
        </div>
      )}

      {/* Notes */}
      {lead.notes && (
        <p className="text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100 line-clamp-2">
          {lead.notes}
        </p>
      )}

      {/* Edit button */}
      <a
        href={`/admin/#/collections/advocates-leads/entries/${lead.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit in CMS
      </a>
    </div>
  );
}

/* ─────────────────────────── Action Button ─────────────────────────────── */

function ActionButton({
  href,
  icon,
  label,
  color,
  newTab,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${color}`}
    >
      {icon}
      {label}
    </a>
  );
}