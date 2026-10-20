// admin/src/components/ResponsesTab.tsx
import {
  useState,
  useEffect,
  type FC,
  type Dispatch,
  type SetStateAction,
} from "react";
import { AddClientModal } from "./AddClientModal";
import { downloadClientSignedAgreementFromAdmin } from "@/lib/agreementPdfAdmin";

interface Props {
  quotes: any[];
  setQuotes: Dispatch<SetStateAction<any[]>>;
}

export const ResponsesTab: FC<Props> = ({ quotes, setQuotes }) => {
  const [selectedQuote, setSelectedQuote] = useState<any | null>(
    quotes[0] || null,
  );
  const [responseSubTab, setResponseSubTab] = useState<
    "SIMPLE_VIEW" | "COMPLEX_CALC"
  >("SIMPLE_VIEW");
  const [complexDraft, setComplexDraft] = useState<any>(
    quotes[0]
      ? { ...quotes[0].complexConfig, isAdminComplexOverride: true }
      : null,
  );
  const [liveEval, setLiveEval] = useState<any>(
    quotes[0]?.evaluatedQuote || null,
  );
  const [savingQuote, setSavingQuote] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [updatingCompletion, setUpdatingCompletion] = useState(false);

  useEffect(() => {
    if (!selectedQuote && quotes.length > 0) {
      selectClientQuote(quotes[0]);
    }
  }, [quotes]);

  const selectClientQuote = (q: any) => {
    setSelectedQuote(q);
    setComplexDraft({ ...q.complexConfig, isAdminComplexOverride: true });
    setLiveEval(q.evaluatedQuote);
  };

  useEffect(() => {
    if (!complexDraft) return;
    const timer = setTimeout(() => {
      fetch("/api/quote/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...complexDraft, isAdminComplexOverride: true }),
      })
        .then((r) => r.json())
        .then((d) => setLiveEval(d))
        .catch(() => {});
    }, 150);
    return () => clearTimeout(timer);
  }, [complexDraft]);

  const handleDeleteQuote = async (id: string, clientName: string) => {
    if (!window.confirm(`Permanently delete client record "${clientName}"?`))
      return;
    setDeletingId(id);
    const res = await fetch(`/api/quotes?id=${id}`, { method: "DELETE" });
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
    nextDate: string,
  ) => {
    setUpdatingCompletion(true);
    const resolvedDate =
      nextCompleted && !nextDate
        ? new Date().toISOString().split("T")[0]
        : nextDate;

    const res = await fetch("/api/quotes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: quoteItem._id,
        isCompleted: nextCompleted,
        deliveryDate: resolvedDate,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setQuotes((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
      if (selectedQuote?._id === updated._id) {
        setSelectedQuote(updated);
      }
    }
    setUpdatingCompletion(false);
  };

  const saveUpdatedClientQuote = async () => {
    if (!selectedQuote || !complexDraft) return;
    setSavingQuote(true);
    const res = await fetch("/api/quotes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedQuote._id,
        complexConfig: complexDraft,
        status: selectedQuote.isCompleted ? "COMPLETED" : "REVIEWED",
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setQuotes((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
      setSelectedQuote(updated);
    }
    setSavingQuote(false);
  };

  const totalCareerClients = quotes.length;
  const completedClientsCount = quotes.filter((q) => q.isCompleted).length;
  const activeClientsCount = totalCareerClients - completedClientsCount;

  const sym =
    liveEval?.currencySymbol || (selectedQuote?.region === "INDIA" ? "₹" : "$");
  const customNotesObj = selectedQuote?.simpleChoices?.customSectionNotes || {};
  const selectedFeatureTags: string[] =
    selectedQuote?.simpleChoices?.selectedTags || [];
  const isRush = Boolean(
    selectedQuote?.rushDelivery ?? selectedQuote?.simpleChoices?.rushDelivery,
  );

  // Strip any legacy "Selected Features: ..." prefix from old test records so functionalities are never shown twice
  const cleanExtraBriefNote =
    customNotesObj.briefExtraNote ||
    String(selectedQuote?.clientDescription || "")
      .replace(/^Selected Features:.*(\n|$)/i, "")
      .trim();

  return (
    <div className="space-y-6">
      {/* CAREER CLIENTS TELEMETRY HEADER */}
      <div className="admin-surface-card flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:px-7">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Total Career Clients
            </span>
            <p className="mt-0.5 text-2xl font-black sm:text-3xl">
              {totalCareerClients}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-neutral-500/20" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Completed & Delivered
            </span>
            <p className="mt-0.5 text-2xl font-black sm:text-3xl">
              {completedClientsCount}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-neutral-500/20" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              Active / In Progress
            </span>
            <p className="mt-0.5 text-2xl font-black sm:text-3xl">
              {activeClientsCount}
            </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT SIDEBAR: CLIENT DIRECTORY (FIXED PRICE PILL CONTRAST!) */}
        <aside className="space-y-3 lg:col-span-4 xl:col-span-3">
          <h2 className="px-1 text-xs font-bold uppercase tracking-widest opacity-50">
            Client Directory ({quotes.length})
          </h2>

          {quotes.length === 0 && (
            <div className="admin-surface-card rounded-3xl p-6 text-xs opacity-65">
              No clients recorded yet. Click &quot;+ Add Client Manually&quot;
              or submit a quote on prices.byfalguni.com.
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {quotes.map((q) => {
              const isSelected = selectedQuote?._id === q._id;
              const qSym = q.region === "INDIA" ? "₹" : "$";
              const dt = new Date(q.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              });
              const flagCode = (q.countryCode || "IN").toLowerCase();

              return (
                <div
                  key={q._id}
                  onClick={() => selectClientQuote(q)}
                  className={`cursor-pointer rounded-3xl p-4 sm:p-5 transition ${
                    isSelected
                      ? "liquid-glass-active"
                      : "admin-surface-card hover:border-neutral-400"
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

                    {/* High-Contrast Price Badge (Never white-on-white!) */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black shadow-2xs ${
                        isSelected
                          ? "bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white"
                          : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                      }`}
                    >
                      {qSym}
                      {Number(
                        q.evaluatedQuote?.grandTotal || 0,
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold ${
                        q.isCompleted
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-neutral-500/20 opacity-85"
                      }`}
                    >
                      {q.isCompleted
                        ? `✓ Completed ${q.deliveryDate ? `(${q.deliveryDate})` : ""}`
                        : "In Progress"}
                    </span>
                    {q.source === "MANUAL" && (
                      <span className="rounded-full bg-neutral-500/20 px-2 py-0.5 font-semibold opacity-80">
                        Manual
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate opacity-75">
                      {q.businessName || "Direct Enquiry"} • {dt}
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
                      {deletingId === q._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT WORKSPACE: FULL CLIENT DETAILS & COMPLEX CALCULATOR */}
        <section className="lg:col-span-8 xl:col-span-9">
          {selectedQuote ? (
            <div className="admin-surface-card rounded-3xl p-4 sm:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-neutral-500/15 pb-6 xl:flex-row xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <img
                      src={`https://flagcdn.com/w40/${(
                        selectedQuote.countryCode || "IN"
                      ).toLowerCase()}.png`}
                      alt={selectedQuote.countryName}
                      className="h-5 w-7 rounded-xs object-cover"
                    />
                    <h2 className="text-xl font-black sm:text-2xl">
                      {selectedQuote.fullName}
                    </h2>
                    <span className="glass-subcard rounded-full px-3 py-1 text-xs font-bold">
                      {selectedQuote.countryName} ({selectedQuote.region})
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs opacity-65">
                    Submitted on{" "}
                    {new Date(selectedQuote.createdAt).toLocaleString("en-IN", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setResponseSubTab("SIMPLE_VIEW")}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                      responseSubTab === "SIMPLE_VIEW"
                        ? "liquid-glass-active"
                        : "glass-subcard"
                    }`}
                  >
                    Client Response (Simple)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResponseSubTab("COMPLEX_CALC")}
                    className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition ${
                      responseSubTab === "COMPLEX_CALC"
                        ? "liquid-glass-active"
                        : "glass-subcard"
                    }`}
                  >
                    Project Price (Complex)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadClientSignedAgreementFromAdmin(
                        selectedQuote,
                        liveEval,
                      )
                    }
                    className="liquid-glass-active cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
                  >
                    ↓ Download Signed Agreement PDF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteQuote(
                        selectedQuote._id,
                        selectedQuote.fullName,
                      )
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
                        selectedQuote.deliveryDate ||
                          new Date().toISOString().split("T")[0],
                      )
                    }
                    className={`cursor-pointer rounded-full px-5 py-2 text-xs font-bold transition ${
                      selectedQuote.isCompleted
                        ? "liquid-glass-active"
                        : "glass-input"
                    }`}
                  >
                    {selectedQuote.isCompleted
                      ? "✓ Completed"
                      : "Mark as Completed"}
                  </button>
                  <span className="text-xs opacity-65">
                    {selectedQuote.isCompleted
                      ? "Project is marked delivered in your Career Ledger."
                      : "Click when project is delivered to client."}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="text-xs font-bold opacity-75">
                    Delivery Date (Editable):
                  </label>
                  <input
                    type="date"
                    value={selectedQuote.deliveryDate || ""}
                    onChange={(e) =>
                      handleUpdateCompletionAndDate(
                        selectedQuote,
                        Boolean(selectedQuote.isCompleted),
                        e.target.value,
                      )
                    }
                    className="glass-input cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>

              {/* =========================================================
                  SUB-TAB 1: COMPLETE CLIENT RECORD (ALL 5 TABS + SIGNED AGREEMENT)
              ========================================================= */}
              {responseSubTab === "SIMPLE_VIEW" && (
                <div className="mt-6 space-y-6">
                  {/* Top Financial & Timeline Summary */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="glass-subcard rounded-2xl p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                        Client Target Budget
                      </span>
                      <p className="mt-1 text-xl font-black">
                        {sym}
                        {Number(selectedQuote.budget || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="glass-subcard rounded-2xl p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                        Calculated Quote Total
                      </span>
                      <p className="mt-1 text-xl font-black">
                        {sym}
                        {Number(liveEval?.grandTotal || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="glass-subcard rounded-2xl p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                        Rush Delivery (+30%)
                      </span>
                      <p className="mt-1 text-sm font-bold">
                        {isRush
                          ? "Yes (Rush Requested)"
                          : "No (Standard Timeline)"}
                      </p>
                    </div>
                    <div className="glass-subcard rounded-2xl p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                        Delivery Date
                      </span>
                      <p className="mt-1 text-sm font-bold">
                        {selectedQuote.deliveryDate || "Not delivered yet"}
                      </p>
                    </div>
                  </div>

                  {/* CARD A: TAB 01 — CLIENT PERSONAL & CONTACT DETAILS */}
                  <div className="glass-subcard space-y-3 rounded-2xl p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
                      01 • Client Personal, Contact & Region Details
                    </span>
                    <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Full Name
                        </span>
                        <p className="mt-0.5 text-sm font-bold">
                          {selectedQuote.fullName}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Email Address
                        </span>
                        <p className="mt-0.5 break-all text-sm font-bold">
                          {selectedQuote.email ||
                            selectedQuote.emailPhone ||
                            "—"}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Phone / WhatsApp
                        </span>
                        <p className="mt-0.5 text-sm font-bold">
                          {selectedQuote.phone ||
                            selectedQuote.emailPhone ||
                            "—"}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Region & Currency
                        </span>
                        <p className="mt-0.5 text-sm font-bold">
                          {selectedQuote.countryName} ({selectedQuote.region} •{" "}
                          {sym})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD B: TAB 05 — TELL ME ABOUT YOUR BUSINESS & DESIGN REFERENCES */}
                  <div className="glass-subcard space-y-4 rounded-2xl p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
                      05 • Tell Me About Your Business & Design References
                      (Mandatory Brief)
                    </span>

                    <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                      <div className="rounded-xl border border-neutral-500/15 p-3.5">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Business Name & What It Does
                        </span>
                        <p className="mt-1 text-sm font-bold">
                          {selectedQuote.businessName || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-500/15 p-3.5">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Main Website Goal
                        </span>
                        <p className="mt-1 text-sm font-bold">
                          {selectedQuote.mainGoal || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-500/15 p-3.5">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Ideal Launch Date & Reason
                        </span>
                        <p className="mt-1 text-sm font-bold">
                          {selectedQuote.launchDateReason || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-500/15 p-4">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Description of the Business
                        </span>
                        <p className="mt-1.5 wrap-break-words whitespace-pre-wrap text-sm font-semibold">
                          {selectedQuote.businessDescription || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-500/15 p-4">
                      <span className="block text-[10px] font-bold uppercase opacity-50">
                        Figma Design Link OR 3 Website URLs That You Love
                      </span>
                      <p className="mt-1.5 break-words whitespace-pre-wrap text-sm font-semibold">
                        {selectedQuote.designReferences || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-500/15 p-4 text-xs">
                      <span className="block text-[10px] font-bold uppercase opacity-50">
                        Anything Else You Want Me to Know? (Optional Brief Note)
                      </span>
                      <p className="mt-1 font-medium">
                        {cleanExtraBriefNote ||
                          "No additional brief note written."}
                      </p>
                    </div>
                  </div>

                  {/* CARD C: TABS 02, 03 & 04 — SCOPE CHOICES, FUNCTIONALITIES & CUSTOM NOTES */}
                  <div className="glass-subcard space-y-4 rounded-2xl p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-50">
                      02–04 • Website Scope Choices, Functionalities & Section
                      Notes
                    </span>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
                        Website Category:{" "}
                        {selectedQuote.simpleChoices?.projectPurpose ||
                          "Custom"}
                      </span>
                      <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
                        Pages Selected:{" "}
                        {selectedQuote.simpleChoices?.pages || 1}
                      </span>
                      <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
                        Motion & Feel Tier:{" "}
                        {selectedQuote.simpleChoices?.animationTier || "NONE"}
                      </span>
                      <span className="glass-input rounded-full px-3.5 py-1.5 font-bold">
                        Rush Delivery: {isRush ? "Yes (+30%)" : "No"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold uppercase opacity-50">
                        Selected Functionality Options (
                        {selectedFeatureTags.length})
                      </span>
                      {selectedFeatureTags.length === 0 ? (
                        <p className="mt-1 text-xs opacity-60">
                          No functionality tags selected.
                        </p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedFeatureTags.map((t: string) => (
                            <span
                              key={t}
                              className="rounded-full bg-neutral-500/15 px-3 py-1 text-xs font-semibold"
                            >
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Custom Written Texts (Strictly only what the client typed in the 3 custom boxes) */}
                    <div className="grid grid-cols-1 gap-3 border-t border-neutral-500/15 pt-4 text-xs sm:grid-cols-3">
                      <div className="rounded-xl border border-neutral-500/15 p-3">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Tab 02 Custom Category/Pages Note
                        </span>
                        <p className="mt-1 font-medium">
                          {customNotesObj.pagesAndTypeNote ||
                            "No custom text provided"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-500/15 p-3">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Tab 03 Custom Motion/3D Note
                        </span>
                        <p className="mt-1 font-medium">
                          {customNotesObj.motionAndFeelNote ||
                            "No custom text provided"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-neutral-500/15 p-3">
                        <span className="block text-[10px] font-bold uppercase opacity-50">
                          Tab 04 Custom Functionality Note
                        </span>
                        <p className="mt-1 font-medium">
                          {customNotesObj.functionalityNote ||
                            "No custom text provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD D: SIGNED SERVICE GUIDE & AGREEMENT RECORD + DOWNLOAD BUTTON */}
                  <div className="glass-subcard space-y-3 rounded-2xl border border-neutral-500/25 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5733]">
                          Signed Service Guide & Agreement (v3.1)
                        </span>
                        <h4 className="mt-0.5 text-sm font-bold">
                          Client Binding Electronic Acceptance Record
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            downloadClientSignedAgreementFromAdmin(
                              selectedQuote,
                              liveEval,
                            )
                          }
                          className="liquid-glass-active cursor-pointer rounded-full px-5 py-2.5 text-xs font-bold"
                        >
                          ↓ Download Signed Agreement PDF
                        </button>

                        {selectedQuote.signedAgreementPdfUrl && (
                          <a
                            href={selectedQuote.signedAgreementPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="glass-input cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
                          >
                            View ImageKit Cloud Copy ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="rounded-xl bg-neutral-500/10 p-4 text-xs font-medium leading-relaxed">
                      {selectedQuote.signedAgreementText ||
                        `I, ${selectedQuote.fullName} (representing ${
                          selectedQuote.businessName || "my business"
                        }), with contact details ${
                          selectedQuote.emailPhone
                        }, hereby confirm that I have read, understood, and agreed to all agreements, procedures, processes, scope boundaries, revision policies, and payment schedules set forth in the Website Development Service Guide, Pricing & Agreement (Version 3.1).`}
                    </p>

                    <p className="font-mono text-[11px] opacity-60">
                      Signed & Accepted on:{" "}
                      {new Date(
                        selectedQuote.agreedAt || selectedQuote.createdAt,
                      ).toLocaleString("en-IN", {
                        dateStyle: "full",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>

                  {/* CARD E: UPLOADED CLIENT FILES */}
                  <div className="glass-subcard rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase opacity-50">
                        Uploaded Client Project Assets (
                        {(selectedQuote.uploadedAssets || []).length})
                      </span>
                      {selectedQuote.clientFolder && (
                        <span className="font-mono text-[11px] opacity-60">
                          ImageKit Folder: {selectedQuote.clientFolder}
                        </span>
                      )}
                    </div>
                    {(selectedQuote.uploadedAssets || []).length === 0 ? (
                      <p className="mt-1 text-xs opacity-60">
                        No project files uploaded.
                      </p>
                    ) : (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {selectedQuote.uploadedAssets.map(
                          (a: any, i: number) => (
                            <a
                              key={a.fileId || i}
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="glass-input cursor-pointer rounded-full px-4 py-2 text-xs font-bold"
                            >
                              📎 {a.name} ↗
                            </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================
                  SUB-TAB 2: PROJECT PRICE (COMPLEX DEVELOPER CALCULATOR)
              ========================================================= */}
              {responseSubTab === "COMPLEX_CALC" &&
                complexDraft &&
                liveEval && (
                  <div className="mt-6 space-y-6">
                    <div className="glass-subcard rounded-2xl p-4 sm:p-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        Developer Playbook Profit Telemetry (INR Equivalent)
                      </span>
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                        <div>
                          <span className="text-[10px] opacity-60">
                            Gross Received
                          </span>
                          <p className="text-base font-bold sm:text-lg">
                            ₹
                            {liveEval.developerTelemetryInr.grossInrReceived.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] opacity-60">
                            10% Tax Pot
                          </span>
                          <p className="text-base font-bold sm:text-lg">
                            -₹
                            {liveEval.developerTelemetryInr.taxReserveInr.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] opacity-60">
                            Net Profit Target
                          </span>
                          <p className="text-base font-bold sm:text-lg">
                            ₹
                            {liveEval.developerTelemetryInr.netProfitAfterTaxInr.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] opacity-60">
                            9% Buffers
                          </span>
                          <p className="text-base font-bold opacity-70 sm:text-lg">
                            -₹
                            {(
                              liveEval.developerTelemetryInr.caToolsBufferInr +
                              liveEval.developerTelemetryInr.badDebtBufferInr
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold opacity-80">
                            Pure Cash Kept
                          </span>
                          <p className="text-lg font-black sm:text-xl">
                            ₹
                            {liveEval.developerTelemetryInr.pureCashKeptInr.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {[
                        { key: "pages", label: "Static Pages", min: 1 },
                        {
                          key: "extraSectionsStatic",
                          label: "Extra Static Sections",
                          min: 0,
                        },
                        {
                          key: "extraSectionsAdvanced",
                          label: "Extra Adv. Sections",
                          min: 0,
                        },
                        {
                          key: "dynamicTemplates",
                          label: "Dynamic Templates (20x)",
                          min: 0,
                        },
                        {
                          key: "basicFunctionalityPages",
                          label: "Basic Func. Pages",
                          min: 0,
                        },
                        {
                          key: "animationPages",
                          label: "Animated Pages",
                          min: 0,
                        },
                        {
                          key: "webglScenes",
                          label: "3D WebGL Scenes",
                          min: 0,
                        },
                        {
                          key: "crudApiCount",
                          label: "CRUD Data APIs",
                          min: 0,
                        },
                        {
                          key: "adminScreenCount",
                          label: "Admin Screens",
                          min: 0,
                        },
                        {
                          key: "thirdPartyApiCount",
                          label: "Third-Party APIs",
                          min: 0,
                        },
                        {
                          key: "extraHourlyWorkHours",
                          label: "Hourly Custom Work",
                          min: 0,
                        },
                        { key: "discountPercent", label: "Discount %", min: 0 },
                      ].map((f) => (
                        <div
                          key={f.key}
                          className="glass-subcard rounded-2xl p-3.5"
                        >
                          <label className="block text-xs font-bold opacity-80">
                            {f.label}
                          </label>
                          <input
                            type="number"
                            min={f.min}
                            value={complexDraft[f.key] ?? 0}
                            onChange={(e) =>
                              setComplexDraft({
                                ...complexDraft,
                                [f.key]: Number(e.target.value),
                              })
                            }
                            className="glass-input mt-1.5 w-full rounded-xl px-3 py-1.5 text-sm font-bold"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="glass-subcard rounded-2xl p-3.5">
                        <label className="block text-xs font-bold">
                          Animation Tier
                        </label>
                        <select
                          value={complexDraft.animationTier}
                          onChange={(e) =>
                            setComplexDraft({
                              ...complexDraft,
                              animationTier: e.target.value,
                            })
                          }
                          className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <option value="NONE">NONE</option>
                          <option value="BASIC">BASIC ANIMATIONS</option>
                          <option value="ADVANCED">ADVANCED ANIMATIONS</option>
                        </select>
                      </div>

                      <div className="glass-subcard rounded-2xl p-3.5">
                        <label className="block text-xs font-bold">
                          3D Model Integration
                        </label>
                        <select
                          value={complexDraft.modelIntegrationTier}
                          onChange={(e) =>
                            setComplexDraft({
                              ...complexDraft,
                              modelIntegrationTier: e.target.value,
                            })
                          }
                          className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <option value="NONE">NONE</option>
                          <option value="BASIC">BASIC</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="COMPLEX">COMPLEX</option>
                        </select>
                      </div>

                      <div className="glass-subcard rounded-2xl p-3.5">
                        <label className="block text-xs font-bold">
                          3D Model Optimization
                        </label>
                        <select
                          value={complexDraft.modelOptimizationTier}
                          onChange={(e) =>
                            setComplexDraft({
                              ...complexDraft,
                              modelOptimizationTier: e.target.value,
                            })
                          }
                          className="glass-input mt-1.5 w-full cursor-pointer rounded-xl px-3 py-2 text-xs font-bold"
                        >
                          <option value="NONE">NONE</option>
                          <option value="BASIC">BASIC</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="COMPLEX">COMPLEX</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {[
                        { key: "contactForm", label: "Contact Form API" },
                        { key: "newsletter", label: "Newsletter API" },
                        { key: "userLogin", label: "User Login (Auth)" },
                        { key: "roleBasedAccess", label: "Role-Based Access" },
                        {
                          key: "adminDashboardBundle",
                          label: "Admin Dashboard Bundle",
                        },
                        { key: "blogCmsBundle", label: "Blog / CMS Bundle" },
                        {
                          key: "imageKitIntegration",
                          label: "ImageKit Integration",
                        },
                        {
                          key: "serverSearchPagination",
                          label: "Server Search/Filter",
                        },
                        {
                          key: "globalStateManagement",
                          label: "Shopping Cart / Zustand",
                        },
                        {
                          key: "emailTemplates",
                          label: "HTML Email Templates",
                        },
                        { key: "bookingSystem", label: "Booking System" },
                        { key: "paymentGateway", label: "Payment Gateway" },
                        {
                          key: "securityHardening",
                          label: "Security Hardening",
                        },
                        { key: "apiDocumentation", label: "API Documentation" },
                        { key: "darkLightSwitch", label: "Dark/Light Switch" },
                        { key: "pageTransitions", label: "Page Transitions" },
                        { key: "customCursor", label: "Custom Cursor" },
                        { key: "preloader", label: "Preloader" },
                        { key: "customShader", label: "Custom Shader" },
                        {
                          key: "scrollLinkedCamera",
                          label: "Scroll 3D Camera",
                        },
                        { key: "nextjsSeo", label: "Next.js Adv. SEO" },
                        {
                          key: "speedOptimization",
                          label: "Speed Optimization",
                        },
                        { key: "analyticsSetup", label: "Analytics Setup" },
                        { key: "rushDelivery", label: "Rush Delivery (+30%)" },
                      ].map((b) => (
                        <button
                          key={b.key}
                          type="button"
                          onClick={() =>
                            setComplexDraft({
                              ...complexDraft,
                              [b.key]: !complexDraft[b.key],
                            })
                          }
                          className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition ${
                            complexDraft[b.key]
                              ? "liquid-glass-active"
                              : "glass-subcard opacity-80 hover:opacity-100"
                          }`}
                        >
                          {complexDraft[b.key] ? "✓ " : "+ "}
                          {b.label}
                        </button>
                      ))}
                    </div>

                    <div className="glass-subcard rounded-2xl p-4 sm:p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Calculated Line Items ({sym}
                        {Number(liveEval.grandTotal).toLocaleString()})
                      </h4>
                      <div className="mt-3 divide-y divide-neutral-500/15 text-xs">
                        {liveEval.items.map((it: any) => (
                          <div
                            key={it.id}
                            className="flex justify-between gap-4 py-2"
                          >
                            <span className="font-semibold">{it.label}</span>
                            <span className="shrink-0 font-bold">
                              {sym}
                              {it.cost.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={saveUpdatedClientQuote}
                        disabled={savingQuote}
                        className="liquid-glass-active w-full cursor-pointer rounded-full px-8 py-3.5 text-xs font-bold shadow-lg sm:w-auto"
                      >
                        {savingQuote
                          ? "Saving..."
                          : "Save Complex Quote Changes →"}
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};
