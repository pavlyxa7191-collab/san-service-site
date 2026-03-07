import { Link, useParams } from "wouter";
import { Phone, ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── SERVICE DATA ─────────────────────────────────────────────────────────────

const serviceData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  priceFrom: number;
  guarantee: string;
  methods: string[];
  stages: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDesc: string;
}> = {
  klopov: {
    title: "Уничтожение клопов",
    subtitle: "Полная ликвидация постельных клопов. Гарантия 3 года.",
    description:
      "Постельные клопы — одна из самых неприятных проблем. Они активны ночью, кусают спящих людей и крайне сложно поддаются самостоятельному уничтожению. Наши специалисты применяют профессиональные методы обработки, которые гарантируют полное уничтожение клопов на всех стадиях развития — от яиц до взрослых особей.",
    priceFrom: 2500,
    guarantee: "3 года",
    methods: [
      "Холодный туман — базовый метод, без запаха, быстро",
      "Горячий туман — максимальная эффективность, глубокое проникновение",
      "Опрыскивание — точечная обработка очагов заражения",
    ],
    stages: [
      { title: "Диагностика", desc: "Специалист осматривает помещение и определяет степень заражения" },
      { title: "Подготовка", desc: "Вы убираете продукты, посуду и домашних животных" },
      { title: "Обработка", desc: "Проводим обработку сертифицированными препаратами" },
      { title: "Проветривание", desc: "2–4 часа проветриваете помещение" },
      { title: "Гарантия", desc: "Выдаём договор и гарантийный талон на 3 года" },
    ],
    faq: [
      { q: "Сколько стоит обработка от клопов?", a: "Стоимость зависит от площади и метода обработки. Базовая цена — от 2 500 ₽ для однокомнатной квартиры. Точную цену рассчитайте в калькуляторе." },
      { q: "Нужно ли уходить из квартиры?", a: "Да, во время обработки нужно покинуть помещение. После завершения — проветрить 2–4 часа. Затем можно возвращаться." },
      { q: "Сколько обработок нужно?", a: "Как правило, достаточно одной обработки. При сильном заражении может потребоваться повторная через 2 недели — бесплатно по гарантии." },
    ],
    seoTitle: "Уничтожение клопов в Москве | Гарантия 3 года | ООО Экоцентр",
    seoDesc: "Профессиональное уничтожение клопов в Москве и МО. Холодный и горячий туман. Гарантия 3 года. Безопасно для детей. Звоните: 8(930)035-48-41",
  },
  tarakanov: {
    title: "Уничтожение тараканов",
    subtitle: "Эффективная дезинсекция от тараканов. Без запаха. Гарантия.",
    description:
      "Тараканы — переносчики опасных заболеваний и аллергенов. Они быстро размножаются и адаптируются к бытовым средствам. Профессиональная обработка позволяет уничтожить тараканов полностью, включая яйца и личинки, с гарантией результата.",
    priceFrom: 1800,
    guarantee: "1 год",
    methods: [
      "Гелевые приманки — без запаха, безопасно для детей",
      "Холодный туман — быстрое уничтожение большой колонии",
      "Комбинированный метод — максимальная эффективность",
    ],
    stages: [
      { title: "Осмотр", desc: "Определяем очаги скопления и пути проникновения" },
      { title: "Обработка", desc: "Наносим препараты в местах обитания тараканов" },
      { title: "Профилактика", desc: "Обрабатываем щели, плинтусы, места под техникой" },
      { title: "Контроль", desc: "Через 2 недели проверяем результат" },
      { title: "Гарантия", desc: "Договор с гарантийным обслуживанием" },
    ],
    faq: [
      { q: "Почему не помогают магазинные средства?", a: "Тараканы быстро вырабатывают устойчивость к бытовым инсектицидам. Профессиональные препараты действуют иначе и не дают выработать резистентность." },
      { q: "Нужно ли готовить квартиру?", a: "Да: убрать продукты в холодильник, посуду в шкафы, накрыть аквариум. Детей и животных вывести на 4–6 часов." },
      { q: "Когда появится результат?", a: "Большинство тараканов погибает в первые сутки. Полный эффект — через 5–7 дней." },
    ],
    seoTitle: "Уничтожение тараканов в Москве | Цена от 1800 ₽ | ООО Экоцентр",
    seoDesc: "Профессиональное уничтожение тараканов в Москве и МО. Гелевые приманки и туман. Без запаха. Гарантия. Звоните: 8(930)035-48-41",
  },
  gryzunov: {
    title: "Уничтожение грызунов",
    subtitle: "Дератизация — уничтожение крыс и мышей. Договор. Гарантия.",
    description:
      "Крысы и мыши наносят серьёзный ущерб имуществу и здоровью. Они портят продукты, перегрызают проводку и являются переносчиками опасных болезней. Профессиональная дератизация включает установку приманок, ловушек и обработку нор.",
    priceFrom: 3000,
    guarantee: "6 месяцев",
    methods: [
      "Родентицидные приманки — эффективное уничтожение",
      "Механические ловушки — без химии",
      "Комплексная дератизация — для предприятий и складов",
    ],
    stages: [
      { title: "Обследование", desc: "Находим пути проникновения и места обитания грызунов" },
      { title: "Расстановка приманок", desc: "Устанавливаем приманки в стратегических точках" },
      { title: "Мониторинг", desc: "Контролируем эффективность через 7–10 дней" },
      { title: "Профилактика", desc: "Рекомендации по защите от повторного заражения" },
      { title: "Гарантия", desc: "Договор с гарантийным обслуживанием" },
    ],
    faq: [
      { q: "Опасны ли приманки для домашних животных?", a: "Мы используем приманки в специальных защитных станциях, недоступных для детей и домашних животных." },
      { q: "Как быстро уйдут крысы?", a: "Первые результаты заметны через 3–5 дней. Полное уничтожение — 2–3 недели." },
      { q: "Что делать с мёртвыми грызунами?", a: "Наши специалисты при необходимости проводят дезинфекцию и утилизацию." },
    ],
    seoTitle: "Уничтожение крыс и мышей в Москве | Дератизация | ООО Экоцентр",
    seoDesc: "Профессиональная дератизация в Москве и МО. Уничтожение крыс и мышей. Договор. Гарантия 6 месяцев. Звоните: 8(930)035-48-41",
  },
  pleseni: {
    title: "Удаление плесени",
    subtitle: "Профессиональное удаление плесени и грибка. Антисептическая обработка.",
    description:
      "Плесень и грибок опасны для здоровья — они вызывают аллергию, заболевания дыхательных путей и снижают иммунитет. Самостоятельная обработка даёт временный эффект. Профессиональное удаление включает глубокую обработку поверхностей и защитное покрытие.",
    priceFrom: 2000,
    guarantee: "2 года",
    methods: [
      "Механическое удаление с последующей обработкой",
      "Антисептические составы глубокого проникновения",
      "Защитное покрытие против повторного появления",
    ],
    stages: [
      { title: "Диагностика", desc: "Определяем площадь и глубину поражения" },
      { title: "Механическая очистка", desc: "Удаляем видимую плесень" },
      { title: "Химическая обработка", desc: "Наносим антисептик глубокого проникновения" },
      { title: "Защитное покрытие", desc: "Наносим средство против повторного появления" },
      { title: "Рекомендации", desc: "Советы по вентиляции и влажности" },
    ],
    faq: [
      { q: "Почему плесень появляется снова?", a: "Плесень возвращается, если не устранена причина — высокая влажность, плохая вентиляция. Мы даём рекомендации по профилактике." },
      { q: "Опасна ли плесень для здоровья?", a: "Да. Споры плесени вызывают аллергию, бронхит, астму. Особенно опасна для детей и пожилых людей." },
      { q: "Сколько времени занимает обработка?", a: "Зависит от площади. Обычно 2–6 часов. После обработки нужно проветрить 4–6 часов." },
    ],
    seoTitle: "Удаление плесени в Москве | Профессиональная обработка | ООО Экоцентр",
    seoDesc: "Профессиональное удаление плесени и грибка в Москве и МО. Антисептическая обработка. Гарантия 2 года. Звоните: 8(930)035-48-41",
  },
  dezinfektsiya: {
    title: "Дезинфекция",
    subtitle: "Уничтожение патогенных микроорганизмов. Для жилья и предприятий.",
    description:
      "Профессиональная дезинфекция уничтожает вирусы, бактерии и другие патогены. Необходима после болезней, при санитарных требованиях для предприятий, а также для профилактики. Работаем по нормам СанПиН и Роспотребнадзора.",
    priceFrom: 20,
    guarantee: "По договору",
    methods: [
      "Влажная дезинфекция — обработка поверхностей",
      "Аэрозольная дезинфекция — обработка воздуха",
      "УФ-облучение — дополнительная обеззараживание",
    ],
    stages: [
      { title: "Оценка объекта", desc: "Определяем площадь и тип обработки" },
      { title: "Подготовка", desc: "Убираем продукты, накрываем технику" },
      { title: "Обработка", desc: "Дезинфицируем все поверхности и воздух" },
      { title: "Проветривание", desc: "2–4 часа до возвращения людей" },
      { title: "Документы", desc: "Выдаём акт и журнал дезинфекции" },
    ],
    faq: [
      { q: "Нужна ли дезинфекция после болезни?", a: "Рекомендуется после COVID-19, гриппа, кишечных инфекций. Особенно важна для многоквартирных домов и офисов." },
      { q: "Какие документы выдаёте?", a: "Акт выполненных работ, журнал дезинфекции, сертификаты на препараты. Все документы соответствуют требованиям Роспотребнадзора." },
      { q: "Работаете ли с предприятиями?", a: "Да. Заключаем договоры на регулярное обслуживание кафе, ресторанов, офисов, складов, медицинских учреждений." },
    ],
    seoTitle: "Дезинфекция в Москве | Для жилья и предприятий | ООО Экоцентр",
    seoDesc: "Профессиональная дезинфекция в Москве и МО. По нормам СанПиН. Документы. Для квартир и предприятий. Звоните: 8(930)035-48-41",
  },
};

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm({ service }: { service: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error("Ошибка. Позвоните нам напрямую."),
  });

  function validate() {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "Введите имя";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) errs.phone = "Введите корректный телефон";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  if (submitted) {
    return (
      <div className="p-8 text-center" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
        <CheckCircle size={32} style={{ color: "#CC0000", margin: "0 auto 1rem" }} />
        <h3 className="font-bold text-lg mb-2" style={{ color: "#0A0A0A" }}>Заявка принята!</h3>
        <p className="text-sm" style={{ color: "#666" }}>Перезвоним в течение 15 минут</p>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ background: "#0A0A0A" }}>
      <div className="section-label mb-4">Оставить заявку</div>
      <h3 className="font-black text-xl text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
        Получите точную стоимость
      </h3>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            className={`form-field ${errors.name ? "error" : ""}`}
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-xs mt-1" style={{ color: "#CC0000" }}>{errors.name}</p>}
        </div>
        <div>
          <input
            type="tel"
            className={`form-field ${errors.phone ? "error" : ""}`}
            placeholder="+7 (900) 000-00-00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="text-xs mt-1" style={{ color: "#CC0000" }}>{errors.phone}</p>}
        </div>
        <button
          className="btn-red w-full justify-center"
          onClick={() => validate() && createLead.mutate({ name, phone, service, source: "service-page" })}
          disabled={createLead.isPending}
        >
          {createLead.isPending ? "Отправка..." : "Получить расчёт"}
          <ArrowRight size={14} />
        </button>
        <p className="text-xs" style={{ color: "#555" }}>
          Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function ServicePage() {
  const params = useParams<{ service: string; city?: string }>();
  const serviceId = params.service;
  const city = params.city;

  const data = serviceData[serviceId];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-black text-2xl mb-4" style={{ color: "#0A0A0A" }}>Услуга не найдена</h1>
          <Link href="/" className="btn-red no-underline">На главную</Link>
        </div>
      </div>
    );
  }

  // Mapping of city slugs to Russian names
  const cityNames: Record<string, string> = {
    moskva: "Москве",
    voskresensk: "Воскресенске",
    kolomna: "Коломне",
    zhukovsky: "Жуковском",
    ramenskoe: "Раменском",
    balashikha: "Балашихе",
    podolsk: "Подольске",
    khimki: "Химках",
    mytishchi: "Мытищах",
    lyubertsy: "Люберцах",
    korolev: "Королёве",
    odintsovo: "Одинцово",
    serpukhov: "Серпухове",
    noginsk: "Ногинске",
    elektrostal: "Электростали",
  };
  const cityLabel = city ? ` в ${cityNames[city] || city.charAt(0).toUpperCase() + city.slice(1)}` : " в Москве";

  return (
    <div className="bg-white">
      {/* Hero */}
      <section style={{ background: "#0A0A0A", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: "#666" }}>
            <Link href="/" className="no-underline" style={{ color: "#666" }}>Главная</Link>
            <span>/</span>
            <Link href="/services" className="no-underline" style={{ color: "#666" }}>Услуги</Link>
            <span>/</span>
            <span style={{ color: "#CC0000" }}>{data.title}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">Профессиональная обработка{cityLabel}</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
          >
            {data.title}{cityLabel}
          </h1>
          <p className="text-base mb-8" style={{ color: "#999", maxWidth: "600px" }}>
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-3xl" style={{ color: "#CC0000" }}>
                от {data.priceFrom.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#666" }}>
              <Shield size={14} style={{ color: "#CC0000" }} />
              Гарантия {data.guarantee}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#666" }}>
              <Clock size={14} style={{ color: "#CC0000" }} />
              Выезд в день обращения
            </div>
          </div>
        </div>
      </section>

      {/* Content + Sidebar */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="red-square" />
                <span className="section-label">О услуге</span>
              </div>
              <p className="text-base leading-relaxed" style={{ color: "#444" }}>
                {data.description}
              </p>
            </div>

            {/* Methods */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1rem" }}>
                <div className="red-square" />
                <h2 className="font-black text-xl" style={{ color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                  Методы обработки
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {data.methods.map((method, i) => (
                  <div key={i} className="flex items-start gap-3 p-4" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                    <div className="red-square mt-1 flex-shrink-0" />
                    <span className="text-sm" style={{ color: "#0A0A0A" }}>{method}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stages */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1rem" }}>
                <div className="red-square" />
                <h2 className="font-black text-xl" style={{ color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                  Этапы работы
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "#E0E0E0" }}>
                {data.stages.map((stage, i) => (
                  <div key={i} className="bg-white p-6">
                    <div
                      className="font-black mb-2"
                      style={{ fontSize: "2rem", color: "#CC0000", letterSpacing: "-0.04em", lineHeight: 1 }}
                    >
                      0{i + 1}
                    </div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: "#0A0A0A" }}>{stage.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "2px solid #0A0A0A", paddingBottom: "1rem" }}>
                <div className="red-square" />
                <h2 className="font-black text-xl" style={{ color: "#0A0A0A", letterSpacing: "-0.02em" }}>
                  Вопросы и ответы
                </h2>
              </div>
              <div style={{ borderTop: "1px solid #E0E0E0" }}>
                {data.faq.map((item, i) => (
                  <div key={i} className="py-4" style={{ borderBottom: "1px solid #E0E0E0" }}>
                    <h3 className="font-bold text-sm mb-2" style={{ color: "#0A0A0A" }}>{item.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <ContactForm service={serviceId} />

            {/* Price card */}
            <div className="p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
              <div className="section-label mb-3">Стоимость</div>
              <div className="font-black text-3xl mb-1" style={{ color: "#CC0000", letterSpacing: "-0.03em" }}>
                от {data.priceFrom.toLocaleString()} ₽
              </div>
              <p className="text-xs mb-4" style={{ color: "#666" }}>
                Точная цена зависит от площади и степени заражения
              </p>
              <Link href="/calculator" className="btn-red no-underline w-full justify-center">
                Рассчитать точно <ArrowRight size={14} />
              </Link>
            </div>

            {/* Guarantees */}
            <div className="p-6" style={{ border: "1px solid #E0E0E0" }}>
              <div className="section-label mb-4">Гарантии</div>
              {[
                "Официальный договор",
                `Гарантийный талон на ${data.guarantee}`,
                "Сертифицированные препараты",
                "Безопасно для детей и животных",
                "Повторная обработка бесплатно",
              ].map((g) => (
                <div key={g} className="flex items-center gap-2 mb-3">
                  <CheckCircle size={14} style={{ color: "#CC0000", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "#0A0A0A" }}>{g}</span>
                </div>
              ))}
            </div>

            {/* Phone */}
            <div className="p-6" style={{ background: "#CC0000" }}>
              <div className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Звоните прямо сейчас
              </div>
              <a href="tel:+79300354841" className="flex items-center gap-2 no-underline text-white font-black text-xl">
                <Phone size={20} />
                8(930)035-48-41
              </a>
              <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Работаем 24/7. Выезд в день обращения.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
