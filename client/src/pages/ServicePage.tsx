import { Link, useParams } from "wouter";
import { Phone, ArrowRight, CheckCircle, Shield, Clock, Star, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── PERMANENT CDN PHOTOS ─────────────────────────────────────────────────────
const CDN_BASE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663313765274/L8SjSLKH4wQcbNtHZ9BCPq";
const P = {
  hero:       `${CDN_BASE}/site-photos/hero.jpg`,
  specialist: `${CDN_BASE}/site-photos/specialist.jpg`,
  kitchen:    `${CDN_BASE}/site-photos/kitchen.jpg`,
  room:       `${CDN_BASE}/site-photos/room.jpg`,
  products:   `${CDN_BASE}/site-photos/products.jpg`,
  process:    `${CDN_BASE}/site-photos/process.jpg`,
  work:       `${CDN_BASE}/site-photos/work.jpg`,
  team:       `${CDN_BASE}/site-photos/team.jpg`,
  equipment:  `${CDN_BASE}/site-photos/equipment.jpg`,
  spray:      `${CDN_BASE}/site-photos/spray.jpg`,
};

// ─── CITY NAMES ───────────────────────────────────────────────────────────────
const CITY_NAMES: Record<string, string> = {
  moskva:      "Москве",
  voskresensk: "Воскресенске",
  kolomna:     "Коломне",
  zhukovsky:   "Жуковском",
  ramenskoe:   "Раменском",
  elektrostal: "Электростали",
  balashikha:  "Балашихе",
  podolsk:     "Подольске",
  khimki:      "Химках",
  mytishchi:   "Мытищах",
  odintsovo:   "Одинцово",
  serpukhov:   "Серпухове",
  noginsk:     "Ногинске",
  domodedovo:  "Домодедово",
  lyubertsy:   "Люберцах",
  korolev:     "Королёве",
};

// ─── SERVICE DATA ─────────────────────────────────────────────────────────────
interface ServiceMethod {
  name: string;
  desc: string;
  price: string;
}
interface ServiceStage {
  num: string;
  title: string;
  desc: string;
}
interface ServiceFaq {
  q: string;
  a: string;
}
interface ServiceInfo {
  title: string;
  subtitle: string;
  description: string;
  priceFrom: number;
  guarantee: string;
  heroPhoto: string;
  galleryPhotos: string[];
  methods: ServiceMethod[];
  stages: ServiceStage[];
  faq: ServiceFaq[];
  dangers: string[];
  results: string[];
}

const SERVICES: Record<string, ServiceInfo> = {
  klopov: {
    title: "Уничтожение клопов",
    subtitle: "Полная ликвидация постельных клопов на всех стадиях развития. Гарантия 3 года.",
    description:
      "Постельные клопы — одна из самых неприятных проблем. Они активны ночью, кусают спящих людей и крайне сложно поддаются самостоятельному уничтожению. Наши специалисты применяют профессиональные методы обработки, которые гарантируют полное уничтожение клопов на всех стадиях развития — от яиц до взрослых особей.",
    priceFrom: 2500,
    guarantee: "3 года",
    heroPhoto: P.hero,
    galleryPhotos: [P.specialist, P.process, P.work],
    methods: [
      {
        name: "Холодный туман",
        desc: "Базовый метод. Препарат распыляется мелкодисперсными частицами, проникает в труднодоступные места. Без запаха, быстро.",
        price: "от 2 500 ₽",
      },
      {
        name: "Горячий туман",
        desc: "Максимальная эффективность. Горячий пар с инсектицидом уничтожает клопов и яйца в любых щелях и складках.",
        price: "от 3 500 ₽",
      },
      {
        name: "Опрыскивание",
        desc: "Точечная обработка очагов заражения. Эффективно при небольшом заражении.",
        price: "от 1 500 ₽",
      },
    ],
    stages: [
      { num: "01", title: "Диагностика", desc: "Специалист осматривает помещение и определяет степень заражения, выявляет очаги" },
      { num: "02", title: "Подготовка", desc: "Вы убираете продукты, посуду и домашних животных. Инструктаж по подготовке — бесплатно" },
      { num: "03", title: "Обработка", desc: "Проводим обработку сертифицированными препаратами выбранным методом" },
      { num: "04", title: "Проветривание", desc: "2–4 часа проветриваете помещение, затем можно возвращаться" },
      { num: "05", title: "Гарантия", desc: "Выдаём договор и гарантийный талон. При повторном появлении — бесплатная обработка" },
    ],
    faq: [
      { q: "Сколько стоит обработка от клопов?", a: "Стоимость зависит от площади и метода обработки. Базовая цена — от 2 500 ₽ для однокомнатной квартиры. Точную цену рассчитайте в калькуляторе." },
      { q: "Нужно ли уходить из квартиры?", a: "Да, во время обработки нужно покинуть помещение на 2–3 часа. После завершения — проветрить 2–4 часа. Затем можно возвращаться." },
      { q: "Сколько обработок нужно?", a: "Как правило, достаточно одной обработки. При сильном заражении может потребоваться повторная через 2 недели — бесплатно по гарантии." },
      { q: "Безопасно ли для детей и животных?", a: "Все препараты сертифицированы и безопасны после высыхания. Детям и животным нужно отсутствовать во время обработки и 2–4 часа после." },
    ],
    dangers: [
      "Укусы вызывают аллергические реакции",
      "Переносят возбудителей гепатита B",
      "1 самка откладывает до 500 яиц",
      "Устойчивы к бытовым средствам",
    ],
    results: [
      "Уничтожение на всех стадиях развития",
      "Обработка всех щелей и складок",
      "Гарантийный талон на 3 года",
      "Договор с печатью организации",
    ],
  },
  tarakanov: {
    title: "Уничтожение тараканов",
    subtitle: "Эффективная дезинсекция от тараканов. Без запаха. Гарантия 1 год.",
    description:
      "Тараканы — переносчики опасных инфекций: сальмонеллёза, дизентерии, гепатита A. Они загрязняют продукты питания, посуду и поверхности. Самостоятельные методы борьбы дают временный эффект. Профессиональная обработка уничтожает тараканов и их яйца за один визит.",
    priceFrom: 1500,
    guarantee: "1 год",
    heroPhoto: P.kitchen,
    galleryPhotos: [P.process, P.specialist, P.spray],
    methods: [
      {
        name: "Гелевые приманки",
        desc: "Современный метод без запаха. Тараканы поедают гель и передают яд сородичам. Эффективен даже в труднодоступных местах.",
        price: "от 1 500 ₽",
      },
      {
        name: "Холодный туман",
        desc: "Быстрое уничтожение большой популяции. Препарат проникает во все щели и укрытия.",
        price: "от 2 000 ₽",
      },
      {
        name: "Горячий туман",
        desc: "Максимальная эффективность при сильном заражении. Уничтожает яйца и взрослых особей.",
        price: "от 2 500 ₽",
      },
    ],
    stages: [
      { num: "01", title: "Осмотр", desc: "Определяем степень заражения, выявляем пути проникновения и места обитания" },
      { num: "02", title: "Подготовка", desc: "Убираете продукты и посуду. Мы подготавливаем оборудование и препараты" },
      { num: "03", title: "Обработка", desc: "Наносим препараты в места обитания тараканов: плинтусы, щели, под мебелью" },
      { num: "04", title: "Результат", desc: "Тараканы исчезают в течение 1–3 дней. Гель действует до 3 месяцев" },
      { num: "05", title: "Гарантия", desc: "Гарантийный талон на 1 год. Повторная обработка бесплатно при необходимости" },
    ],
    faq: [
      { q: "Сколько стоит обработка от тараканов?", a: "Стоимость от 1 500 ₽ для однокомнатной квартиры. Зависит от площади, степени заражения и метода. Рассчитайте точную цену в калькуляторе." },
      { q: "Когда исчезнут тараканы?", a: "При использовании гелевых приманок — в течение 3–7 дней. При обработке туманом — в течение 1–2 дней." },
      { q: "Нужно ли уходить из квартиры?", a: "При гелевом методе — не нужно. При обработке туманом — нужно отсутствовать 2–3 часа." },
      { q: "Почему не помогают магазинные средства?", a: "Тараканы быстро вырабатывают устойчивость к бытовым инсектицидам. Профессиональные препараты действуют иначе." },
    ],
    dangers: [
      "Переносят сальмонеллёз и дизентерию",
      "Загрязняют продукты питания",
      "Вызывают аллергию и астму",
      "Быстро размножаются и адаптируются",
    ],
    results: [
      "Полное уничтожение за 1 визит",
      "Обработка всех мест обитания",
      "Без запаха (гелевый метод)",
      "Гарантийный талон на 1 год",
    ],
  },
  gryzunov: {
    title: "Уничтожение грызунов",
    subtitle: "Дератизация: крысы и мыши. Профессиональные методы. Гарантия 6 месяцев.",
    description:
      "Крысы и мыши — опасные переносчики инфекций: лептоспироза, чумы, сальмонеллёза. Они портят имущество, грызут кабели и конструкции. Самостоятельные ловушки и яды малоэффективны — грызуны быстро адаптируются. Профессиональная дератизация включает комплекс мер для полного уничтожения.",
    priceFrom: 3000,
    guarantee: "6 месяцев",
    heroPhoto: P.equipment,
    galleryPhotos: [P.work, P.team, P.products],
    methods: [
      {
        name: "Раскладка приманок",
        desc: "Профессиональные родентициды в специальных станциях. Безопасно для людей и домашних животных.",
        price: "от 3 000 ₽",
      },
      {
        name: "Механические ловушки",
        desc: "Эффективны при небольшом заражении. Не требуют химических препаратов.",
        price: "от 2 000 ₽",
      },
      {
        name: "Комплексная дератизация",
        desc: "Сочетание методов + герметизация путей проникновения. Максимальная эффективность.",
        price: "от 5 000 ₽",
      },
    ],
    stages: [
      { num: "01", title: "Обследование", desc: "Выявляем пути проникновения, места обитания и степень заражения" },
      { num: "02", title: "Расстановка", desc: "Устанавливаем приманочные станции в стратегических точках" },
      { num: "03", title: "Обработка", desc: "Раскладываем профессиональные родентициды в местах активности грызунов" },
      { num: "04", title: "Контроль", desc: "Повторный визит через 7–14 дней для проверки эффективности" },
      { num: "05", title: "Профилактика", desc: "Рекомендации по герметизации щелей и предотвращению повторного появления" },
    ],
    faq: [
      { q: "Сколько стоит дератизация?", a: "Стоимость от 3 000 ₽. Зависит от площади, типа объекта и степени заражения. Для частных домов и предприятий — индивидуальный расчёт." },
      { q: "Как быстро исчезнут грызуны?", a: "При использовании родентицидов — в течение 5–14 дней. Это связано с механизмом действия препаратов." },
      { q: "Безопасно ли для домашних животных?", a: "Приманочные станции защищены от доступа домашних животных. Препараты размещаются только в недоступных для них местах." },
      { q: "Нужно ли уходить из квартиры?", a: "Нет, при использовании приманочных станций присутствие людей не ограничено." },
    ],
    dangers: [
      "Переносят лептоспироз и сальмонеллёз",
      "Грызут кабели (пожароопасность)",
      "Портят продукты и имущество",
      "1 пара даёт до 2000 потомков в год",
    ],
    results: [
      "Полное уничтожение грызунов",
      "Устранение путей проникновения",
      "Профилактические рекомендации",
      "Гарантийный талон на 6 месяцев",
    ],
  },
  pleseni: {
    title: "Обработка от плесени",
    subtitle: "Профессиональное уничтожение плесени и грибка. Гарантия 2 года.",
    description:
      "Плесень и грибок — серьёзная угроза здоровью. Споры плесени вызывают аллергию, бронхиальную астму и другие заболевания дыхательных путей. Самостоятельная обработка хлором или бытовыми средствами даёт временный эффект. Профессиональная обработка уничтожает плесень на глубину до 5 мм и предотвращает повторное появление.",
    priceFrom: 2000,
    guarantee: "2 года",
    heroPhoto: P.room,
    galleryPhotos: [P.process, P.spray, P.work],
    methods: [
      {
        name: "Химическая обработка",
        desc: "Профессиональные фунгициды уничтожают плесень и споры. Защитный эффект до 2 лет.",
        price: "от 2 000 ₽",
      },
      {
        name: "УФ-обработка",
        desc: "Ультрафиолетовое излучение уничтожает споры плесени без химических препаратов.",
        price: "от 3 000 ₽",
      },
      {
        name: "Комплексная обработка",
        desc: "Механическое удаление + химическая обработка + защитное покрытие. Максимальный результат.",
        price: "от 4 000 ₽",
      },
    ],
    stages: [
      { num: "01", title: "Диагностика", desc: "Определяем вид плесени, площадь поражения и причины появления" },
      { num: "02", title: "Подготовка", desc: "Защищаем мебель и вещи. Обеспечиваем вентиляцию помещения" },
      { num: "03", title: "Удаление", desc: "Механически удаляем видимые колонии плесени" },
      { num: "04", title: "Обработка", desc: "Наносим профессиональный фунгицид на поражённые и прилегающие поверхности" },
      { num: "05", title: "Защита", desc: "Наносим защитное покрытие, предотвращающее повторное появление плесени" },
    ],
    faq: [
      { q: "Сколько стоит обработка от плесени?", a: "Стоимость от 2 000 ₽. Зависит от площади поражения и выбранного метода. Рассчитайте точную цену в калькуляторе." },
      { q: "Поможет ли одна обработка?", a: "Да, профессиональная обработка даёт долгосрочный эффект. Гарантия — 2 года. При повторном появлении — бесплатная обработка." },
      { q: "Нужно ли устранять причину плесени?", a: "Да, для долгосрочного результата нужно устранить причину: протечки, конденсат, недостаточную вентиляцию. Мы дадим рекомендации." },
      { q: "Опасна ли плесень для здоровья?", a: "Да. Споры плесени вызывают аллергию, бронхит, астму. Особенно опасна для детей и пожилых людей." },
    ],
    dangers: [
      "Вызывает аллергию и бронхиальную астму",
      "Поражает лёгкие при длительном воздействии",
      "Разрушает строительные конструкции",
      "Быстро распространяется по всему помещению",
    ],
    results: [
      "Полное уничтожение плесени и спор",
      "Защитное покрытие на 2 года",
      "Рекомендации по профилактике",
      "Гарантийный талон на 2 года",
    ],
  },
  dezinfektsiya: {
    title: "Дезинфекция",
    subtitle: "Уничтожение патогенных микроорганизмов. Для жилья и предприятий.",
    description:
      "Профессиональная дезинфекция уничтожает вирусы, бактерии и другие патогены. Необходима после болезней, при санитарных требованиях для предприятий, а также для профилактики. Работаем по нормам СанПиН и Роспотребнадзора.",
    priceFrom: 20,
    guarantee: "По договору",
    heroPhoto: P.spray,
    galleryPhotos: [P.specialist, P.process, P.equipment],
    methods: [
      {
        name: "Влажная дезинфекция",
        desc: "Обработка поверхностей дезинфицирующими растворами. Эффективно против большинства патогенов.",
        price: "от 20 ₽/м²",
      },
      {
        name: "Аэрозольная дезинфекция",
        desc: "Обработка воздуха и труднодоступных поверхностей. Максимальное покрытие.",
        price: "от 30 ₽/м²",
      },
      {
        name: "УФ-обеззараживание",
        desc: "Дополнительное обеззараживание воздуха ультрафиолетом. Без химии.",
        price: "от 15 ₽/м²",
      },
    ],
    stages: [
      { num: "01", title: "Оценка объекта", desc: "Определяем площадь, тип помещения и необходимый уровень дезинфекции" },
      { num: "02", title: "Подготовка", desc: "Убираем продукты, накрываем технику, обеспечиваем вентиляцию" },
      { num: "03", title: "Обработка", desc: "Дезинфицируем все поверхности и воздух выбранным методом" },
      { num: "04", title: "Проветривание", desc: "2–4 часа до возвращения людей" },
      { num: "05", title: "Документы", desc: "Выдаём акт и журнал дезинфекции, соответствующие требованиям Роспотребнадзора" },
    ],
    faq: [
      { q: "Нужна ли дезинфекция после болезни?", a: "Рекомендуется после COVID-19, гриппа, кишечных инфекций. Особенно важна для многоквартирных домов и офисов." },
      { q: "Какие документы выдаёте?", a: "Акт выполненных работ, журнал дезинфекции, сертификаты на препараты. Все документы соответствуют требованиям Роспотребнадзора." },
      { q: "Работаете ли с предприятиями?", a: "Да. Заключаем договоры на регулярное обслуживание кафе, ресторанов, офисов, складов, медицинских учреждений." },
      { q: "Как быстро приедет специалист?", a: "Выезд в день обращения. Срочный выезд в течение 2 часов." },
    ],
    dangers: [
      "Вирусы и бактерии невидимы невооружённым глазом",
      "Патогены сохраняются на поверхностях до 72 часов",
      "Риск заражения для всех жильцов",
      "Особая опасность для детей и пожилых",
    ],
    results: [
      "Уничтожение 99,9% патогенов",
      "Документы для Роспотребнадзора",
      "Безопасные сертифицированные препараты",
      "Акт выполненных работ",
    ],
  },
};

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E2E8F0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1a2332", paddingRight: 16, lineHeight: 1.4 }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: "#CC0000",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div style={{ paddingBottom: 18, color: "#4a5568", lineHeight: 1.7, fontSize: 14 }}>{a}</div>
      )}
    </div>
  );
}

