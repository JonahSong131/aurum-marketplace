"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Copy } from "lucide-react";
import { companionCities } from "@/lib/companions";
import { useLang } from "@/components/LanguageProvider";
import { loc } from "@/lib/i18n";
import { waLink } from "@/lib/contact";

type Option = { id: string; emoji: string; label: string; desc: string };

const TOTAL = 4;

export default function BookingWizard({
  defaultCity,
}: {
  defaultCity?: string;
}) {
  const { t, locale } = useLang();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState(defaultCity ?? "");
  const [party, setParty] = useState("");
  const [days, setDays] = useState("");
  const [move, setMove] = useState("");
  const [likes, setLikes] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const partyOptions: Option[] = [
    {
      id: "solo",
      emoji: "👤",
      label: t("wiz.party.solo"),
      desc: t("wiz.party.solo.desc"),
    },
    {
      id: "small",
      emoji: "👥",
      label: t("wiz.party.small"),
      desc: t("wiz.party.small.desc"),
    },
    {
      id: "group",
      emoji: "👨‍👩‍👧‍👦",
      label: t("wiz.party.group"),
      desc: t("wiz.party.group.desc"),
    },
  ];

  const dayOptions: Option[] = [
    { id: "d1", emoji: "📅", label: t("wiz.days.one"), desc: t("wiz.days.one.desc") },
    { id: "d23", emoji: "🗓️", label: t("wiz.days.few"), desc: t("wiz.days.few.desc") },
    { id: "d4", emoji: "🧳", label: t("wiz.days.long"), desc: t("wiz.days.long.desc") },
  ];

  const moveOptions: Option[] = [
    { id: "walk", emoji: "🚶", label: t("wiz.move.walk"), desc: t("wiz.move.walk.desc") },
    { id: "car", emoji: "🚗", label: t("wiz.move.car"), desc: t("wiz.move.car.desc") },
  ];

  const likeOptions: Option[] = [
    { id: "coffee", emoji: "☕", label: t("wiz.like.coffee"), desc: t("wiz.like.coffee.desc") },
    { id: "food", emoji: "🍲", label: t("wiz.like.food"), desc: t("wiz.like.food.desc") },
    { id: "nature", emoji: "🌿", label: t("wiz.like.nature"), desc: t("wiz.like.nature.desc") },
    { id: "night", emoji: "🍸", label: t("wiz.like.night"), desc: t("wiz.like.night.desc") },
    { id: "photo", emoji: "📷", label: t("wiz.like.photo"), desc: t("wiz.like.photo.desc") },
    { id: "history", emoji: "🏛️", label: t("wiz.like.history"), desc: t("wiz.like.history.desc") },
  ];

  const labelOf = (opts: Option[], id: string) =>
    opts.find((o) => o.id === id)?.label ?? "—";

  const cityLabel = useMemo(() => {
    const c = companionCities.find((x) => x.slug === city);
    return c ? loc(c.name, locale) : "—";
  }, [city, locale]);

  const canNext =
    (step === 1 && city && party) ||
    (step === 2 && days) ||
    (step === 3 && move) ||
    (step === 4 && likes.length > 0);

  const summary = useMemo(() => {
    const cityEn = companionCities.find((x) => x.slug === city)?.name.en ?? "-";
    const likeEn = likes
      .map((l) => likeOptions.find((o) => o.id === l)?.label ?? l)
      .join(", ");
    return [
      "Hi Ximi! Here is my travel profile:",
      "",
      `• City: ${cityEn}`,
      `• Party: ${labelOf(partyOptions, party)}`,
      `• Length: ${labelOf(dayOptions, days)}`,
      `• Getting around: ${labelOf(moveOptions, move)}`,
      `• Interests: ${likeEn}`,
      name ? `• My name: ${name}` : "",
      "",
      "Could you match me with a local companion?",
    ]
      .filter(Boolean)
      .join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, party, days, move, likes, name, locale]);

  function toggleLike(id: string) {
    setLikes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const stepTitles = [
    { n: 1, k: "wiz.step1" },
    { n: 2, k: "wiz.step2" },
    { n: 3, k: "wiz.step3" },
    { n: 4, k: "wiz.step4" },
  ];

  return (
    <div className="card p-6 sm:p-10">
      {/* 步骤条 */}
      <div className="flex items-center justify-between gap-1">
        {stepTitles.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <div key={s.n} className="flex flex-1 items-center gap-1">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                    done
                      ? "bg-jade-500/80 text-ink-900"
                      : active
                        ? "bg-gold-grad text-ink-900 shadow-glow"
                        : "border border-gold-400/25 text-gold-100/40"
                  }`}
                >
                  {done ? <Check size={16} /> : s.n}
                </span>
                <span
                  className={`hidden text-[11px] sm:block ${
                    active ? "text-gold-200" : "text-gold-100/35"
                  }`}
                >
                  {t(`${s.k}.tab`)}
                </span>
              </div>
              {i < stepTitles.length - 1 && (
                <div
                  className={`mb-5 h-px flex-1 ${
                    step > s.n ? "bg-jade-500/50" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
        <div className="flex flex-col items-center gap-1.5">
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
              step > TOTAL
                ? "bg-gold-grad text-ink-900 shadow-glow"
                : "border border-gold-400/25 text-gold-100/40"
            }`}
          >
            <Check size={16} />
          </span>
          <span
            className={`hidden text-[11px] sm:block ${
              step > TOTAL ? "text-gold-200" : "text-gold-100/35"
            }`}
          >
            {t("wiz.done.tab")}
          </span>
        </div>
      </div>

      {/* 内容区 */}
      <div className="mt-8 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {step === 1 && (
              <>
                <StepHead title={t("wiz.step1.title")} sub={t("wiz.step1.sub")} />

                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-400">
                  {t("wiz.step1.city")}
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {companionCities.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCity(c.slug)}
                      className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                        city === c.slug
                          ? "border-gold-400 bg-gold-400/10 text-gold-100"
                          : "border-white/8 text-gold-100/60 hover:border-gold-400/40"
                      }`}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <span className="text-sm font-medium">
                        {loc(c.name, locale)}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mb-3 mt-7 text-xs uppercase tracking-[0.2em] text-gold-400">
                  {t("wiz.step1.party")}
                </p>
                <OptionGrid
                  options={partyOptions}
                  value={party}
                  onSelect={setParty}
                />
              </>
            )}

            {step === 2 && (
              <>
                <StepHead title={t("wiz.step2.title")} sub={t("wiz.step2.sub")} />
                <OptionGrid options={dayOptions} value={days} onSelect={setDays} />
              </>
            )}

            {step === 3 && (
              <>
                <StepHead title={t("wiz.step3.title")} sub={t("wiz.step3.sub")} />
                <OptionGrid options={moveOptions} value={move} onSelect={setMove} />
              </>
            )}

            {step === 4 && (
              <>
                <StepHead title={t("wiz.step4.title")} sub={t("wiz.step4.sub")} />
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {likeOptions.map((o) => {
                    const on = likes.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        onClick={() => toggleLike(o.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          on
                            ? "border-gold-400 bg-gold-400/10"
                            : "border-white/8 hover:border-gold-400/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{o.emoji}</span>
                          {on && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-grad text-ink-900">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-gold-100">
                          {o.label}
                        </p>
                        <p className="mt-1 text-xs text-gold-100/50">{o.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step > TOTAL && (
              <>
                <StepHead title={t("wiz.done.title")} sub={t("wiz.done.sub")} />

                <div className="rounded-2xl border border-gold-400/20 bg-ink-800/50 p-5">
                  <p className="text-sm font-semibold text-gold-200">
                    📋 {t("wiz.done.card")}
                  </p>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Row label={t("wiz.step1.city")} value={cityLabel} />
                    <Row
                      label={t("wiz.step1.party")}
                      value={labelOf(partyOptions, party)}
                    />
                    <Row
                      label={t("wiz.step2.tab")}
                      value={labelOf(dayOptions, days)}
                    />
                    <Row
                      label={t("wiz.step3.tab")}
                      value={labelOf(moveOptions, move)}
                    />
                    <div className="sm:col-span-2">
                      <Row
                        label={t("wiz.step4.tab")}
                        value={
                          likes
                            .map((l) => labelOf(likeOptions, l))
                            .join(" · ") || "—"
                        }
                      />
                    </div>
                  </dl>
                </div>

                <div className="mt-5">
                  <label className="text-xs uppercase tracking-[0.2em] text-gold-400">
                    {t("wiz.done.name")}
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("wiz.done.namePlaceholder")}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3 text-sm text-gold-100 outline-none transition placeholder:text-gold-100/25 focus:border-gold-400/60"
                  />
                </div>

                <p className="mt-4 text-sm text-gold-100/55">
                  {t("wiz.done.note")}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={waLink(summary)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                  >
                    <MessageCircle size={16} />
                    {t("wiz.done.send")}
                  </a>
                  <button onClick={copySummary} className="btn-ghost">
                    <Copy size={16} />
                    {copied ? t("wiz.done.copied") : t("wiz.done.copy")}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      {step <= TOTAL && (
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-gold-100/55 transition hover:text-gold-100 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowLeft size={15} /> {t("wiz.prev")}
          </button>
          <span className="text-xs text-gold-100/35">
            {step} / {TOTAL}
          </span>
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="btn-gold !px-5 !py-2 !text-sm disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
          >
            {step === TOTAL ? t("wiz.finish") : t("wiz.next")}
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {step > TOTAL && (
        <div className="mt-8 border-t border-white/5 pt-5">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-sm text-gold-100/55 transition hover:text-gold-100"
          >
            <ArrowLeft size={15} /> {t("wiz.restart")}
          </button>
        </div>
      )}
    </div>
  );
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-serif text-2xl font-bold text-gold-100">{title}</h3>
      <p className="mt-1 text-sm text-gold-100/50">{sub}</p>
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onSelect,
}: {
  options: Option[];
  value: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`rounded-2xl border p-5 text-left transition ${
              on
                ? "border-gold-400 bg-gold-400/10 shadow-glow"
                : "border-white/8 hover:border-gold-400/40"
            }`}
          >
            <span className="text-3xl">{o.emoji}</span>
            <p className="mt-3 font-serif text-lg font-semibold text-gold-100">
              {o.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-gold-100/50">
              {o.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-gold-100/35">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-gold-100">{value}</dd>
    </div>
  );
}
