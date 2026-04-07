import { Link, useParams } from "wouter";
import SchemaMarkup from "@/components/SchemaMarkup";
import { SITE_URL } from "@/siteConfig";
import { applyPageSeo } from "@/lib/seo";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import CertificatesCarousel from "@/components/CertificatesCarousel";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { reachGoal } from "@/lib/metrika";
import { toast } from "sonner";
import {
  IconBedbugs, IconCockroaches, IconRodents, IconTicks, IconMold,
  IconDeodorization, IconOzonation, IconOdor,
} from "@/components/Icons";
import { Phone } from "lucide-react";

// ─── DESIGN TOKENS (unified with About/Blog/Contacts) ───────────────────────
const NAVY     = "#0A0F1E";
const NAVY_MID = "#162040";
const RED      = "#D0021B";
const WHITE    = "#FFFFFF";
const GRAY_BG  = "#F8F9FC";
const GRAY_BD  = "#E2E8F0";

// ─── FADE IN ON SCROLL ───────────────────────────────────────────────────────
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// ─── CITY NAMES ───────────────────────────────────────────────────────────────
const CITY_NAMES: Record<string, string> = {
  moskva: "Москве", voskresensk: "Воскресенске", kolomna: "Коломне",
  zhukovsky: "Жуковском", ramenskoe: "Раменском", elektrostal: "Электростали",
  balashikha: "Балашихе", podolsk: "Подольске", khimki: "Химках",
  mytishchi: "Мытищах", odintsovo: "Одинцово", serpukhov: "Серпухове",
  noginsk: "Ногинске", domodedovo: "Домодедово", lyubertsy: "Люберцах",
  korolev: "Королёве",
};

// ─── SERVICE DATA ─────────────────────────────────────────────────────────────
interface ServiceMethod { name: string; desc: string; price: string; }
interface ServiceStage  { num: string; title: string; desc: string; }
interface ServiceFaq    { q: string; a: string; }
interface ServiceInfo {
  title: string; subtitle: string; description: string;
  priceFrom: number; guarantee: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  heroImage?: string;
  methods: ServiceMethod[]; stages: ServiceStage[];
  faq: ServiceFaq[]; dangers: string[]; results: string[];
  preparation: string[];
}

// Pest images (transparent PNG, served from public folder)
const PEST_IMAGES: Record<string, string> = {
  klopov: "/pest-bedbug.png",
  tarakanov: "/pest-cockroach.png",
  pleseni: "/pest-mold.png",
  dezinfektsii: "/pest-virus.png",
  gryzunov: "/pest-rat.png",
  kleshhej: "/pest-tick.png",
};

// Animated pest overlay configs per service
interface PestOverlayItem {
  src: string;
  top?: string; bottom?: string; left?: string; right?: string;
  size: number;
  opacity: number;
  rotation: number;
  animDelay: number;
  animDuration: number;
  blur?: number;
  flipX?: boolean;
}

