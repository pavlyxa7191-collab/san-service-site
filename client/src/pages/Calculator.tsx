import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  ChevronLeft, ChevronRight, Check,
  Home, Building2, Warehouse, BedDouble, Building,
  Phone, ArrowLeft, MessageCircle, Send,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RED = "#D0021B";
const NAVY = "#0A0F1E";
const WHITE = "#ffffff";
const LIGHT_BG = "#f8f9fc";
const BORDER = "#e8ecf2";
const GRAY = "#6b7280";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const propertyTypes = [
  { id: "apartment", label: "Квартира",             Icon: Home },
  { id: "house",     label: "Частный дом",          Icon: Building2 },
  { id: "office",    label: "Офис",                 Icon: Building },
  { id: "hostel",    label: "Общежитие",            Icon: BedDouble },
  { id: "warehouse", label: "Склад / производство", Icon: Warehouse },
];

const areaRanges = [
  { id: "under30",  label: "до 30 м²",     sub: "Небольшое помещение" },
  { id: "30_50",    label: "30–50 м²",     sub: "Малая площадь" },
  { id: "50_80",    label: "50–80 м²",     sub: "Средняя площадь" },
  { id: "80_120",   label: "80–120 м²",    sub: "Большая площадь" },
  { id: "120_200",  label: "120–200 м²",   sub: "Просторный объект" },
  { id: "over200",  label: "более 200 м²", sub: "Крупный объект" },
];

const pestTypes = [
  { id: "klopov",    label: "Клопы",    emoji: "🪲" },
  { id: "tarakanov", label: "Тараканы", emoji: "🪳" },
  { id: "gryzunov",  label: "Грызуны",  emoji: "🐀" },
  { id: "kleshchey", label: "Клещи",    emoji: "🕷️" },
  { id: "pleseni",   label: "Плесень",  emoji: "🍄" },
  { id: "zapahov",   label: "Запахи",   emoji: "💨" },
];

const contactMethods = [
  { id: "whatsapp",  label: "WhatsApp",  color: "#25D366", emoji: "💬" },
  { id: "telegram",  label: "Telegram",  color: "#0088cc", emoji: "✈️" },
  { id: "max",       label: "Max",       color: "#7B61FF", emoji: "💜" },
  { id: "call",      label: "Позвонить", color: RED,       emoji: "📞" },
];

const STEPS = ["Тип объекта", "Площадь", "Вид проблемы", "Способ связи", "Контакты"];

// ─── STEP PROGRESS ────────────────────────────────────────────────────────────
function StepProgress({ current }: { current: number }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: RED, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
          Шаг {current + 1} из {STEPS.length}
        </span>
        <span style={{ fontSize: "0.78rem", color: GRAY, fontWeight: 500 }}>{STEPS[current]}</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 5, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((current + 1) / STEPS.length) * 100}%`,
          background: `linear-gradient(90deg, ${RED}, #ff4444)`,
          borderRadius: 99,
          transition: "width 0.4s ease",
        }} />
      </div>
      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.875rem" }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.35rem" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i < current ? RED : i === current ? RED : WHITE,
              border: `2px solid ${i <= current ? RED : BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease",
              boxShadow: i === current ? `0 0 0 4px rgba(204,0,0,0.12)` : "none",
            }}>
              {i < current
                ? <Check size={12} color={WHITE} strokeWidth={3} />
                : <span style={{ fontSize: "0.65rem", fontWeight: 800, color: i === current ? WHITE : GRAY }}>{i + 1}</span>
              }
            </div>
            <span style={{
              fontSize: "0.58rem", color: i <= current ? NAVY : GRAY,
              fontWeight: i === current ? 700 : 400,
              textAlign: "center" as const, lineHeight: 1.2,
              maxWidth: 52,
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SELECTION CARD ───────────────────────────────────────────────────────────
function SelectCard({
  selected, onClick, children, compact = false,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; compact?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: compact ? "1rem 1.25rem" : "1.5rem 1rem",
        borderRadius: 14,
        border: `2px solid ${selected ? RED : hovered ? "#c0c8d8" : BORDER}`,
        background: selected ? "#fff5f5" : WHITE,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: selected
          ? `0 4px 20px rgba(204,0,0,0.14)`
          : hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered && !selected ? "translateY(-2px)" : "none",
        userSelect: "none" as const,
        outline: "none",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          width: 22, height: 22, borderRadius: "50%",
          background: RED, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(204,0,0,0.3)",
        }}>
          <Check size={12} color={WHITE} strokeWidth={3} />
        </div>
      )}
      {children}
    </div>
  );
}

// ─── CHECKBOX CARD ────────────────────────────────────────────────────────────
function CheckboxCard({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "1rem 1.25rem",
        borderRadius: 14,
        border: `2px solid ${selected ? RED : hovered ? "#c0c8d8" : BORDER}`,
        background: selected ? "#fff5f5" : WHITE,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: selected
          ? `0 4px 20px rgba(204,0,0,0.14)`
          : hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        userSelect: "none" as const,
        outline: "none",
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${selected ? RED : BORDER}`,
        background: selected ? RED : WHITE,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {selected && <Check size={12} color={WHITE} strokeWidth={3} />}
      </div>
      {children}
    </div>
  );
}

