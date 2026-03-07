import { useState } from "react";
import { ArrowRight, ArrowLeft, Phone, CheckCircle, Calculator } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── PRICING DATA ─────────────────────────────────────────────────────────────

const propertyTypes = [
  { id: "apartment", label: "Квартира", icon: "🏠", basePrice: 1690 },
  { id: "house", label: "Частный дом", icon: "🏡", basePrice: 2490 },
  { id: "office", label: "Офис / организация", icon: "🏢", basePrice: 20 },
  { id: "hostel", label: "Общежитие / гостиница", icon: "🏨", basePrice: 1800 },
  { id: "warehouse", label: "Склад / производство", icon: "🏭", basePrice: 15 },
];

const pestTypes = [
  { id: "klopov", label: "Клопы", icon: "🪲", multiplier: 1.0 },
  { id: "tarakanov", label: "Тараканы", icon: "🪳", multiplier: 0.9 },
  { id: "gryzunov", label: "Крысы / мыши", icon: "🐀", multiplier: 1.2 },
  { id: "pleseni", label: "Плесень / грибок", icon: "🍄", multiplier: 1.1 },
  { id: "kleshchey", label: "Клещи", icon: "🕷️", multiplier: 1.0 },
  { id: "nasekomyh", label: "Другие насекомые", icon: "🦟", multiplier: 0.85 },
];

const treatmentMethods = [
  {
    id: "cold_fog",
    label: "Холодный туман",
    desc: "Базовый метод. Быстро, без запаха.",
    priceAdd: 0,
    icon: "💨",
  },
  {
    id: "hot_fog",
    label: "Горячий туман",
    desc: "Максимальная эффективность. Глубокое проникновение.",
    priceAdd: 2000,
    icon: "🔥",
  },
  {
    id: "spray",
    label: "Опрыскивание",
    desc: "Точечная обработка. Для небольших очагов.",
    priceAdd: -500,
    icon: "💧",
  },
];

const areaOptions = [
  { id: "small", label: "до 30 м²", area: 25, rooms: "1 комната" },
  { id: "medium", label: "30–60 м²", area: 45, rooms: "2 комнаты" },
  { id: "large", label: "60–100 м²", area: 80, rooms: "3 комнаты" },
  { id: "xlarge", label: "100–200 м²", area: 150, rooms: "4+ комнаты" },
  { id: "xxlarge", label: "более 200 м²", area: 250, rooms: "Большой объект" },
];