const PEST_OVERLAYS: Record<string, PestOverlayItem[]> = {
  klopov: [
    // Large semi-transparent bedbugs scattered around the hero
    { src: "/pest-bedbug.png",  top: "5%",    left: "2%",   size: 50,  opacity: 0.30, rotation: 25,  animDelay: 0,   animDuration: 7,  blur: 0 },
    { src: "/pest-bedbug.png",  top: "60%",   right: "3%",  size: 44,  opacity: 0.35, rotation: -15, animDelay: 1.5, animDuration: 9,  blur: 0 },
    { src: "/pest-bedbug.png",  bottom: "8%", left: "5%",   size: 52,  opacity: 0.25, rotation: 60,  animDelay: 2,   animDuration: 11, blur: 0.5 },
    { src: "/pest-bedbug.png",  top: "30%",   left: "0%",   size: 36,  opacity: 0.20, rotation: -40, animDelay: 0.5, animDuration: 8,  blur: 1 },
    { src: "/pest-bedbug.png",  bottom: "20%", right: "10%", size: 40, opacity: 0.28, rotation: 10,  animDelay: 3,   animDuration: 10, blur: 0 },
    { src: "/pest-bedbug.png",  top: "45%",   right: "16%", size: 32,  opacity: 0.18, rotation: 80,  animDelay: 1,   animDuration: 13, blur: 1.5 },
    { src: "/pest-bedbug.png",  top: "75%",   left: "10%",  size: 46,  opacity: 0.22, rotation: -20, animDelay: 2.5, animDuration: 8,  blur: 0 },
    { src: "/pest-bedbug.png",  top: "15%",   right: "25%", size: 28,  opacity: 0.15, rotation: 45,  animDelay: 4,   animDuration: 12, blur: 2 },
  ],
  tarakanov: [
    { src: "/pest-cockroach.png", top: "5%",   left: "2%",   size: 72,  opacity: 0.28, rotation: 15,  animDelay: 0,   animDuration: 8,  blur: 0 },
    { src: "/pest-cockroach.png", top: "60%",  right: "5%",  size: 56,  opacity: 0.30, rotation: -30, animDelay: 2,   animDuration: 10, blur: 0 },
    { src: "/pest-cockroach.png", bottom: "5%", left: "3%",  size: 64,  opacity: 0.22, rotation: 50,  animDelay: 1,   animDuration: 12, blur: 0.5 },
    { src: "/pest-cockroach.png", top: "30%",  left: "0%",   size: 44,  opacity: 0.18, rotation: -10, animDelay: 3,   animDuration: 9,  blur: 1 },
    { src: "/pest-cockroach.png", bottom: "25%", right: "12%", size: 50, opacity: 0.32, rotation: 70,  animDelay: 0.5, animDuration: 11, blur: 0 },
    { src: "/pest-cockroach.png", top: "50%",  right: "22%", size: 38,  opacity: 0.16, rotation: -55, animDelay: 1.5, animDuration: 14, blur: 1.5 },
    { src: "/pest-cockroach.png", top: "15%",  left: "6%",   size: 58,  opacity: 0.20, rotation: 35,  animDelay: 2.5, animDuration: 7,  blur: 0 },
    { src: "/pest-cockroach.png", top: "80%",  right: "20%", size: 42,  opacity: 0.14, rotation: -25, animDelay: 3.5, animDuration: 9,  blur: 1 },
  ],
  pleseni: [
    { src: "/pest-mold.png",  top: "5%",   right: "3%",  size: 90,  opacity: 0.22, rotation: 0,   animDelay: 0,   animDuration: 12, blur: 2 },
    { src: "/pest-mold.png",  bottom: "5%", left: "2%",  size: 110, opacity: 0.15, rotation: 15,  animDelay: 2,   animDuration: 15, blur: 3 },
    { src: "/pest-mold.png",  top: "50%",  right: "8%",  size: 70,  opacity: 0.18, rotation: -10, animDelay: 1,   animDuration: 10, blur: 1.5 },
    { src: "/pest-mold.png",  top: "25%",  left: "4%",   size: 55,  opacity: 0.12, rotation: 30,  animDelay: 3,   animDuration: 13, blur: 3 },
    { src: "/pest-mold.png",  bottom: "30%", right: "20%", size: 65, opacity: 0.10, rotation: -20, animDelay: 1.5, animDuration: 16, blur: 4 },
  ],
  dezinfektsii: [
    { src: "/pest-virus.png", top: "5%",   right: "2%",  size: 100, opacity: 0.22, rotation: 0,   animDelay: 0,   animDuration: 14, blur: 1 },
    { src: "/pest-virus.png", bottom: "5%", left: "1%",  size: 80,  opacity: 0.18, rotation: 20,  animDelay: 2,   animDuration: 16, blur: 2 },
    { src: "/pest-virus.png", top: "45%",  right: "10%", size: 65,  opacity: 0.15, rotation: -15, animDelay: 1,   animDuration: 11, blur: 1 },
    { src: "/pest-virus.png", top: "25%",  left: "3%",   size: 50,  opacity: 0.12, rotation: 40,  animDelay: 3,   animDuration: 18, blur: 3 },
    { src: "/pest-virus.png", bottom: "25%", right: "18%", size: 70, opacity: 0.10, rotation: -30, animDelay: 1.5, animDuration: 13, blur: 2 },
  ],
  gryzunov: [
    { src: "/pest-mouse.png", top: "5%",    right: "2%",  size: 120, opacity: 0.20, rotation: 10,  animDelay: 0,   animDuration: 10, blur: 0 },
    { src: "/pest-mouse.png", bottom: "5%", left: "1%",   size: 90,  opacity: 0.15, rotation: -15, animDelay: 2,   animDuration: 13, blur: 1 },
    { src: "/pest-mouse.png", top: "50%",   right: "15%", size: 70,  opacity: 0.12, rotation: 5,   animDelay: 1,   animDuration: 11, blur: 1.5 },
    { src: "/pest-mouse.png", top: "25%",   left: "2%",   size: 55,  opacity: 0.10, rotation: -20, animDelay: 3,   animDuration: 14, blur: 2 },
  ],
  kleshhej: [
    { src: "/pest-tick.png", top: "5%",    right: "2%",  size: 90,  opacity: 0.28, rotation: 15,  animDelay: 0,   animDuration: 9,  blur: 0 },
    { src: "/pest-tick.png", bottom: "5%", left: "2%",   size: 70,  opacity: 0.22, rotation: -20, animDelay: 1.5, animDuration: 11, blur: 0.5 },
    { src: "/pest-tick.png", top: "50%",   right: "12%", size: 55,  opacity: 0.18, rotation: 40,  animDelay: 1,   animDuration: 13, blur: 1 },
    { src: "/pest-tick.png", top: "25%",   left: "3%",   size: 45,  opacity: 0.14, rotation: -35, animDelay: 2.5, animDuration: 10, blur: 1.5 },
    { src: "/pest-tick.png", bottom: "25%", right: "20%", size: 60, opacity: 0.16, rotation: 60,  animDelay: 0.5, animDuration: 12, blur: 0 },
  ],
};