// ─── LEAD FORM ────────────────────────────────────────────────────────────────
function LeadForm({ serviceTitle }: { serviceTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Заявка принята! Перезвоним в течение 15 минут.");
    },
    onError: () => {
      toast.error("Ошибка отправки. Позвоните нам: 8(930)035-48-41");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    createLead.mutate({
      name: name.trim() || "Не указано",
      phone: phone.trim(),
      service: serviceTitle,
      source: "service-page",
    });
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "28px 24px",
          textAlign: "center",
          background: "#F0FFF4",
          borderRadius: 12,
          border: "2px solid #22C55E",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#15803D", marginBottom: 6 }}>Заявка принята!</div>
        <div style={{ color: "#166534", fontSize: 14 }}>Перезвоним в течение 15 минут</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 16px",
            border: "2px solid #E2E8F0",
            borderRadius: 8,
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <input
          type="tel"
          placeholder="+7 (___) ___-__-__ *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "13px 16px",
            border: "2px solid #E2E8F0",
            borderRadius: 8,
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={createLead.isPending}
        style={{
          width: "100%",
          background: "#CC0000",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "15px 24px",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.04em",
          fontFamily: "inherit",
        }}
      >
        {createLead.isPending ? "Отправка..." : "ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ"}
      </button>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </div>
    </form>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ServicePage() {
  const params = useParams<{ service: string; city?: string }>();
  const serviceSlug = params.service;
  const citySlug = params.city;

  const service = SERVICES[serviceSlug];

  if (!service) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Услуга не найдена</h1>
        <Link href="/" style={{ color: "#CC0000" }}>
          ← На главную
        </Link>
      </div>
    );
  }

  const cityName = citySlug
    ? CITY_NAMES[citySlug] || citySlug.charAt(0).toUpperCase() + citySlug.slice(1)
    : null;
  const pageTitle = cityName ? `${service.title} в ${cityName}` : service.title;

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: 460,
          background: "linear-gradient(135deg, #0f1923 0%, #1a2d40 60%, #1e3a5f 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${service.heroPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.22,
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(15,25,35,0.95) 40%, rgba(15,25,35,0.5) 100%)",
          }}
        />
        {/* Decorative diagonal stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "15%",
            width: 280,
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)",
            transform: "skewX(-15deg)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 24px 60px",
            width: "100%",
          }}
        >
          {/* Breadcrumbs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 24,
              fontSize: 13,
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              Главная
            </Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <Link href="/services" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              Услуги
            </Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{service.title}</span>
          </div>

          <div style={{ maxWidth: 680 }}>
            <div style={{ width: 44, height: 4, background: "#CC0000", marginBottom: 20, borderRadius: 2 }} />

            {cityName && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <MapPin size={14} style={{ color: "#CC0000" }} />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}>
                  {cityName} и область
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: "clamp(26px, 4.5vw, 46px)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 14,
                letterSpacing: "-0.02em",
              }}
            >
              {pageTitle}
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 32, lineHeight: 1.6 }}>
              {service.subtitle}
            </p>

            {/* Key badges */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 36 }}>
              {[
                { dot: "#CC0000", text: `от ${service.priceFrom.toLocaleString("ru-RU")} ₽` },
                { dot: "#22C55E", text: `Гарантия ${service.guarantee}` },
                { dot: "#60A5FA", text: "Выезд в день обращения" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{ width: 8, height: 8, background: b.dot, borderRadius: "50%", flexShrink: 0 }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="tel:+79300354841"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#CC0000",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "15px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "0.04em",
                }}
              >
                <Phone size={17} />
                ПОЗВОНИТЬ
              </a>
              <a
                href="#order"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "15px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                РАССЧИТАТЬ ЦЕНУ
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: "#CC0000", padding: "14px 24px" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: <Shield size={15} />, text: `Гарантия ${service.guarantee}` },
            { icon: <Clock size={15} />, text: "Выезд за 2 часа" },
            { icon: <CheckCircle size={15} />, text: "Сертифицированные препараты" },
            { icon: <Star size={15} />, text: "15+ лет опыта" },
          ].map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 7, color: "#fff", fontSize: 13, fontWeight: 600 }}
            >
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "56px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* Description + Dangers */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>О проблеме</h2>
            </div>
            <p style={{ fontSize: 15, color: "#4a5568", lineHeight: 1.8, marginBottom: 24 }}>
              {service.description}
            </p>
            <div
              style={{
                background: "#FFF5F5",
                border: "1px solid #FED7D7",
                borderRadius: 10,
                padding: "20px 24px",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#C53030", marginBottom: 14 }}>
                ⚠ Чем опасно промедление:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {service.dangers.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        background: "#CC0000",
                        borderRadius: "50%",
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 13, color: "#742A2A", lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Methods + Pricing */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Методы и цены</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {service.methods.map((m, i) => (
                <div
                  key={i}
                  style={{
                    border: "2px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1a2332", marginBottom: 6 }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#718096", lineHeight: 1.6 }}>{m.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#CC0000", whiteSpace: "nowrap" }}>
                      {m.price}
                    </div>
                    <a
                      href="tel:+79300354841"
                      style={{
                        display: "inline-block",
                        marginTop: 8,
                        background: "#0f1923",
                        color: "#fff",
                        textDecoration: "none",
                        padding: "7px 14px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Заказать
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stages */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>
                Как проходит обработка
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {service.stages.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 18,
                    paddingBottom: i < service.stages.length - 1 ? 22 : 0,
                    position: "relative",
                  }}
                >
                  {i < service.stages.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 17,
                        top: 38,
                        width: 2,
                        height: "calc(100% - 14px)",
                        background: "#E2E8F0",
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#0f1923",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2332", marginBottom: 4 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#718096", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Results */}
          <section
            style={{
              background: "#F0FFF4",
              border: "1px solid #C6F6D5",
              borderRadius: 10,
              padding: "22px 24px",
              marginBottom: 48,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "#276749", marginBottom: 14 }}>
              ✓ Что вы получаете:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {service.results.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <CheckCircle size={14} style={{ color: "#22C55E", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#276749", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Photo gallery */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>
                Фото наших работ
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {service.galleryPhotos.map((photo, i) => (
                <div key={i} style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden" }}>
                  <img
                    src={photo}
                    alt={`${service.title} — фото ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>
                Частые вопросы
              </h2>
            </div>
            <div>
              {service.faq.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Sticky sidebar */}
        <div id="order" style={{ position: "sticky", top: 90 }}>
          {/* Order form */}
          <div
            style={{
              background: "#fff",
              border: "2px solid #E2E8F0",
              borderRadius: 14,
              padding: "26px 24px",
              marginBottom: 18,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a2332", marginBottom: 4 }}>
              Заказать обработку
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>
              Перезвоним в течение 15 минут
            </div>
            <LeadForm serviceTitle={service.title} />
          </div>

          {/* Phone block */}
          <div
            style={{
              background: "#0f1923",
              borderRadius: 14,
              padding: "22px 24px",
              textAlign: "center",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 8,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Звонок бесплатный
            </div>
            <a
              href="tel:+79300354841"
              style={{
                display: "block",
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                textDecoration: "none",
                marginBottom: 4,
              }}
            >
              8(930)035-48-41
            </a>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Ежедневно 8:00–22:00</div>
          </div>

          {/* Guarantees */}
          <div style={{ background: "#F5F7FA", borderRadius: 14, padding: "22px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2332", marginBottom: 14 }}>
              Наши гарантии:
            </div>
            {[
              "Гарантийный талон с печатью",
              "Договор на оказание услуг",
              "Сертифицированные препараты",
              "Бесплатный повторный выезд",
              "Безопасно для детей и животных",
            ].map((g, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <CheckCircle size={14} style={{ color: "#22C55E", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#4a5568" }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RELATED SERVICES ── */}
      <section style={{ background: "#F5F7FA", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 4, height: 28, background: "#CC0000", borderRadius: 2 }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Другие услуги</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {Object.entries(SERVICES)
              .filter(([slug]) => slug !== serviceSlug)
              .map(([slug, svc]) => (
                <Link key={slug} href={`/services/${slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "18px 20px",
                      border: "2px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1a2332",
                        marginBottom: 6,
                        lineHeight: 1.3,
                      }}
                    >
                      {svc.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#CC0000", fontWeight: 600, marginBottom: 10 }}>
                      от {svc.priceFrom.toLocaleString("ru-RU")} ₽
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9CA3AF", fontSize: 12 }}>
                      Подробнее <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
