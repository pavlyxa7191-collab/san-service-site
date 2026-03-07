import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contacts() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => toast.error("Ошибка при отправке. Позвоните нам напрямую."),
  });

  function validate() {
    const errs: { name?: string; phone?: string } = {};
    if (!name.trim()) errs.name = "Введите имя";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) errs.phone = "Введите корректный телефон";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section style={{ background: "#0D1F33", borderBottom: "2px solid #CC0000" }}>
        <div className="container py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="red-square" />
            <span className="section-label">Контакты</span>
          </div>
          <h1
            className="font-black text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Свяжитесь с нами
          </h1>
          <p className="text-base" style={{ color: "#999" }}>
            Работаем 24/7. Выезд специалиста в день обращения.
          </p>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #0D1F33", paddingBottom: "1rem" }}>
              <div className="red-square" />
              <h2 className="font-black text-xl" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
                Контактная информация
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                <Phone size={20} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Телефон
                  </div>
                  <a href="tel:+79300354841" className="font-black text-xl no-underline" style={{ color: "#0D1F33" }}>
                    8(930)035-48-41
                  </a>
                  <div className="text-xs mt-1" style={{ color: "#666" }}>Работаем 24/7</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                <Mail size={20} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Email
                  </div>
                  <a href="mailto:info@ses88.ru" className="font-semibold no-underline" style={{ color: "#0D1F33" }}>
                    info@ses88.ru
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                <MapPin size={20} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Адрес
                  </div>
                  <div className="font-semibold text-sm" style={{ color: "#0D1F33" }}>
                    г. Москва, ул. Профсоюзная, д. 56
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#666" }}>
                    Работаем по всей Москве и МО
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                <Clock size={20} style={{ color: "#CC0000", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Режим работы
                  </div>
                  <div className="font-semibold text-sm" style={{ color: "#0D1F33" }}>
                    Круглосуточно, без выходных
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#666" }}>
                    Выезд в день обращения
                  </div>
                </div>
              </div>
            </div>

            {/* Quick facts */}
            <div className="p-6" style={{ background: "#0D1F33" }}>
              <div className="section-label mb-4">Почему выбирают нас</div>
              <div className="space-y-3">
                {[
                  "Официальный договор на каждый заказ",
                  "Гарантия до 3 лет",
                  "Сертифицированные препараты",
                  "Безопасно для детей и животных",
                  "ИНН: 7726389900 | ОГРН: 1157746482250",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={14} style={{ color: "#CC0000", flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "#ccc" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="flex items-center gap-3 mb-8" style={{ borderBottom: "2px solid #0D1F33", paddingBottom: "1rem" }}>
              <div className="red-square" />
              <h2 className="font-black text-xl" style={{ color: "#0D1F33", letterSpacing: "-0.02em" }}>
                Оставить заявку
              </h2>
            </div>

            {submitted ? (
              <div className="p-12 text-center" style={{ background: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                <CheckCircle size={48} style={{ color: "#CC0000", margin: "0 auto 1.5rem" }} />
                <h3 className="font-black text-xl mb-3" style={{ color: "#0D1F33" }}>Заявка принята!</h3>
                <p className="text-sm" style={{ color: "#666" }}>
                  Наш специалист перезвонит вам в течение 15 минут.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#0D1F33", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    className={`form-field ${errors.name ? "error" : ""}`}
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: "#CC0000" }}>{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#0D1F33", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    className={`form-field ${errors.phone ? "error" : ""}`}
                    placeholder="+7 (900) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <p className="text-xs mt-1" style={{ color: "#CC0000" }}>{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#0D1F33", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-field"
                    placeholder="ivan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: "#0D1F33", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Сообщение
                  </label>
                  <textarea
                    className="form-field"
                    rows={4}
                    placeholder="Опишите проблему..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  className="btn-red w-full justify-center"
                  onClick={() =>
                    validate() &&
                    createLead.mutate({ name, phone, email, message, source: "contact-page" })
                  }
                  disabled={createLead.isPending}
                >
                  {createLead.isPending ? "Отправка..." : "Отправить заявку"}
                  <ArrowRight size={14} />
                </button>

                <p className="text-xs" style={{ color: "#999" }}>
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                  Данные не передаются третьим лицам.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