function calcPrice(
  property: string,
  area: string,
  pest: string,
  method: string
): { min: number; max: number } {
  const prop = propertyTypes.find((p) => p.id === property);
  const areaOpt = areaOptions.find((a) => a.id === area);
  const pestOpt = pestTypes.find((p) => p.id === pest);
  const methodOpt = treatmentMethods.find((m) => m.id === method);

  if (!prop || !areaOpt || !pestOpt || !methodOpt) return { min: 0, max: 0 };

  let base: number;
  if (property === "office" || property === "warehouse") {
    base = prop.basePrice * areaOpt.area;
  } else {
    base = prop.basePrice;
  }

  const price = Math.round((base * pestOpt.multiplier + methodOpt.priceAdd) / 100) * 100;
  return { min: Math.max(price, 1500), max: Math.round(price * 1.2 / 100) * 100 };
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 font-bold text-sm"
            style={{
              background: i < current ? "#CC0000" : i === current ? "#0A0A0A" : "#E0E0E0",
              color: i <= current ? "white" : "#999",
              transition: "all 0.2s",
            }}
          >
            {i < current ? <CheckCircle size={14} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="h-px w-8"
              style={{ background: i < current ? "#CC0000" : "#E0E0E0", transition: "background 0.2s" }}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs font-semibold" style={{ color: "#666" }}>
        Шаг {current + 1} из {total}
      </span>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [property, setProperty] = useState("");
  const [area, setArea] = useState("");
  const [pest, setPest] = useState("");
  const [method, setMethod] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const submitLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast.error("Ошибка при отправке. Позвоните нам напрямую.");
    },
  });

  const price = step >= 3 ? calcPrice(property, area, pest, method) : { min: 0, max: 0 };

  const steps = [
    {
      title: "Тип помещения",
      subtitle: "Выберите тип объекта для обработки",
    },
    {
      title: "Площадь объекта",
      subtitle: "Укажите примерную площадь",
    },
    {
      title: "Вид вредителя",
      subtitle: "Кого нужно уничтожить?",
    },
    {
      title: "Метод обработки",
      subtitle: "Выберите способ обработки",
    },
    {
      title: "Ваши контакты",
      subtitle: "Оставьте данные для связи",
    },
  ];

  function validate() {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "Введите ваше имя";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10)
      errs.phone = "Введите корректный номер телефона";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    submitLead.mutate({
      name,
      phone,
      service: pest,
      propertyType: property,
      area,
      method,
      source: "calculator",
      priceMin: price.min,
      priceMax: price.max,
    });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="container max-w-lg text-center">
          <div
            className="w-20 h-20 flex items-center justify-center mx-auto mb-6"
            style={{ background: "#CC0000" }}
          >
            <CheckCircle size={40} color="white" />
          </div>
          <h1
            className="font-black mb-4"
            style={{ fontSize: "2rem", color: "#0A0A0A", letterSpacing: "-0.025em" }}
          >
            Заявка принята!
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#666" }}>
            Наш специалист свяжется с вами в течение 15 минут. Ваша расчётная стоимость:{" "}
            <strong style={{ color: "#CC0000" }}>
              {price.min.toLocaleString()} – {price.max.toLocaleString()} ₽
            </strong>
          </p>
          <div
            className="p-6 mb-8"
            style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}
          >
            <div className="text-xs font-bold mb-2" style={{ color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Или позвоните сами
            </div>
            <a
              href="tel:+79300354841"
              className="flex items-center justify-center gap-2 no-underline font-black text-xl"
              style={{ color: "#CC0000" }}
            >
              <Phone size={20} />
              8(930)035-48-41
            </a>
          </div>
          <a href="/" className="btn-red no-underline">
            На главную
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F5" }}>
      {/* Header */}
      <div style={{ background: "#0A0A0A", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-square" />
            <span className="section-label">Калькулятор стоимости</span>
          </div>
          <h1
            className="font-black text-white"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.025em" }}
          >
            Рассчитайте стоимость обработки
          </h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8" style={{ border: "1px solid #E0E0E0" }}>
              <StepIndicator current={step} total={steps.length} />

              <h2 className="font-black text-xl mb-1" style={{ color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                {steps[step].title}
              </h2>
              <p className="text-sm mb-8" style={{ color: "#666" }}>
                {steps[step].subtitle}
              </p>

              {/* Step 0: Property type */}
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {propertyTypes.map((pt) => (
                    <button
                      key={pt.id}
                      className={`calc-option flex items-center gap-3 ${property === pt.id ? "selected" : ""}`}
                      onClick={() => setProperty(pt.id)}
                    >
                      <span className="text-2xl">{pt.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: "#0A0A0A" }}>
                        {pt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 1: Area */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {areaOptions.map((ao) => (
                    <button
                      key={ao.id}
                      className={`calc-option flex items-center justify-between ${area === ao.id ? "selected" : ""}`}
                      onClick={() => setArea(ao.id)}
                    >
                      <div>
                        <div className="font-bold text-sm" style={{ color: "#0A0A0A" }}>
                          {ao.label}
                        </div>
                        <div className="text-xs" style={{ color: "#666" }}>
                          {ao.rooms}
                        </div>
                      </div>
                      {area === ao.id && <CheckCircle size={16} style={{ color: "#CC0000" }} />}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Pest */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pestTypes.map((pt) => (
                    <button
                      key={pt.id}
                      className={`calc-option flex items-center gap-3 ${pest === pt.id ? "selected" : ""}`}
                      onClick={() => setPest(pt.id)}
                    >
                      <span className="text-2xl">{pt.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: "#0A0A0A" }}>
                        {pt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Method */}
              {step === 3 && (
                <div className="flex flex-col gap-3">
                  {treatmentMethods.map((tm) => (
                    <button
                      key={tm.id}
                      className={`calc-option flex items-center gap-4 ${method === tm.id ? "selected" : ""}`}
                      onClick={() => setMethod(tm.id)}
                    >
                      <span className="text-3xl">{tm.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm" style={{ color: "#0A0A0A" }}>
                          {tm.label}
                        </div>
                        <div className="text-xs" style={{ color: "#666" }}>
                          {tm.desc}
                        </div>
                      </div>
                      {tm.priceAdd > 0 && (
                        <span className="text-xs font-bold" style={{ color: "#CC0000" }}>
                          +{tm.priceAdd.toLocaleString()} ₽
                        </span>
                      )}
                      {tm.priceAdd < 0 && (
                        <span className="text-xs font-bold" style={{ color: "#22a" }}>
                          {tm.priceAdd.toLocaleString()} ₽
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Contact form */}
              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "#0A0A0A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      className={`form-field ${errors.name ? "error" : ""}`}
                      placeholder="Иван Иванов"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p className="text-xs mt-1" style={{ color: "#CC0000" }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: "#0A0A0A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      className={`form-field ${errors.phone ? "error" : ""}`}
                      placeholder="+7 (900) 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-xs mt-1" style={{ color: "#CC0000" }}>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: "#999" }}>
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                    Мы не передаём данные третьим лицам.
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid #E0E0E0" }}>
                {step > 0 ? (
                  <button
                    className="flex items-center gap-2 text-sm font-bold"
                    style={{ color: "#666" }}
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft size={14} /> Назад
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    className="btn-red"
                    disabled={
                      (step === 0 && !property) ||
                      (step === 1 && !area) ||
                      (step === 2 && !pest) ||
                      (step === 3 && !method)
                    }
                    onClick={() => setStep(step + 1)}
                    style={{
                      opacity:
                        (step === 0 && !property) ||
                        (step === 1 && !area) ||
                        (step === 2 && !pest) ||
                        (step === 3 && !method)
                          ? 0.4
                          : 1,
                    }}
                  >
                    Далее <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    className="btn-red"
                    onClick={handleSubmit}
                    disabled={submitLead.isPending}
                  >
                    {submitLead.isPending ? "Отправка..." : "Получить расчёт"}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Price estimate */}
            {step >= 3 && price.min > 0 && (
              <div className="bg-white p-6" style={{ border: "2px solid #CC0000" }}>
                <div className="section-label mb-3">Предварительный расчёт</div>
                <div
                  className="font-black mb-1"
                  style={{ fontSize: "2rem", color: "#CC0000", letterSpacing: "-0.03em" }}
                >
                  {price.min.toLocaleString()} ₽
                </div>
                <div className="text-xs mb-4" style={{ color: "#666" }}>
                  до {price.max.toLocaleString()} ₽ — в зависимости от степени заражения
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#0A0A0A" }}>
                  <CheckCircle size={12} style={{ color: "#CC0000" }} />
                  Скидка 10% при онлайн-заявке
                </div>
              </div>
            )}

            {/* Summary */}
            {(property || area || pest || method) && (
              <div className="bg-white p-6" style={{ border: "1px solid #E0E0E0" }}>
                <div className="section-label mb-4">Ваш выбор</div>
                {property && (
                  <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <span style={{ color: "#666" }}>Тип объекта</span>
                    <span className="font-semibold" style={{ color: "#0A0A0A" }}>
                      {propertyTypes.find((p) => p.id === property)?.label}
                    </span>
                  </div>
                )}
                {area && (
                  <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <span style={{ color: "#666" }}>Площадь</span>
                    <span className="font-semibold" style={{ color: "#0A0A0A" }}>
                      {areaOptions.find((a) => a.id === area)?.label}
                    </span>
                  </div>
                )}
                {pest && (
                  <div className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid #F0F0F0" }}>
                    <span style={{ color: "#666" }}>Вредитель</span>
                    <span className="font-semibold" style={{ color: "#0A0A0A" }}>
                      {pestTypes.find((p) => p.id === pest)?.label}
                    </span>
                  </div>
                )}
                {method && (
                  <div className="flex justify-between text-sm py-2">
                    <span style={{ color: "#666" }}>Метод</span>
                    <span className="font-semibold" style={{ color: "#0A0A0A" }}>
                      {treatmentMethods.find((m) => m.id === method)?.label}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Contact block */}
            <div className="p-6" style={{ background: "#0A0A0A" }}>
              <div className="section-label mb-3">Позвонить напрямую</div>
              <a
                href="tel:+79300354841"
                className="flex items-center gap-2 no-underline mb-2"
                style={{ color: "white" }}
              >
                <Phone size={16} style={{ color: "#CC0000" }} />
                <span className="font-bold">8(930)035-48-41</span>
              </a>
              <p className="text-xs" style={{ color: "#666" }}>
                Работаем 24/7. Выезд в день обращения.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