// PestOverlay component — renders animated pest images in hero background
function PestOverlay({ slug }: { slug: string }) {
  const items = PEST_OVERLAYS[slug];
  if (!items || items.length === 0) return null;
  return (
    <>
      {items.map((p, i) => (
        <img
          key={i}
          src={p.src}
          alt=""
          aria-hidden="true"
          className="pest-overlay-img"
          style={{
            position: "absolute",
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            width: p.size,
            height: p.size,
            objectFit: "contain",
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg) scaleX(${p.flipX ? -1 : 1})`,
            filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.3))${p.blur ? ` blur(${p.blur}px)` : ""}`,
            animation: `pestCrawl${i % 3} ${p.animDuration}s ease-in-out ${p.animDelay}s infinite`,
            pointerEvents: "none",
            userSelect: "none" as const,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

const SERVICES: Record<string, ServiceInfo> = {
  klopov: {
    title: "Уничтожение клопов",
    subtitle: "Полная ликвидация постельных клопов на всех стадиях развития. Гарантия 3 года. Холодный туман от 1 500 ₽. Без запаха.",
    description: "Постельные клопы — одна из самых неприятных проблем. Они активны ночью, кусают спящих людей и крайне сложно поддаются самостоятельному уничтожению. Наши специалисты применяют профессиональные методы обработки, которые гарантируют полное уничтожение клопов на всех стадиях развития — от яиц до взрослых особей.",
    priceFrom: 1500, guarantee: "3 года", Icon: IconBedbugs,
    methods: [
      { name: "Холодный туман", desc: "Мелкодисперсное распыление инсектицида. Проникает в щели, матрасы, мебель. Наиболее эффективный метод.", price: "от 1 500 ₽" },
      { name: "Горячий туман", desc: "Термическая обработка. Уничтожает яйца и взрослых особей. Рекомендуется при сильном заражении.", price: "от 3 000 ₽" },
      { name: "Комплексная обработка", desc: "Сочетание холодного тумана и контактных препаратов. Максимальная эффективность.", price: "от 4 500 ₽" },
    ],
    stages: [
      { num: "01", title: "Подготовка", desc: "Вы готовите квартиру по инструкции: убираете вещи, накрываете продукты" },
      { num: "02", title: "Диагностика", desc: "Специалист осматривает помещение, определяет очаги заражения и степень поражения" },
      { num: "03", title: "Обработка", desc: "Профессиональная обработка всех поверхностей, мебели и щелей" },
      { num: "04", title: "Проветривание", desc: "Отсутствуйте 3–4 часа, затем проветрите помещение" },
      { num: "05", title: "Гарантия", desc: "Гарантийный талон на 3 года. Повторная обработка бесплатно" },
    ],
    faq: [
      { q: "Сколько стоит обработка от клопов?", a: "Стоимость от 1 500 ₽ для однокомнатной квартиры. Зависит от площади и степени заражения." },
      { q: "Нужно ли уходить из квартиры?", a: "Да, на 3–4 часа. После проветривания можно вернуться." },
      { q: "Когда исчезнут клопы?", a: "В течение 1–3 дней после обработки. Яйца погибают в течение 7 дней." },
      { q: "Безопасно ли для детей и животных?", a: "Препараты безопасны после высыхания (3–4 часа). Дети и животные могут вернуться через 4–6 часов." },
    ],
    dangers: [
      "Укусы вызывают аллергические реакции",
      "Нарушают сон и психологический комфорт",
      "Быстро размножаются: 1 самка = 500 яиц",
      "Трудно уничтожить самостоятельно",
    ],
    results: [
      "Полное уничтожение за 1 визит",
      "Обработка всех мест обитания",
      "Уничтожение яиц и личинок",
      "Гарантийный талон на 3 года",
    ],
    preparation: [
      "Постирайте постельное бельё при 60°C",
      "Уберите вещи в пакеты или шкафы",
      "Накройте продукты и посуду",
      "Обеспечьте доступ к мебели и плинтусам",
      "Уберите домашних животных и детей",
    ],
  },
  tarakanov: {
    title: "Уничтожение тараканов",
    subtitle: "Дезинсекция от тараканов без запаха. Безопасно для детей и животных. Гарантия 3 года. Холодный туман 1500р.",
    description: "Тараканы — переносчики опасных инфекций: сальмонеллёза, дизентерии, гепатита. Они загрязняют продукты питания и вызывают аллергию. Бытовые средства дают временный эффект — тараканы быстро вырабатывают устойчивость. Профессиональная обработка уничтожает всю популяцию за 1 визит.",
    priceFrom: 1500, guarantee: "3 года", Icon: IconCockroaches,
    methods: [
      { name: "Гелевые приманки", desc: "Без запаха. Не нужно уходить из квартиры. Тараканы погибают в течение 3–7 дней.", price: "от 1 500 ₽" },
      { name: "Холодный туман", desc: "Мгновенный результат. Нужно отсутствовать 2–3 часа. Эффективен при сильном заражении.", price: "от 2 000 ₽" },
      { name: "Комплексная обработка", desc: "Гель + туман. Максимальная эффективность. Рекомендуется для ресторанов и кафе.", price: "от 3 500 ₽" },
    ],
    stages: [
      { num: "01", title: "Осмотр", desc: "Выявляем очаги заражения: кухня, ванная, места за техникой" },
      { num: "02", title: "Выбор метода", desc: "Подбираем оптимальный метод в зависимости от степени заражения" },
      { num: "03", title: "Обработка", desc: "Наносим препараты в местах обитания тараканов" },
      { num: "04", title: "Результат", desc: "Тараканы погибают в течение 1–7 дней в зависимости от метода" },
      { num: "05", title: "Гарантия", desc: "Гарантийный талон на 3 года. Повторная обработка бесплатно при необходимости" },
    ],
    faq: [
      { q: "Сколько стоит обработка от тараканов?", a: "Стоимость от 1 500 ₽ для однокомнатной квартиры. Зависит от площади, степени заражения и метода." },
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
      "Гарантийный талон на 3 года",
    ],
    preparation: [
      "Освободите кухонные шкафы от посуды",
      "Уберите продукты в холодильник",
      "Обеспечьте доступ за холодильник и плиту",
      "Вынесите мусор",
      "При обработке туманом — уберите животных",
    ],
  },
  gryzunov: {
    title: "Уничтожение грызунов",
    subtitle: "Дератизация: крысы и мыши. Профессиональные методы. Гарантия 6 месяцев.",
    description: "Крысы и мыши — опасные переносчики инфекций: лептоспироза, чумы, сальмонеллёза. Они портят имущество, грызут кабели и конструкции. Самостоятельные ловушки и яды малоэффективны — грызуны быстро адаптируются. Профессиональная дератизация включает комплекс мер для полного уничтожения.",
    priceFrom: 2000, guarantee: "6 месяцев", Icon: IconRodents,
    methods: [
      { name: "Родентицидная обработка (химическая)", desc: "Профессиональные родентициды в специальных станциях. Безопасно для людей и домашних животных.", price: "от 2 000 ₽" },
      { name: "Механический отлов (капканы)", desc: "Эффективен при небольшом заражении. Не требует химических препаратов.", price: "от 2 000 ₽" },
      { name: "Газация (газообразный репеллент)", desc: "Уничтожает полностью среду обитания. Максимальная эффективность.", price: "от 5 000 ₽" },
    ],
    stages: [
      { num: "01", title: "Обследование", desc: "Выявляем пути проникновения, места обитания и степень заражения" },
      { num: "02", title: "Расстановка", desc: "Устанавливаем приманочные станции в стратегических точках" },
      { num: "03", title: "Обработка", desc: "Раскладываем профессиональные родентициды в местах активности грызунов" },
      { num: "04", title: "Контроль", desc: "Повторный визит через 7–14 дней для проверки эффективности" },
      { num: "05", title: "Профилактика", desc: "Рекомендации по герметизации щелей и предотвращению повторного появления" },
    ],
    faq: [
      { q: "Сколько стоит дератизация?", a: "Стоимость от 2 000 ₽. Зависит от площади, типа объекта и степени заражения." },
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
    preparation: [
      "Уберите продукты в герметичные контейнеры",
      "Освободите пространство вдоль стен",
      "Уберите домашних животных в день обработки",
      "Сообщите о местах, где видели грызунов",
    ],
  },
  kleshhej: {
    title: "Уничтожение клещей",
    subtitle: "Обработка участков и помещений от клещей. Гарантия 1 сезон. Безопасно для детей и домашних животных.",
    description: "Клещи — переносчики энцефалита и болезни Лайма. Особенно опасны для детей и пожилых людей. Обработка участка акарицидными препаратами создаёт защитный барьер на весь сезон. Мы обрабатываем как частные участки, так и помещения.",
    priceFrom: 2000, guarantee: "1 сезон", Icon: IconTicks,
    methods: [
      { name: "Обработка участка", desc: "Акарицидная обработка газона, кустарников и деревьев. Защита на 1–2 месяца.", price: "от 2 000 ₽" },
      { name: "Обработка помещений", desc: "Уничтожение клещей в квартире или доме. Эффективно при занесении клещей с животными.", price: "от 2 500 ₽" },
      { name: "Комплексная обработка", desc: "Участок + помещения. Максимальная защита для всей семьи.", price: "от 4 000 ₽" },
    ],
    stages: [
      { num: "01", title: "Диагностика", desc: "Оцениваем площадь и степень заражения участка или помещения" },
      { num: "02", title: "Подготовка", desc: "Скашиваем высокую траву, убираем листовой опад" },
      { num: "03", title: "Обработка", desc: "Наносим акарицидный препарат на все зоны активности клещей" },
      { num: "04", title: "Просыхание", desc: "Не заходить на участок 2–3 часа до высыхания препарата" },
      { num: "05", title: "Защита", desc: "Препарат действует 1–2 месяца. Рекомендуем повторную обработку в середине сезона" },
    ],
    faq: [
      { q: "Когда лучше проводить обработку?", a: "Оптимально — апрель–май и август–сентябрь, в периоды наибольшей активности клещей." },
      { q: "Как долго действует обработка?", a: "Акарицидный препарат действует 1–2 месяца. Для защиты на весь сезон рекомендуем 2 обработки." },
      { q: "Безопасно ли для детей и животных?", a: "После высыхания препарата (2–3 часа) участок полностью безопасен." },
      { q: "Нужно ли косить траву перед обработкой?", a: "Желательно. Короткая трава повышает эффективность обработки в 1,5–2 раза." },
    ],
    dangers: [
      "Переносят клещевой энцефалит",
      "Переносят болезнь Лайма (боррелиоз)",
      "Опасны для детей и пожилых",
      "Активны с апреля по октябрь",
    ],
    results: [
      "Защита участка на 1–2 месяца",
      "Уничтожение 95–99% клещей",
      "Безопасно для людей и животных",
      "Гарантийный талон на 1 сезон",
    ],
    preparation: [
      "Скосите траву до обработки",
      "Уберите детские игрушки с участка",
      "Уберите домашних животных на 3 часа",
      "Уберите продукты и посуду с открытых мест",
    ],
  },
  pleseni: {
    title: "Удаление плесени",
    subtitle: "Профессиональное уничтожение плесени и грибка. Гарантия 2 года.",
    description: "Плесень и грибок — серьёзная угроза здоровью. Споры плесени вызывают аллергию, бронхиальную астму и другие заболевания дыхательных путей. Самостоятельная обработка хлором или бытовыми средствами даёт временный эффект. Профессиональная обработка уничтожает плесень на глубину до 5 мм и предотвращает повторное появление.",
    priceFrom: 2000, guarantee: "2 года", Icon: IconMold,
    methods: [
      { name: "Химическая обработка", desc: "Профессиональные фунгициды уничтожают плесень и споры. Защитный эффект до 2 лет.", price: "от 2 000 ₽" },
      { name: "УФ-обработка", desc: "Ультрафиолетовое излучение уничтожает споры плесени без химических препаратов.", price: "от 3 000 ₽" },
      { name: "Комплексная обработка", desc: "Механическое удаление + фунгициды + защитное покрытие. Максимальный срок защиты.", price: "от 5 000 ₽" },
    ],
    stages: [
      { num: "01", title: "Диагностика", desc: "Определяем тип плесени, площадь поражения и причину появления" },
      { num: "02", title: "Механическое удаление", desc: "Удаляем видимые колонии плесени специальными инструментами" },
      { num: "03", title: "Химическая обработка", desc: "Наносим профессиональный фунгицид на все поражённые поверхности" },
      { num: "04", title: "Защитное покрытие", desc: "Наносим антигрибковое покрытие для предотвращения повторного появления" },
      { num: "05", title: "Рекомендации", desc: "Даём рекомендации по вентиляции и влажности для предотвращения рецидива" },
    ],
    faq: [
      { q: "Почему плесень появляется снова?", a: "Причина — повышенная влажность и плохая вентиляция. Мы устраняем плесень и даём рекомендации по профилактике." },
      { q: "Опасна ли плесень для здоровья?", a: "Да. Споры плесени вызывают аллергию, бронхиальную астму, заболевания лёгких. Особенно опасна для детей и аллергиков." },
      { q: "Сколько стоит удаление плесени?", a: "Стоимость от 2 000 ₽. Зависит от площади поражения и типа поверхности." },
      { q: "Нужно ли делать ремонт после обработки?", a: "Если плесень проникла глубоко в штукатурку, может потребоваться частичный ремонт. Мы оцениваем это при диагностике." },
    ],
    dangers: [
      "Вызывает аллергию и астму",
      "Разрушает строительные конструкции",
      "Споры невидимы и вдыхаются незаметно",
      "Особенно опасна для детей и аллергиков",
    ],
    results: [
      "Полное уничтожение плесени и спор",
      "Защитное покрытие на 2 года",
      "Рекомендации по профилактике",
      "Гарантийный талон на 2 года",
    ],
    preparation: [
      "Обеспечьте доступ к поражённым поверхностям",
      "Уберите мебель от стен",
      "Проветрите помещение перед приездом специалиста",
      "Уберите детей и животных на время обработки",
    ],
  },
  dezinfektsii: {
    title: "Дезинфекция",
    subtitle: "Уничтожение патогенных микроорганизмов. Для жилых и коммерческих объектов.",
    description: "Профессиональная дезинфекция уничтожает 99,9% патогенных микроорганизмов: вирусов, бактерий, грибков. Необходима после болезни, при санитарных требованиях Роспотребнадзора, для предприятий общепита и медицинских учреждений. Выдаём официальные документы.",
    priceFrom: 20, guarantee: "по договору", Icon: IconDeodorization,
    methods: [
      { name: "Холодный туман", desc: "Мелкодисперсное распыление дезинфектанта. Обрабатывает воздух и все поверхности.", price: "от 20 ₽/м²" },
      { name: "Озонирование", desc: "Уничтожение вирусов и бактерий озоном. Устраняет запахи. Без химических препаратов.", price: "от 25 ₽/м²" },
      { name: "Ручная обработка", desc: "Протирка поверхностей дезинфицирующими растворами. Для точечной обработки.", price: "от 15 ₽/м²" },
    ],
    stages: [
      { num: "01", title: "Оценка объекта", desc: "Определяем площадь помещения и необходимый уровень дезинфекции" },
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
    preparation: [
      "Уберите продукты и посуду",
      "Накройте технику плёнкой",
      "Уберите домашних животных и детей",
      "Обеспечьте доступ ко всем помещениям",
    ],
  },
  zapahov: {
    title: "Борьба с запахами",
    subtitle: "Устранение неприятных запахов. Озонирование и дезодорация. Гарантия результата.",
    description: "Профессиональное устранение неприятных запахов: табачного дыма, запаха животных, плесени, гари. Озонирование нейтрализует молекулы запаха на молекулярном уровне, а не маскирует их. Результат сохраняется надолго.",
    priceFrom: 2500, guarantee: "по договору", Icon: IconOdor,
    methods: [
      { name: "Озонирование", desc: "Озон нейтрализует молекулы запаха. Уничтожает бактерии и вирусы. Без химии.", price: "от 2 500 ₽" },
      { name: "Дезодорация", desc: "Нейтрализация запахов специальными составами. Быстрый результат.", price: "от 2 000 ₽" },
      { name: "Комплексная обработка", desc: "Озонирование + дезодорация. Максимальный и долговременный эффект.", price: "от 4 000 ₽" },
    ],
    stages: [
      { num: "01", title: "Диагностика", desc: "Определяем источник и тип запаха" },
      { num: "02", title: "Подготовка", desc: "Убираем источники запаха, проветриваем помещение" },
      { num: "03", title: "Обработка", desc: "Проводим озонирование или дезодорацию" },
      { num: "04", title: "Проветривание", desc: "1–2 часа до возвращения людей" },
      { num: "05", title: "Результат", desc: "Запах устранён. При необходимости — повторная обработка бесплатно" },
    ],
    faq: [
      { q: "Как долго держится результат?", a: "При устранении источника запаха — постоянно. При наличии источника (курение) — 1–3 месяца." },
      { q: "Безопасно ли озонирование?", a: "Да, после проветривания. Во время обработки в помещении нельзя находиться." },
      { q: "Помогает ли от запаха животных?", a: "Да. Озонирование эффективно устраняет запах кошачьей мочи, собак и других животных." },
      { q: "Сколько времени занимает обработка?", a: "1–3 часа в зависимости от площади и интенсивности запаха." },
    ],
    dangers: [
      "Запах табака содержит канцерогены",
      "Запах плесени — признак грибкового заражения",
      "Запах аммиака (моча животных) токсичен",
      "Хронический запах снижает качество жизни",
    ],
    results: [
      "Полное устранение запаха",
      "Обеззараживание воздуха",
      "Безопасно для людей и животных",
      "Долговременный эффект",
    ],
    preparation: [
      "Уберите домашних животных и детей",
      "Уберите продукты и посуду",
      "Обеспечьте доступ ко всем комнатам",
      "Проветрите помещение перед обработкой",
    ],
  },
};

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${GRAY_BD}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.125rem 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}
      >
        <span style={{ fontSize: "0.925rem", fontWeight: 600, color: NAVY, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: RED, fontSize: "1.25rem", flexShrink: 0, transition: "transform 0.25s ease", transform: open ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: "1.125rem", color: "#6B7280", lineHeight: 1.7, fontSize: "0.875rem" }}>{a}</div>
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
      reachGoal(`lead_${serviceSlug}`);
      setSubmitted(true);
      toast.success("Заявка принята! Перезвоним в течение 15 минут.");
    },
    onError: () => {
      toast.error("Ошибка отправки. Позвоните нам напрямую.");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    createLead.mutate({ name: name.trim() || "Не указано", phone: phone.trim(), service: serviceTitle, source: "service-page" });
  };
  if (submitted) {
    return (
      <div style={{ padding: "1.75rem", textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.625rem", color: WHITE }}>✓</div>
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: WHITE, marginBottom: "0.375rem" }}>Заявка принята!</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>Перезвоним в течение 15 минут</div>
      </div>
    );
  }
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 3, fontSize: "0.9rem", background: "rgba(255,255,255,0.08)",
    color: WHITE, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <input style={inputStyle} type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} />
      <input style={inputStyle} type="tel" placeholder="+7 (___) ___-__-__ *" value={phone} onChange={e => setPhone(e.target.value)} required />
      <button
        type="submit"
        disabled={createLead.isPending}
        style={{ width: "100%", padding: "0.875rem", background: RED, color: WHITE, border: "none", borderRadius: 3, fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", marginTop: "0.25rem" }}
      >
        {createLead.isPending ? "ОТПРАВКА..." : "ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ"}
      </button>
      <p style={{ textAlign: "center", fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
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
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: NAVY }}>Услуга не найдена</h1>
        <Link href="/" style={{ color: RED, textDecoration: "none", fontWeight: 600 }}>← На главную</Link>
      </div>
    );
  }

  const cityName = citySlug ? (CITY_NAMES[citySlug] || citySlug.charAt(0).toUpperCase() + citySlug.slice(1)) : null;
  const pageTitle = cityName ? `${service.title} в ${cityName}` : service.title;

  const serviceUrl = `${SITE_URL}/services/${serviceSlug}${citySlug ? `/${citySlug}` : ""}`;

  useEffect(() => {
    const title = cityName
      ? `${service.title} в ${cityName} — Цены, гарантия | Санитарная служба`
      : `${service.title} в Москве — Цены, гарантия | Санитарная служба`;
    applyPageSeo({
      title,
      description: `${service.subtitle} Гарантия ${service.guarantee}. Звоните 24/7: 8(495)145-21-69.`,
      ogTitle: title,
    });
  }, [serviceSlug, citySlug, service.subtitle, service.guarantee, service.title, cityName]);

  useEffect(() => {
    if (window.location.hash.replace(/^#/, "") !== "reviews") return;
    const t = window.setTimeout(() => {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [serviceSlug, citySlug]);

  return (
    <div style={{ minHeight: "100vh", background: WHITE }}>
      <SchemaMarkup
        type="service"
        name={pageTitle}
        description={service.subtitle}
        priceFrom={service.priceFrom}
        url={serviceUrl}
        faq={service.faq}
      />
      <SchemaMarkup
        type="breadcrumb"
        items={[
          { name: "Главная", url: "/" },
          { name: "Услуги", url: "/services" },
          { name: service.title, url: `/services/${serviceSlug}` },
          ...(cityName ? [{ name: cityName, url: serviceUrl }] : []),
        ]}
      />

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_MID} 60%, #0D2B5E 100%)`, position: "relative", overflow: "hidden", minHeight: 430, isolation: "isolate" }}>
        {/* Decorative grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "5%", right: "8%", width: 240, height: 240, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        {/* Red top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${RED} 0%, rgba(204,0,0,0.3) 60%, transparent 100%)` }} />
        {/* Animated pest overlays */}
        <PestOverlay slug={serviceSlug} />
        {serviceSlug === "kleshhej" && (
          <img
            className="service-specialist-hero"
            src="/specialist-kleshhej-v3.png"
            alt="Специалист по обработке от клещей"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "klopov" && (
          <img
            className="service-specialist-hero"
            src="/specialist-klopov-v2.png"
            alt="Специалист по уничтожению клопов"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "tarakanov" && (
          <img
            className="service-specialist-hero"
            src="/specialist-tarakanov.png"
            alt="Специалист по уничтожению тараканов"
            style={{
              position: "absolute",
              bottom: 0,
              left: "60%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "pleseni" && (
          <img
            className="service-specialist-hero"
            src="/specialist-pleseni-v6.png"
            alt="Специалист по удалению плесени"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "gryzunov" && (
          <img
            className="service-specialist-hero"
            src="/specialist-gryzunov.png"
            alt="Специалист по уничтожению грызунов"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "dezinfektsii" && (
          <img
            className="service-specialist-hero"
            src="/specialist-dezinfektsii.png"
            alt="Специалист по дезинфекции"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}
        {serviceSlug === "zapahov" && (
          <img
            className="service-specialist-hero"
            src="/specialist-zapahov.png"
            alt="Специалист по удалению запахов"
            style={{
              position: "absolute",
              bottom: 0,
              left: "55%",
              transform: "translateX(-50%)",
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "center bottom",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        <div className="container service-hero-container" style={{ position: "relative", zIndex: 6, paddingTop: "4rem", paddingBottom: "3rem", animation: "fadeInUp 0.7s ease both" }}>
          {/* Breadcrumbs */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.5rem", fontSize: "0.78rem", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Главная</Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            <Link href="/services" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Услуги</Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{service.title}</span>
          </div>

          <div className="service-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center" }}>
            <div>
              {cityName && (
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginBottom: "0.625rem" }}>
                  📍 {cityName}
                </div>
              )}
              <div style={{ width: 44, height: 3, background: RED, marginBottom: "1.125rem" }} />
              <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.875rem" }}>
                {pageTitle}
              </h1>
              <p style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.3125rem)", fontWeight: 600, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 520, width: "100%" }}>
                {service.subtitle}
              </p>
              <div className="service-hero-btns" style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                <Link
                  href={`/calculator?service=${serviceSlug}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: RED, color: WHITE, textDecoration: "none", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.08em", borderRadius: 8, boxShadow: `0 4px 16px rgba(208,2,27,0.4)`, transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 24px rgba(208,2,27,0.5)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px rgba(208,2,27,0.4)`; }}
                >
                  Рассчитать цену
                </Link>
                <span className="phoneAllostat"><a
                  href="tel:+74951452169"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", background: "transparent", color: WHITE, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 8, transition: "background 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                >
                  <Phone size={18} strokeWidth={2.25} style={{ flexShrink: 0 }} aria-hidden />
                  Позвонить
                </a></span>
              </div>
            </div>
            {/* Pest image or icon with prohibition circle */}
            <div className="service-icon-wrap" style={{ opacity: 1, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {PEST_IMAGES[serviceSlug] ? (
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={PEST_IMAGES[serviceSlug]}
                    alt={service.title}
                    style={{
                      width: serviceSlug === "gryzunov" ? 280 : 200,
                      height: serviceSlug === "gryzunov" ? 280 : 200,
                      objectFit: "contain",
                      filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.5))",
                      animation: "floatPest 4s ease-in-out infinite",
                    }}
                  />
                  {/* Red prohibition circle overlay */}
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      position: "absolute",
                      top: 0, left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#cc0000" strokeWidth="7" />
                    <line x1="18" y1="18" x2="82" y2="82" stroke="#cc0000" strokeWidth="7" strokeLinecap="round" />
                  </svg>
                </div>
              ) : (
                <service.Icon size={160} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: RED, padding: "0.75rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center", alignItems: "center" }}>
            {[`✓ Гарантия ${service.guarantee}`, "✓ Выезд за 2 часа", "✓ Сертифицированные препараты", "✓ 15+ лет опыта"].map((t, i) => (
              <span key={i} style={{ fontSize: "0.78rem", color: WHITE, fontWeight: 700, letterSpacing: "0.05em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── YANDEX RATING ── */}
      <Link href="/#reviews" style={{ textDecoration: "none", display: "block", background: WHITE, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="container" style={{ padding: "1rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FC3F1D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.25rem", lineHeight: 1 }}>Я</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#FABD02">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>
          <span style={{ fontSize: "clamp(0.8rem, 2vw, 0.95rem)", fontWeight: 600, color: NAVY, letterSpacing: "-0.01em" }}>
            Рейтинг организации в Яндексе — <strong>5.0</strong>
          </span>
        </div>
      </Link>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatPest { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes pestCrawl0 {
          0%   { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
          25%  { transform: translate(6px, -8px) rotate(calc(var(--r, 0deg) + 5deg)); }
          50%  { transform: translate(12px, -4px) rotate(calc(var(--r, 0deg) - 3deg)); }
          75%  { transform: translate(4px, -12px) rotate(calc(var(--r, 0deg) + 8deg)); }
          100% { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
        }
        @keyframes pestCrawl1 {
          0%   { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
          20%  { transform: translate(-8px, -5px) rotate(calc(var(--r, 0deg) - 6deg)); }
          40%  { transform: translate(-4px, -14px) rotate(calc(var(--r, 0deg) + 4deg)); }
          60%  { transform: translate(-10px, -8px) rotate(calc(var(--r, 0deg) - 2deg)); }
          80%  { transform: translate(-3px, -3px) rotate(calc(var(--r, 0deg) + 7deg)); }
          100% { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
        }
        @keyframes pestCrawl2 {
          0%   { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
          33%  { transform: translate(10px, -6px) rotate(calc(var(--r, 0deg) + 10deg)); }
          66%  { transform: translate(5px, -16px) rotate(calc(var(--r, 0deg) - 5deg)); }
          100% { transform: translate(0px, 0px) rotate(var(--r, 0deg)); }
        }
        @media (max-width: 768px) {
          .pest-overlay-img { display: none !important; }
          .service-specialist-hero { display: none !important; }
        }
        @media (max-width: 1200px) {
          .service-specialist-hero { display: none !important; }
        }
        @media (max-width: 900px) {
          .service-layout { grid-template-columns: 1fr !important; }
          .service-sidebar { position: static !important; }
          .service-icon-wrap { display: none !important; }
          .service-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .service-hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .service-hero-btns a, .service-hero-btns button { text-align: center !important; justify-content: center !important; width: 100% !important; }
          .service-dangers-grid { grid-template-columns: 1fr !important; }
          .service-results-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .service-layout { padding: 2rem 0 !important; }
          .service-sidebar { margin-top: 0 !important; }
          .service-hero-container { padding-top: 2rem !important; padding-bottom: 2rem !important; }
        }
        @media (max-width: 768px) {
          .service-hero-container { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
        }
      `}</style>
      <div className="container service-layout" style={{ padding: "3.5rem 0", display: "grid", gridTemplateColumns: "1fr min(320px, 100%)", gap: "3rem", alignItems: "start" }}>

        {/* LEFT COLUMN */}
        <div>

          {/* Description + Dangers */}
          <FadeInSection>
          <section style={{ marginBottom: "2.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
              <div style={{ width: 4, height: 26, background: RED, flexShrink: 0, borderRadius: 2 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>О проблеме</h2>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#4a5568", lineHeight: 1.8, marginBottom: "1.25rem" }}>{service.description}</p>
            <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "1.125rem 1.375rem" }}>
              <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "#C53030", marginBottom: "0.75rem" }}>⚠ Чем опасно промедление:</div>
              <div className="service-dangers-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {service.dangers.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, background: RED, borderRadius: "50%", marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", color: "#742A2A", lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </FadeInSection>

          {/* Methods + Pricing */}
          <FadeInSection delay={0.1}>
          <section style={{ marginBottom: "2.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
              <div style={{ width: 4, height: 26, background: RED, flexShrink: 0, borderRadius: 2 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>Методы и цены</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {service.methods.map((m, i) => (
                <div key={i}
                  style={{ border: `1.5px solid ${GRAY_BD}`, borderRadius: 12, padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = "0 8px 24px rgba(208,2,27,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_BD; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: NAVY, marginBottom: "0.3rem" }}>{m.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#718096", lineHeight: 1.6 }}>{m.desc}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: RED, whiteSpace: "nowrap" }}>{m.price}</div>
                    <a href="#order" style={{ fontSize: "0.72rem", color: NAVY_MID, textDecoration: "none", fontWeight: 600 }}>Заказать →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </FadeInSection>

          {/* Stages */}
          <FadeInSection delay={0.15}>
          <section style={{ marginBottom: "2.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
              <div style={{ width: 4, height: 26, background: RED, flexShrink: 0, borderRadius: 2 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>Этапы работы</h2>
            </div>
            <div>
              {service.stages.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "1.125rem", padding: "1.125rem 0", borderBottom: i < service.stages.length - 1 ? `1px solid ${GRAY_BD}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${i === 0 ? RED : GRAY_BD}`, background: i === 0 ? RED : WHITE, color: i === 0 ? WHITE : NAVY_MID, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                    {s.num}
                  </div>
                  <div style={{ paddingTop: "0.2rem" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY, marginBottom: "0.2rem" }}>{s.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#718096", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </FadeInSection>

          {/* Preparation */}
          <FadeInSection delay={0.2}>
          <section style={{ marginBottom: "2.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
              <div style={{ width: 4, height: 26, background: RED, flexShrink: 0, borderRadius: 2 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>Как подготовиться</h2>
            </div>
            <div style={{ background: GRAY_BG, borderRadius: 12, padding: "1.375rem" }}>
              {service.preparation.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", marginBottom: i < service.preparation.length - 1 ? "0.75rem" : 0 }}>
                  <div style={{ width: 22, height: 22, background: NAVY, color: WHITE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ fontSize: "0.875rem", color: "#4a5568", lineHeight: 1.55, paddingTop: "0.05rem" }}>{p}</span>
                </div>
              ))}
            </div>
          </section>
          </FadeInSection>

          {/* Results */}
          <FadeInSection delay={0.25}>
          <section style={{ background: "#EFF6FF", border: `1px solid #BFDBFE`, borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "2.75rem" }}>
            <div style={{ fontSize: "0.825rem", fontWeight: 700, color: NAVY, marginBottom: "0.75rem" }}>✓ Что вы получаете:</div>
              <div className="service-results-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {service.results.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: NAVY, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: "0.8rem", color: NAVY_MID, lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </section>
          </FadeInSection>

          {/* FAQ */}
          <FadeInSection delay={0.3}>
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.125rem" }}>
              <div style={{ width: 4, height: 26, background: RED, flexShrink: 0, borderRadius: 2 }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>Частые вопросы</h2>
            </div>
            {service.faq.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </section>
          </FadeInSection>
        </div>

        {/* RIGHT: Sticky sidebar */}
        <div id="order" className="service-sidebar" style={{ position: "sticky", top: 90 }}>
          {/* Order form */}
          <div style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_MID} 100%)`, borderRadius: 16, padding: "1.625rem", marginBottom: "0.875rem", boxShadow: "0 8px 32px rgba(10,15,30,0.25)" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: RED, marginBottom: "0.375rem" }}>Заказать обработку</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: WHITE, marginBottom: "0.25rem", lineHeight: 1.3 }}>Перезвоним за 15 минут</h3>
            <div style={{ fontSize: "1.375rem", fontWeight: 900, color: WHITE, marginBottom: "1.125rem", letterSpacing: "-0.03em" }}>
              от {service.priceFrom.toLocaleString("ru-RU")} ₽
            </div>
            <LeadForm serviceTitle={service.title} />
          </div>

          {/* Phone */}
          <div style={{ background: GRAY_BG, borderRadius: 12, padding: "1.125rem", textAlign: "center", marginBottom: "0.875rem", border: `1px solid ${GRAY_BD}` }}>
            <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginBottom: "0.375rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Звонок бесплатный</div>
            <span className="phoneAllostat"><a href="tel:+74951452169" style={{ display: "block", fontSize: "1.15rem", fontWeight: 800, color: NAVY, textDecoration: "none", marginBottom: "0.2rem" }}>8(495)145-21-69</a></span>
            <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Ежедневно 8:00–22:00</div>
          </div>

          {/* Guarantees */}
          <div style={{ background: GRAY_BG, borderRadius: 12, padding: "1.125rem", border: `1px solid ${GRAY_BD}` }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY, marginBottom: "0.75rem" }}>Наши гарантии:</div>
            {["Гарантийный талон с печатью", "Договор на оказание услуг", "Сертифицированные препараты", "Бесплатный повторный выезд", "Безопасно для детей и животных"].map((g, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: i < 4 ? "0.5rem" : 0 }}>
                <span style={{ color: NAVY, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "0.8rem", color: "#4a5568" }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewsCarousel pageContext="service" />
      <CertificatesCarousel />

      {/* ── STICKY MOBILE CTA ── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: NAVY, padding: "0.75rem 1rem", display: "none", zIndex: 100, borderTop: `2px solid ${RED}` }} className="mobile-sticky-cta">
        <div style={{ display: "flex", gap: "0.625rem", maxWidth: 600, margin: "0 auto" }}>
          <span className="phoneAllostat"><a href="tel:+74951452169" style={{ flex: 1, minWidth: 0, padding: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid rgba(255,255,255,0.25)`, color: WHITE, textDecoration: "none", fontWeight: 700, fontSize: "0.8rem", borderRadius: 3 }}><Phone size={16} strokeWidth={2.25} style={{ flexShrink: 0 }} aria-hidden />Позвонить</a></span>
          <a href="#order" style={{ flex: 1, padding: "0.75rem", textAlign: "center", background: RED, color: WHITE, textDecoration: "none", fontWeight: 800, fontSize: "0.8rem", borderRadius: 3 }}>Заказать →</a>
        </div>
      </div>

      {/* ── RELATED SERVICES ── */}
      <section style={{ background: GRAY_BG, padding: "3rem 0", borderTop: `1px solid ${GRAY_BD}` }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 4, height: 26, background: RED }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>Другие услуги</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            {Object.entries(SERVICES).filter(([slug]) => slug !== serviceSlug).map(([slug, svc]) => (
              <Link key={slug} href={`/services/${slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{ background: WHITE, borderRadius: 12, padding: "1.125rem", border: `1.5px solid ${GRAY_BD}`, cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = "0 8px 24px rgba(208,2,27,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = GRAY_BD; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <svc.Icon size={32} />
                  <div style={{ fontSize: "0.825rem", fontWeight: 700, color: NAVY, marginBottom: "0.3rem", lineHeight: 1.3, marginTop: "0.75rem" }}>{svc.title}</div>
                  <div style={{ fontSize: "0.775rem", color: RED, fontWeight: 600, marginBottom: "0.5rem" }}>от {svc.priceFrom.toLocaleString("ru-RU")} ₽</div>
                  <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Подробнее →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
