// admin/src/context/ResponsesContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { AddClientModal } from '@/components/AddClientModal';
import {
  downloadClientSignedAgreementFromAdmin,
  downloadOfficialClientQuotePdfFromAdmin,
} from '@/lib/agreementPdfAdmin';
import { evaluateProjectQuote } from '@/lib/pricingEngine';

interface ResponsesContextValue {
  selectedQuote: any | null;
  complexDraft: any;
  setComplexDraft: Dispatch<SetStateAction<any>>;
  liveEval: any;
  savingQuote: boolean;
  saveUpdatedClientQuote: () => Promise<void>;
  openEditClientModal: () => void;
  sym: string;
}

const ResponsesContext = createContext<ResponsesContextValue | null>(null);

export const useResponses = () => {
  const ctx = useContext(ResponsesContext);
  if (!ctx) throw new Error('useResponses must be used within ResponsesProvider');
  return ctx;
};

export const ResponsesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    authenticated,
    quotes,
    setQuotes,
    quotesLoading,
    ensureQuotesLoaded,
    pricingConfig,
    ensurePricingLoaded,
  } = useAdmin();

  const [selectedQuote, setSelectedQuote] = useState<any | null>(quotes[0] || null);
  const [complexDraft, setComplexDraft] = useState<any>(
    quotes[0] ? { ...quotes[0].complexConfig, isAdminComplexOverride: true } : null
  );
  const [savingQuote, setSavingQuote] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [updatingCompletion, setUpdatingCompletion] = useState(false);

  useEffect(() => {
    if (authenticated) {
      ensureQuotesLoaded();
      ensurePricingLoaded();
    }
  }, [authenticated, ensureQuotesLoaded, ensurePricingLoaded]);

  const selectClientQuote = (q: any) => {
    setSelectedQuote(q);
    setComplexDraft({ ...q.complexConfig, isAdminComplexOverride: true });
  };

  useEffect(() => {
    if (!selectedQuote && quotes.length > 0) {
      selectClientQuote(quotes[0]);
    }
  }, [quotes, selectedQuote]);

  // Instantaneous 0ms calculation in memory whenever complexDraft or pricingConfig changes
  const liveEval = useMemo(() => {
    if (!complexDraft) return selectedQuote?.evaluatedQuote || null;
    return evaluateProjectQuote(
      { ...complexDraft, isAdminComplexOverride: true },
      pricingConfig
    );
  }, [complexDraft, pricingConfig, selectedQuote]);

  const handleDeleteQuote = async (id: string, clientName: string) => {
    if (!window.confirm(`Permanently delete client record "${clientName}"?`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/quotes?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      const remaining = quotes.filter((q) => q._id !== id);
      setQuotes(remaining);
      if (selectedQuote?._id === id) {
        if (remaining.length > 0) selectClientQuote(remaining[0]);
        else setSelectedQuote(null);
      }
    }
    setDeletingId(null);
  };

  const handleUpdateCompletionAndDate = async (
    quoteItem: any,
    nextCompleted: boolean,
    nextDate: string
  ) => {
    setUpdatingCompletion(true);
    const resolvedDate =
      nextCompleted && !nextDate ? new Date().toISOString().split('T')[0] : nextDate;

    const res = await fetch('/api/quotes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: quoteItem._id,
        isCompleted: nextCompleted,
        deliveryDate: resolvedDate,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setQuotes((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      if (selectedQuote?._id === updated._id) {
        setSelectedQuote(updated);
      }
    }
    setUpdatingCompletion(false);
  };

  const saveUpdatedClientQuote = async () => {
    if (!selectedQuote || !complexDraft) return;
    setSavingQuote(true);
    const res = await fetch('/api/quotes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedQuote._id,
        complexConfig: complexDraft,
        status: selectedQuote.isCompleted ? 'COMPLETED' : 'REVIEWED',
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setQuotes((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setSelectedQuote(updated);
    }
    setSavingQuote(false);
  };

  const totalCareerClients = quotes.length;
  const completedClientsCount = quotes.filter((q) => q.isCompleted).length;
  const activeClientsCount = totalCareerClients - completedClientsCount;

  const sym = liveEval?.currencySymbol || (selectedQuote?.region === 'INDIA' ? '₹' : '$');

  return (
    <ResponsesContext.Provider
      value={{
        selectedQuote,
        complexDraft,
        setComplexDraft,
        liveEval,
        savingQuote,
        saveUpdatedClientQuote,
        openEditClientModal: () => {
          if (selectedQuote) setEditingClient(selectedQuote);
        },
        sym,
      }}
    >
      <div className="space-y-6">
        {/* CAREER CLIENTS TELEMETRY HEADER */}
        <div className="admin-surface-card flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:px-7">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                Total Career Clients
              </span>
              <p className="mt-0.5 text-2xl font-black sm:text-3xl">{totalCareerClients}</p>
            </div>
            <div className="h-8 w-[1px] bg-neutral-500/20" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                Completed &amp; Delivered
              </span>
              <p className="mt-0.5 text-2xl font-black sm:text-3xl">{completedClientsCount}</p>
            </div>
            <div className="h-8 w-[1px] bg-neutral-500/20" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                Active / In Progress
              </span>
              <p className="mt-0.5 text-2xl font-black sm:text-3xl">{activeClientsCount}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddClientModal(true)}
            className="liquid-glass-active cursor-pointer self-start rounded-full px-6 py-3 text-xs font-bold shadow-md sm:self-auto"
          >
            + Add Client Manually
          </button>
        </div>

        {showAddClientModal && (
          <AddClientModal
            onClose={() => setShowAddClientModal(false)}
            onClientAdded={(newClient) => {
              setQuotes((prev) => [newClient, ...prev]);
              selectClientQuote(newClient);
            }}
          />
        )}

        {editingClient && (
          <AddClientModal
            initialClient={editingClient}
            onClose={() => setEditingClient(null)}
            onClientAdded={(updatedClient) => {
              setQuotes((prev) =>
                prev.map((item) => (item._id === updatedClient._id ? updatedClient : item))
              );
              selectClientQuote(updatedClient);
            }}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT SIDEBAR: CLIENT DIRECTORY */}
          <aside className="space-y-3 lg:col-span-4 xl:col-span-3">
            <h2 className="px-1 text-xs font-bold uppercase tracking-widest opacity-50">
              Client Directory ({quotes.length})
            </h2>

            {quotesLoading && quotes.length === 0 ? (
              <div className="admin-surface-card rounded-3xl p-6 text-xs opacity-65">
                Loading Client Responses...
              </div>
            ) : quotes.length === 0 ? (
              <div className="admin-surface-card rounded-3xl p-6 text-xs opacity-65">
                No clients recorded yet. Click &quot;+ Add Client Manually&quot; or submit a brief
                on prices.byfalguni.com.
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {quotes.map((q) => {
                const isSelected = selectedQuote?._id === q._id;
                const qSym = q.region === 'INDIA' ? '₹' : '$';
                const dt = new Date(q.createdAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
                const flagCode = (q.countryCode || 'IN').toLowerCase();

                return (
                  <div
                    key={q._id}
                    onClick={() => selectClientQuote(q)}
                    className={`cursor-pointer rounded-3xl p-4 transition sm:p-5 ${
                      isSelected
                        ? 'liquid-glass-active'
                        : 'admin-surface-card hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={`https://flagcdn.com/w40/${flagCode}.png`}
                          alt={q.countryName}
                          className="h-4 w-6 shrink-0 rounded-xs object-cover"
                        />
                        <span className="truncate text-sm font-bold sm:text-base">
                          {q.fullName}
                        </span>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black shadow-2xs ${
                          isSelected
                            ? 'bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white'
                            : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                        }`}
                      >
                        {qSym}
                        {Number(q.evaluatedQuote?.grandTotal || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-bold ${
                          q.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-neutral-500/20 opacity-85'
                        }`}
                      >
                        {q.isCompleted
                          ? `✓ Completed ${q.deliveryDate ? `(${q.deliveryDate})` : ''}`
                          : 'In Progress'}
                      </span>
                      {q.source === 'MANUAL' && (
                        <span className="rounded-full bg-neutral-500/20 px-2 py-0.5 font-semibold opacity-80">
                          Manual
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                      <span className="truncate opacity-75">
                        {q.businessName || 'Direct Enquiry'} • {dt}
                      </span>
                      <button
                        type="button"
                        disabled={deletingId === q._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuote(q._id, q.fullName);
                        }}
                        className="cursor-pointer rounded-full border border-current/25 px-2.5 py-1 text-[10px] font-bold opacity-80 hover:opacity-100"
                      >
                        {deletingId === q._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT WORKSPACE: FULL CLIENT DETAILS & SUBPAGE ROUTES */}
          <section className="lg:col-span-8 xl:col-span-9">
            {selectedQuote ? (
              <div className="admin-surface-card rounded-3xl p-4 sm:p-8">
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-6 xl:flex-row xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <img
                        src={`https://flagcdn.com/w40/${(
                          selectedQuote.countryCode || 'IN'
                        ).toLowerCase()}.png`}
                        alt={selectedQuote.countryName}
                        className="h-5 w-7 rounded-xs object-cover"
                      />
                      <h2 className="text-xl font-black sm:text-2xl">{selectedQuote.fullName}</h2>
                      <span className="glass-subcard rounded-full px-3 py-1 text-xs font-bold">
                        {selectedQuote.countryName} ({selectedQuote.region})
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs opacity-65">
                      Submitted on{' '}
                      {new Date(selectedQuote.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/responses/simple"
                      prefetch={true}
                      className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                        pathname === '/responses/simple' ? 'liquid-glass-active' : 'glass-subcard'
                      }`}
                    >
                      Client Response (Simple)
                    </Link>
                    <Link
                      href="/responses/complex"
                      prefetch={true}
                      className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                        pathname === '/responses/complex' ? 'liquid-glass-active' : 'glass-subcard'
                      }`}
                    >
                      Project Price (Complex)
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditingClient(selectedQuote)}
                      className="glass-subcard cursor-pointer rounded-full px-4 py-2 text-xs font-bold hover:opacity-100"
                    >
                      ✎ Edit Client Details
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadOfficialClientQuotePdfFromAdmin(selectedQuote, liveEval)
                      }
                      className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
                    >
                      ↓ Download Official Quote PDF
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadClientSignedAgreementFromAdmin(selectedQuote, liveEval)
                      }
                      className="glass-subcard cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
                    >
                      ↓ Agreement PDF
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteQuote(selectedQuote._id, selectedQuote.fullName)
                      }
                      className="glass-subcard cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* COMPLETED TOGGLE & EDITABLE DELIVERY DATE BAR */}
                <div className="glass-subcard mt-5 flex flex-col justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={updatingCompletion}
                      onClick={() =>
                        handleUpdateCompletionAndDate(
                          selectedQuote,
                          !selectedQuote.isCompleted,
                          selectedQuote.deliveryDate || new Date().toISOString().split('T')[0]
                        )
                      }
                      className={`cursor-pointer rounded-full px-5 py-2 text-xs font-bold transition ${
                        selectedQuote.isCompleted ? 'liquid-glass-active' : 'glass-input'
                      }`}
                    >
                      {selectedQuote.isCompleted ? '✓ Completed' : 'Mark as Completed'}
                    </button>
                    <span className="text-xs opacity-65">
                      {selectedQuote.isCompleted
                        ? 'Project is marked delivered in your Career Ledger.'
                        : 'Click when project is delivered to client.'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <label className="text-xs font-bold opacity-75">
                      Delivery Date (Editable):
                    </label>
                    <input
                      type="date"
                      value={selectedQuote.deliveryDate || ''}
                      onChange={(e) =>
                        handleUpdateCompletionAndDate(
                          selectedQuote,
                          Boolean(selectedQuote.isCompleted),
                          e.target.value
                        )
                      }
                      className="glass-input cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                </div>

                {children}
              </div>
            ) : (
              /* Always keep {children} mounted in the render tree so Next.js 16 instant-navigation validation succeeds */
              <div className="hidden">{children}</div>
            )}
          </section>
        </div>
      </div>
    </ResponsesContext.Provider>
  );
};