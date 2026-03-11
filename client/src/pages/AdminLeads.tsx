import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useLocation } from "wouter";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const NAVY = "#0d1f3c";
const RED = "#D0021B";

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: "Новая",      color: "#1a56db", bg: "#ebf5ff" },
  contacted: { label: "Связались",  color: "#057a55", bg: "#def7ec" },
  completed: { label: "Выполнена",  color: "#046c4e", bg: "#bcf0da" },
  cancelled: { label: "Отменена",   color: "#9b1c1c", bg: "#fde8e8" },
};

const STATUS_OPTIONS = ["new", "contacted", "completed", "cancelled"] as const;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatPhone(phone: string) {
  return phone;
}

function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const SERVICE_LABELS: Record<string, string> = {
  klopov: "Клопы",
  tarakanov: "Тараканы",
  gryzunov: "Крысы/мыши",
  pleseni: "Плесень",
  kleshhej: "Клещи",
  dezodoraciya: "Запахи",
  dezinfekciya: "Дезинфекция",
};

const PROPERTY_LABELS: Record<string, string> = {
  apartment: "Квартира",
  house: "Частный дом",
  office: "Офис",
  hostel: "Общежитие",
  warehouse: "Склад",
  restaurant: "Ресторан/кафе",
  other: "Другое",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdminLeads() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAmoSettings, setShowAmoSettings] = useState(false);

  const { data: amoCrmStatus } = trpc.leads.amoCrmStatus.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const testAmoCrm = trpc.leads.testAmoCrm.useMutation({
    onSuccess: (data) => {
      if (data.ok) {
        toast.success(`amoCRM подключён: ${data.account || "успешно"}`);
      } else {
        toast.error(`amoCRM ошибка: ${data.error || "неизвестная ошибка"}`);
      }
    },
    onError: (err) => toast.error("Ошибка: " + err.message),
  });

  const { data: leadsData, isLoading, refetch } = trpc.leads.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    refetchInterval: 30_000,
  });

  const updateStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Статус обновлён");
      refetch();
    },
    onError: (err) => {
      toast.error("Ошибка: " + err.message);
    },
  });

  // ── Auth states ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${NAVY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: NAVY, fontWeight: 600 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 400, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          <div style={{ width: 64, height: 64, background: `${NAVY}15`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔒</div>
          <h2 style={{ color: NAVY, fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>Требуется авторизация</h2>
          <p style={{ color: "#718096", marginBottom: 24, lineHeight: 1.6 }}>Для доступа к панели администратора необходимо войти в систему</p>
          <button
            onClick={() => { window.location.href = getLoginUrl(); }}
            style={{ background: RED, color: "white", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fa" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "48px 40px", maxWidth: 400, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h2 style={{ color: NAVY, fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>Доступ запрещён</h2>
          <p style={{ color: "#718096", marginBottom: 24 }}>У вашего аккаунта нет прав администратора</p>
          <button
            onClick={() => setLocation("/")}
            style={{ background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "12px 32px", fontWeight: 700, cursor: "pointer" }}
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  // ── Filter & search ──────────────────────────────────────────────────────────
  const filtered = (leadsData || []).filter((lead) => {
    const matchStatus = filterStatus === "all" || lead.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || lead.name.toLowerCase().includes(q) || lead.phone.includes(q) || (lead.service || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: (leadsData || []).length,
    new: (leadsData || []).filter(l => l.status === "new").length,
    contacted: (leadsData || []).filter(l => l.status === "contacted").length,
    completed: (leadsData || []).filter(l => l.status === "completed").length,
    cancelled: (leadsData || []).filter(l => l.status === "cancelled").length,
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setLocation("/")}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}
          >
            ← На сайт
          </button>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>Панель администратора</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Управление заявками</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>{user.name}</div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", color: "white", fontSize: "0.75rem", fontWeight: 600 }}>
            ADMIN
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { key: "all", label: "Всего", icon: "📋" },
            { key: "new", label: "Новые", icon: "🆕" },
            { key: "contacted", label: "Связались", icon: "📞" },
            { key: "completed", label: "Выполнено", icon: "✅" },
            { key: "cancelled", label: "Отменено", icon: "❌" },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              style={{
                background: filterStatus === key ? NAVY : "white",
                color: filterStatus === key ? "white" : NAVY,
                border: `2px solid ${filterStatus === key ? NAVY : "#e2e8f0"}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{counts[key as keyof typeof counts]}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 600 }}>{label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ background: "white", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#a0aec0", fontSize: "1.1rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Поиск по имени, телефону или услуге..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", outline: "none", flex: 1, fontSize: "0.9rem", color: NAVY, background: "transparent" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#a0aec0", fontSize: "1rem" }}>✕</button>
          )}
        </div>

        {/* Leads list */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#718096" }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${NAVY}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            Загрузка заявок...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#718096" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>Заявок не найдено</div>
            <div style={{ fontSize: "0.85rem" }}>Попробуйте изменить фильтры или поисковый запрос</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((lead) => {
              const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
              const isExpanded = expandedId === lead.id;
              return (
                <div
                  key={lead.id}
                  style={{
                    background: "white",
                    borderRadius: 12,
                    border: `1px solid ${isExpanded ? NAVY : "#e2e8f0"}`,
                    overflow: "hidden",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* Lead row */}
                  <div
                    style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  >
                    {/* ID + status */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 60 }}>
                      <span style={{ color: "#a0aec0", fontSize: "0.7rem", fontWeight: 600 }}>#{lead.id}</span>
                      <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "2px 10px", fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {cfg.label}
                      </span>
                    </div>

                    {/* Name + phone */}
                    <div style={{ flex: "1 1 160px" }}>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>{lead.name}</div>
                      <a href={`tel:${lead.phone}`} style={{ color: RED, fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
                        {formatPhone(lead.phone)}
                      </a>
                    </div>

                    {/* Service */}
                    <div style={{ flex: "1 1 120px" }}>
                      <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Услуга</div>
                      <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.85rem" }}>
                        {lead.service ? (SERVICE_LABELS[lead.service] || lead.service) : "—"}
                      </div>
                    </div>

                    {/* Property */}
                    <div style={{ flex: "1 1 100px" }}>
                      <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Объект</div>
                      <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.85rem" }}>
                        {lead.propertyType ? (PROPERTY_LABELS[lead.propertyType] || lead.propertyType) : "—"}
                      </div>
                    </div>

                    {/* Area */}
                    <div style={{ flex: "0 0 80px" }}>
                      <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Площадь</div>
                      <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.85rem" }}>{lead.area || "—"}</div>
                    </div>

                    {/* Date */}
                    <div style={{ flex: "0 0 130px" }}>
                      <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Дата</div>
                      <div style={{ color: NAVY, fontSize: "0.8rem" }}>{formatDate(lead.createdAt)}</div>
                    </div>

                    {/* Expand indicator */}
                    <div style={{ color: "#a0aec0", fontSize: "1rem", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▾</div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid #f0f4f8", padding: "16px 20px", background: "#fafbfc" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
                        {lead.email && (
                          <div>
                            <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Email</div>
                            <a href={`mailto:${lead.email}`} style={{ color: NAVY, fontSize: "0.85rem", textDecoration: "none" }}>{lead.email}</a>
                          </div>
                        )}
                        {(lead.priceMin || lead.priceMax) && (
                          <div>
                            <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Расчётная стоимость</div>
                            <div style={{ color: RED, fontWeight: 700, fontSize: "0.95rem" }}>
                              {lead.priceMin?.toLocaleString()} – {lead.priceMax?.toLocaleString()} ₽
                            </div>
                          </div>
                        )}
                        {lead.method && (
                          <div>
                            <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Метод связи</div>
                            <div style={{ color: NAVY, fontSize: "0.85rem", fontWeight: 600 }}>{lead.method}</div>
                          </div>
                        )}
                        <div>
                          <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Источник</div>
                          <div style={{ color: NAVY, fontSize: "0.85rem" }}>{lead.source || "сайт"}</div>
                        </div>
                      </div>

                      {lead.message && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ color: "#718096", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Сообщение</div>
                          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", color: NAVY, fontSize: "0.85rem", lineHeight: 1.6 }}>
                            {lead.message}
                          </div>
                        </div>
                      )}

                      {/* Status update */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ color: "#718096", fontSize: "0.8rem", fontWeight: 600 }}>Изменить статус:</span>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {STATUS_OPTIONS.map((s) => {
                            const c = STATUS_CONFIG[s];
                            const isActive = lead.status === s;
                            return (
                              <button
                                key={s}
                                disabled={isActive || updateStatus.isPending}
                                onClick={() => updateStatus.mutate({ id: lead.id, status: s })}
                                style={{
                                  background: isActive ? c.bg : "white",
                                  color: isActive ? c.color : "#718096",
                                  border: `1.5px solid ${isActive ? c.color : "#e2e8f0"}`,
                                  borderRadius: 20,
                                  padding: "5px 14px",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  cursor: isActive ? "default" : "pointer",
                                  opacity: updateStatus.isPending ? 0.6 : 1,
                                  transition: "all 0.15s",
                                }}
                              >
                                {c.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick action buttons */}
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                          <a
                            href={`tel:${lead.phone}`}
                            style={{ background: NAVY, color: "white", borderRadius: 8, padding: "7px 16px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            📞 Позвонить
                          </a>
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ background: "#25D366", color: "white", borderRadius: 8, padding: "7px 16px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* amoCRM Settings Panel */}
        <div style={{ marginTop: 32, background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <button
            onClick={() => setShowAmoSettings(!showAmoSettings)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: amoCrmStatus?.configured ? "#def7ec" : "#fde8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {amoCrmStatus?.configured ? "✅" : "⚙️"}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>Интеграция amoCRM</div>
                <div style={{ fontSize: "0.78rem", color: amoCrmStatus?.configured ? "#057a55" : "#718096", marginTop: 2 }}>
                  {amoCrmStatus?.configured
                    ? `Подключено: ${amoCrmStatus.subdomain}.kommo.com`
                    : "Не настроено — лиды сохраняются только в базе данных"}
                </div>
              </div>
            </div>
            <span style={{ color: "#718096", fontSize: "1.2rem", transform: showAmoSettings ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>

          {showAmoSettings && (
            <div style={{ padding: "0 24px 24px", borderTop: "1px solid #f0f4f8" }}>
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: NAVY, fontWeight: 700, fontSize: "0.9rem", marginBottom: 12 }}>Статус подключения</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Поддомен (AMO_SUBDOMAIN)", ok: !!amoCrmStatus?.subdomain, value: amoCrmStatus?.subdomain },
                    { label: "Client ID (AMO_CLIENT_ID)", ok: amoCrmStatus?.hasClientId },
                    { label: "Client Secret (AMO_CLIENT_SECRET)", ok: amoCrmStatus?.hasClientSecret },
                    { label: "Токены OAuth2 (в БД)", ok: !!amoCrmStatus?.hasTokensInDb, value: amoCrmStatus?.hasTokensInDb ? "✓ Авторизован" : undefined },
                    { label: "Redirect URI", ok: !!amoCrmStatus?.redirectUri, value: amoCrmStatus?.redirectUri ? "✓ Задан" : undefined },
                  ].map((item) => (
                    <div key={item.label} style={{ background: item.ok ? "#f0fdf4" : "#fff5f5", border: `1px solid ${item.ok ? "#86efac" : "#fca5a5"}`, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: "0.7rem", color: "#718096", fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: item.ok ? "#16a34a" : "#dc2626" }}>
                        {item.ok ? (item.value || "✓ Задан") : "✗ Не задан"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* OAuth2 Authorization Button */}
                {amoCrmStatus?.oauthUrl && !amoCrmStatus?.hasTokensInDb && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: "#92400e", fontSize: "0.9rem", marginBottom: 8 }}>⚠️ Требуется авторизация в amoCRM</div>
                    <p style={{ color: "#78350f", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: 12 }}>
                      Нажмите кнопку ниже, чтобы авторизоваться в amoCRM. После авторизации токены будут автоматически сохранены.
                    </p>
                    <a
                      href={amoCrmStatus.oauthUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", background: "#1a56db", color: "white", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}
                    >
                      🔐 Авторизоваться в amoCRM
                    </a>
                    {amoCrmStatus.redirectUri && (
                      <div style={{ marginTop: 10, fontSize: "0.75rem", color: "#78350f" }}>
                        Callback URL: <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: 4 }}>{amoCrmStatus.redirectUri}</code>
                      </div>
                    )}
                  </div>
                )}

                {amoCrmStatus?.hasTokensInDb && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.9rem", marginBottom: 4 }}>✅ OAuth2 авторизация выполнена</div>
                    <p style={{ color: "#15803d", fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>
                      Токены сохранены в базе данных. Обновление происходит автоматически.
                    </p>
                  </div>
                )}

                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <h5 style={{ color: NAVY, fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>Как настроить:</h5>
                  <ol style={{ color: "#4a5568", fontSize: "0.82rem", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                    <li>Создайте интеграцию в amoCRM: <strong>Настройки → Интеграции → Создать интеграцию</strong></li>
                    <li>Укажите Redirect URI: <code style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: 4 }}>{amoCrmStatus?.redirectUri || "https://sanservice-l8sjslkh.manus.space/api/amocrm/oauth"}</code></li>
                    <li>Добавьте секреты <code>AMO_SUBDOMAIN</code>, <code>AMO_CLIENT_ID</code>, <code>AMO_CLIENT_SECRET</code> в настройки проекта</li>
                    <li>Нажмите кнопку «Авторизоваться в amoCRM» выше — токены сохранятся автоматически</li>
                  </ol>
                </div>

                <button
                  onClick={() => testAmoCrm.mutate()}
                  disabled={!amoCrmStatus?.configured || testAmoCrm.isPending}
                  style={{
                    background: amoCrmStatus?.configured ? RED : "#e2e8f0",
                    color: amoCrmStatus?.configured ? "white" : "#a0aec0",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: amoCrmStatus?.configured ? "pointer" : "not-allowed",
                    transition: "all 0.15s",
                  }}
                >
                  {testAmoCrm.isPending ? "Проверка..." : "Проверить подключение"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", padding: "24px 0", color: "#a0aec0", fontSize: "0.75rem" }}>
          Показано {filtered.length} из {(leadsData || []).length} заявок · Обновляется каждые 30 секунд
        </div>
      </div>
    </div>
  );
}