// ─── PHONE MASK ───────────────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  let v = raw.replace(/\D/g, "");
  if (v.startsWith("8")) v = "7" + v.slice(1);
  if (v.startsWith("7")) v = v.slice(1);
  v = v.slice(0, 10);
  let f = "+7 (";
  if (v.length > 0) f += v.slice(0, 3);
  if (v.length >= 3) f += ") " + v.slice(3, 6);
  if (v.length >= 6) f += "-" + v.slice(6, 8);
  if (v.length >= 8) f += "-" + v.slice(8, 10);
  return f;
}

// Service slug → pestType id mapping
const SERVICE_TO_PEST: Record<string, string> = {
  klopov: "klopov",
  tarakanov: "tarakanov",
  gryzunov: "gryzunov",
  kleshhej: "kleshchey",
  pleseni: "pleseni",
  dezinfektsii: "zapahov",
  zapahov: "zapahov",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CalculatorPage() {
  const search = useSearch();
  const [step, setStep] = useState(0);
  const [property, setProperty] = useState("");
  const [area, setArea] = useState("");
  const [pest, setPest] = useState("");

  // Preselect service from URL param ?service=klopov (start from step 0, pest is pre-filled)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const serviceParam = params.get("service");
    if (serviceParam && SERVICE_TO_PEST[serviceParam]) {
      setPest(SERVICE_TO_PEST[serviceParam]);
      // Stay on step 0 so user goes through all steps naturally
      setStep(0);
    }
  }, [search]);
  const [contactWays, setContactWays] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 (");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const submitLead = trpc.leads.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  function toggleContactWay(id: string) {
    setContactWays(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  }

  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  function validate() {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = "Введите имя";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11) e.phone = "Введите полный номер телефона";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const selectedWays = contactMethods
      .filter(m => contactWays.includes(m.id))
      .map(m => m.label)
      .join(", ");
    submitLead.mutate({
      name,
      phone,
      service: pestTypes.find(p => p.id === pest)?.label,
      propertyType: property,
      area: areaRanges.find(a => a.id === area)?.label,
      method: selectedWays || undefined,
      source: "calculator",
    });
  }

  const canNext =
    (step === 0 && !!property) ||
    (step === 1 && !!area) ||
    (step === 2 && !!pest) ||
    (step === 3 && contactWays.length > 0);

  // ── Success screen ──
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: LIGHT_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" as const }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "#f0fff4", border: `3px solid #10b981`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.75rem",
            boxShadow: "0 8px 32px rgba(16,185,129,0.15)",
          }}>
            <Check size={40} color="#10b981" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 900, color: NAVY, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>Заявка принята!</h2>
          <p style={{ color: GRAY, lineHeight: 1.8, marginBottom: "2rem", fontSize: "0.95rem" }}>
            Наш специалист свяжется с вами в течение 5 минут удобным для вас способом.
          </p>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: RED, color: WHITE, fontWeight: 700, fontSize: "0.85rem",
            letterSpacing: "0.06em", textTransform: "uppercase" as const,
            padding: "0.875rem 2rem", borderRadius: 10, textDecoration: "none",
            boxShadow: "0 4px 16px rgba(204,0,0,0.3)",
          }}>
            <ArrowLeft size={16} /> На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: LIGHT_BG }}>
      {/* ── Header ── */}
      <div style={{ background: NAVY, padding: "1rem 0", borderBottom: `3px solid ${RED}` }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, background: RED, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: WHITE, fontWeight: 900, fontSize: "0.7rem", letterSpacing: "0.02em" }}>СЭС</span>
            </div>
            <div>
              <div style={{ color: WHITE, fontWeight: 800, fontSize: "0.9rem", lineHeight: 1.2 }}>Экоцентр</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Санитарная служба</div>
            </div>
          </Link>
          <a href="tel:+74951485806" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: WHITE, textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
            <Phone size={15} color={RED} />
            8(495)148-58-06
          </a>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 1rem 4rem" }}>
        {/* Title */}
        <div style={{ textAlign: "center" as const, marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: RED, marginBottom: "0.5rem" }}>
            Бесплатный расчёт
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", margin: 0 }}>
            Рассчитайте стоимость обработки
          </h1>
          <p style={{ fontSize: "0.875rem", color: GRAY, marginTop: "0.5rem" }}>
            5 простых шагов — и специалист назовёт точную цену
          </p>
        </div>

        {/* ── Wizard card ── */}
        <div style={{
          background: WHITE, borderRadius: 18,
          boxShadow: "0 8px 48px rgba(0,9,25,0.1)",
          border: `1px solid ${BORDER}`,
          overflow: "hidden",
        }}>
          {/* Body */}
          <div style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
            <StepProgress current={step} />

            {/* ── Step 0: Property type ── */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.35rem" }}>Выберите тип объекта</h2>
                <p style={{ fontSize: "0.83rem", color: GRAY, marginBottom: "1.75rem" }}>Это поможет точнее рассчитать стоимость</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.875rem" }}>
                  {propertyTypes.map(({ id, label, Icon }) => (
                    <SelectCard key={id} selected={property === id} onClick={() => setProperty(id)}>
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: 54, height: 54, borderRadius: "50%",
                          background: property === id ? "#fff0f0" : LIGHT_BG,
                          border: `2px solid ${property === id ? RED : BORDER}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          <Icon size={24} color={property === id ? RED : NAVY} strokeWidth={1.5} />
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: property === id ? RED : NAVY, textAlign: "center" as const, lineHeight: 1.3 }}>{label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 1: Area ── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.35rem" }}>Укажите площадь объекта</h2>
                <p style={{ fontSize: "0.83rem", color: GRAY, marginBottom: "1.75rem" }}>Площадь влияет на количество препарата и стоимость</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.875rem" }}>
                  {areaRanges.map(({ id, label, sub }) => (
                    <SelectCard key={id} selected={area === id} onClick={() => setArea(id)} compact>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.3rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 800, color: area === id ? RED : NAVY }}>{label}</span>
                        <span style={{ fontSize: "0.72rem", color: GRAY, lineHeight: 1.4 }}>{sub}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Pest ── */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.35rem" }}>Выберите вид проблемы</h2>
                <p style={{ fontSize: "0.83rem", color: GRAY, marginBottom: "1.75rem" }}>Укажите, с чем нужна помощь</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.875rem" }}>
                  {pestTypes.map(({ id, label, emoji }) => (
                    <SelectCard key={id} selected={pest === id} onClick={() => setPest(id)}>
                      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: 54, height: 54, borderRadius: "50%",
                          background: pest === id ? "#fff0f0" : LIGHT_BG,
                          border: `2px solid ${pest === id ? RED : BORDER}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.6rem",
                          transition: "all 0.2s",
                        }}>
                          {emoji}
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: pest === id ? RED : NAVY, textAlign: "center" as const }}>{label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Contact method ── */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.35rem" }}>Удобный способ связи</h2>
                <p style={{ fontSize: "0.83rem", color: GRAY, marginBottom: "1.75rem" }}>Выберите один или несколько вариантов</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                  {contactMethods.map(({ id, label, color, emoji }) => (
                    <CheckboxCard key={id} selected={contactWays.includes(id)} onClick={() => toggleContactWay(id)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                          background: contactWays.includes(id) ? color + "18" : LIGHT_BG,
                          border: `2px solid ${contactWays.includes(id) ? color : BORDER}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "1.2rem",
                          transition: "all 0.2s",
                        }}>
                          {emoji}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: contactWays.includes(id) ? NAVY : NAVY }}>{label}</div>
                          <div style={{ fontSize: "0.72rem", color: GRAY, marginTop: "0.1rem" }}>
                            {id === "whatsapp" && "Сообщение или голосовой звонок"}
                            {id === "telegram" && "Сообщение или звонок в Telegram"}
                            {id === "max" && "Сообщение через Max"}
                            {id === "call" && "Обычный звонок на телефон"}
                          </div>
                        </div>
                      </div>
                    </CheckboxCard>
                  ))}
                </div>
                {contactWays.length === 0 && (
                  <p style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.875rem", fontWeight: 500 }}>
                    ⚠ Выберите хотя бы один способ связи
                  </p>
                )}
              </div>
            )}

            {/* ── Step 4: Contacts ── */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.35rem" }}>Оставьте контакты</h2>
                <p style={{ fontSize: "0.83rem", color: GRAY, marginBottom: "1.75rem" }}>Специалист перезвонит и назовёт точную стоимость</p>

                {/* Summary */}
                <div style={{ background: LIGHT_BG, borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.75rem", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: GRAY, marginBottom: "0.75rem" }}>Ваш выбор</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.5rem" }}>
                    {property && (
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: NAVY, background: WHITE, border: `1px solid ${BORDER}`, padding: "0.3rem 0.875rem", borderRadius: 20 }}>
                        {propertyTypes.find(p => p.id === property)?.label}
                      </span>
                    )}
                    {area && (
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: NAVY, background: WHITE, border: `1px solid ${BORDER}`, padding: "0.3rem 0.875rem", borderRadius: 20 }}>
                        {areaRanges.find(a => a.id === area)?.label}
                      </span>
                    )}
                    {pest && (
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: NAVY, background: WHITE, border: `1px solid ${BORDER}`, padding: "0.3rem 0.875rem", borderRadius: 20 }}>
                        {pestTypes.find(p => p.id === pest)?.label}
                      </span>
                    )}
                    {contactWays.length > 0 && (
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: NAVY, background: WHITE, border: `1px solid ${BORDER}`, padding: "0.3rem 0.875rem", borderRadius: 20 }}>
                        {contactMethods.filter(m => contactWays.includes(m.id)).map(m => m.label).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.125rem" }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: "0.45rem", letterSpacing: "0.03em" }}>
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      placeholder="Как вас зовут?"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                      style={{
                        width: "100%", padding: "0.9rem 1rem", borderRadius: 10,
                        border: `2px solid ${errors.name ? RED : BORDER}`,
                        fontSize: "0.95rem", color: NAVY, background: WHITE,
                        outline: "none", boxSizing: "border-box" as const,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => { e.target.style.borderColor = RED; e.target.style.boxShadow = "0 0 0 3px rgba(204,0,0,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.name ? RED : BORDER; e.target.style.boxShadow = "none"; }}
                    />
                    {errors.name && <span style={{ fontSize: "0.75rem", color: RED, marginTop: "0.3rem", display: "block" }}>{errors.name}</span>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: "0.45rem", letterSpacing: "0.03em" }}>
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={handlePhone}
                      style={{
                        width: "100%", padding: "0.9rem 1rem", borderRadius: 10,
                        border: `2px solid ${errors.phone ? RED : BORDER}`,
                        fontSize: "0.95rem", color: NAVY, background: WHITE,
                        outline: "none", boxSizing: "border-box" as const,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => { e.target.style.borderColor = RED; e.target.style.boxShadow = "0 0 0 3px rgba(204,0,0,0.08)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.phone ? RED : BORDER; e.target.style.boxShadow = "none"; }}
                    />
                    {errors.phone && <span style={{ fontSize: "0.75rem", color: RED, marginTop: "0.3rem", display: "block" }}>{errors.phone}</span>}
                  </div>
                </div>

                <p style={{ fontSize: "0.72rem", color: GRAY, marginTop: "1rem", lineHeight: 1.7 }}>
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" style={{ color: RED, textDecoration: "none" }}>политикой конфиденциальности</a>
                </p>
              </div>
            )}
          </div>

          {/* ── Footer: navigation ── */}
          <div style={{
            padding: "1.25rem clamp(1.5rem, 4vw, 2.5rem)",
            background: LIGHT_BG,
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: step === 0 ? "flex-end" : "space-between",
            alignItems: "center",
            gap: "1rem",
          }}>
            {/* Back button */}
            {step > 0 && (
              <button
                className="btn-back"
                onClick={() => setStep(step - 1)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.75rem 1.5rem", borderRadius: 10,
                  border: `2px solid ${BORDER}`, background: WHITE,
                  color: NAVY, fontWeight: 700, fontSize: "0.85rem",
                  cursor: "pointer", transition: "all 0.2s",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = NAVY; b.style.background = NAVY; b.style.color = WHITE;
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.borderColor = BORDER; b.style.background = WHITE; b.style.color = NAVY;
                }}
              >
                <ChevronLeft size={16} /> Назад
              </button>
            )}

            {/* Next / Submit */}
            {step < 4 ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.8rem 2rem", borderRadius: 10,
                  background: canNext ? RED : "#e5e7eb",
                  color: canNext ? WHITE : GRAY,
                  fontWeight: 700, fontSize: "0.85rem",
                  border: "none", cursor: canNext ? "pointer" : "not-allowed",
                  letterSpacing: "0.06em", textTransform: "uppercase" as const,
                  transition: "all 0.2s",
                  boxShadow: canNext ? `0 4px 16px rgba(204,0,0,0.25)` : "none",
                }}
                onMouseEnter={e => canNext && ((e.currentTarget as HTMLButtonElement).style.background = "#aa0000")}
                onMouseLeave={e => canNext && ((e.currentTarget as HTMLButtonElement).style.background = RED)}
              >
                Далее <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitLead.isPending}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.9rem 2.25rem", borderRadius: 10,
                  background: RED, color: WHITE,
                  fontWeight: 800, fontSize: "0.85rem",
                  border: "none", cursor: submitLead.isPending ? "not-allowed" : "pointer",
                  letterSpacing: "0.06em", textTransform: "uppercase" as const,
                  transition: "all 0.2s",
                  boxShadow: `0 4px 20px rgba(204,0,0,0.3)`,
                  opacity: submitLead.isPending ? 0.7 : 1,
                }}
                onMouseEnter={e => !submitLead.isPending && ((e.currentTarget as HTMLButtonElement).style.background = "#aa0000")}
                onMouseLeave={e => !submitLead.isPending && ((e.currentTarget as HTMLButtonElement).style.background = RED)}
              >
                {submitLead.isPending ? "Отправка..." : "Отправить заявку"} <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem, 3vw, 2rem)", marginTop: "2rem", flexWrap: "wrap" as const }}>
          {["Бесплатная консультация", "Выезд в день обращения", "Гарантия до 3 лет"].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Check size={12} color={RED} strokeWidth={3} />
              <span style={{ fontSize: "0.78rem", color: GRAY, fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
