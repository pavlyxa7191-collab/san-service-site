import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { trpc } from "@/lib/trpc";
import { reachGoal } from "@/lib/metrika";
import { toast } from "sonner";
import {
  formatRuPhoneInput,
  isCompleteRuPhone,
  RU_PHONE_PLACEHOLDER,
  nationalDigitsBeforeCursor,
  caretFromNationalCount,
} from "@/lib/phone";

const NAVY = "#0d1f3c";
const RED = "#CC0000";
const STORAGE_KEY = "exit_popup_shown";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownRef = useRef(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const phoneCaretNat = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = phoneInputRef.current;
    const n = phoneCaretNat.current;
    if (el && n !== null) {
      const pos = caretFromNationalCount(phone, n);
      el.setSelectionRange(pos, pos);
    }
    phoneCaretNat.current = null;
  }, [phone]);

  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      reachGoal("lead_exit_popup");
      setSubmitted(true);
      toast.success("Заявка отправлена! Перезвоним в течение 5 минут.");
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Позвоните нам напрямую.";
      toast.error(`Ошибка отправки. ${msg}`);
    },
  });

  const triggerPopup = useCallback(() => {
    if (shownRef.current) return;
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;
    shownRef.current = true;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(true);
  }, []);

  useEffect(() => {
    // If already shown this session — mark ref immediately so timer/events never fire
    if (sessionStorage.getItem(STORAGE_KEY)) {
      shownRef.current = true;
      return;
    }

    // Show after 30 seconds
    timerRef.current = setTimeout(triggerPopup, 30_000);

    // Exit intent: mouse leaves viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        triggerPopup();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [triggerPopup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Укажите имя");
      return;
    }
    if (!isCompleteRuPhone(phone)) {
      setPhoneError("Введите полный номер телефона");
      return;
    }
    setPhoneError("");
    createLead.mutate({
      name: name.trim(),
      phone,
      source: "exit_popup",
    });
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .exit-popup-overlay {
          animation: fadeIn 0.25s ease-out;
        }
        .exit-popup-modal {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="exit-popup-overlay"
        onClick={() => setShow(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 99998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Modal */}
        <div
          className="exit-popup-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white",
            borderRadius: 20,
            maxWidth: 440,
            width: "100%",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShow(false)}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(0,0,0,0.06)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              color: "#718096",
              zIndex: 1,
            }}
            aria-label="Закрыть"
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ background: NAVY, padding: "28px 28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎁</div>
            <div style={{ color: RED, fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Специальное предложение
            </div>
            <h2 style={{ color: "white", fontWeight: 800, fontSize: "1.4rem", lineHeight: 1.3, margin: 0 }}>
              Получите скидку 10%<br />на первую обработку
            </h2>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 28px 28px" }}>
            {!submitted ? (
              <>
                <p style={{ color: "#4a5568", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
                  Оставьте заявку прямо сейчас — перезвоним за 5 минут и рассчитаем стоимость со скидкой
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                      padding: "12px 16px",
                      fontSize: "0.95rem",
                      color: NAVY,
                      outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = NAVY; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                  />
                  <div>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={RU_PHONE_PLACEHOLDER}
                      value={phone}
                      onChange={(e) => {
                        const el = e.target;
                        const sel = el.selectionStart ?? el.value.length;
                        phoneCaretNat.current = nationalDigitsBeforeCursor(el.value, sel);
                        setPhoneError("");
                        setPhone(formatRuPhoneInput(el.value));
                      }}
                      aria-invalid={!!phoneError}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: phoneError ? `1.5px solid ${RED}` : "1.5px solid #e2e8f0",
                        boxShadow: phoneError ? `inset 0 0 0 1px ${RED}` : undefined,
                        borderRadius: 10,
                        padding: "12px 16px",
                        fontSize: "0.95rem",
                        color: NAVY,
                        outline: "none",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={(e) => {
                        if (!phoneError) e.target.style.borderColor = NAVY;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = phoneError ? RED : "#e2e8f0";
                      }}
                    />
                    {phoneError ? (
                      <p style={{ fontSize: 12, color: RED, margin: "6px 0 0" }}>{phoneError}</p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    style={{
                      background: RED,
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "14px",
                      fontWeight: 800,
                      fontSize: "1rem",
                      cursor: createLead.isPending ? "not-allowed" : "pointer",
                      opacity: createLead.isPending ? 0.7 : 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      transition: "opacity 0.15s",
                    }}
                  >
                    {createLead.isPending ? "Отправка..." : "Получить скидку →"}
                  </button>
                </form>

                <p style={{ color: "#a0aec0", fontSize: "0.72rem", textAlign: "center", marginTop: 12 }}>
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
                <h3 style={{ color: NAVY, fontWeight: 800, fontSize: "1.2rem", marginBottom: 8 }}>
                  Заявка принята!
                </h3>
                <p style={{ color: "#4a5568", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 20 }}>
                  Наш специалист перезвонит вам в течение 5 минут и подтвердит скидку 10%
                </p>
                <button
                  onClick={() => setShow(false)}
                  style={{
                    background: NAVY,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 32px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
