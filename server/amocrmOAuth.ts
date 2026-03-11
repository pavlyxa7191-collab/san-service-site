/**
 * amoCRM OAuth2 Callback Route
 *
 * Handles the redirect from amoCRM after user grants access.
 * URL: GET /api/amocrm/oauth?code=...&referer=...&platform=...
 *
 * Flow:
 * 1. User opens the amoCRM integration authorization URL
 * 2. amoCRM redirects to this endpoint with ?code=...
 * 3. We exchange the code for access + refresh tokens
 * 4. Tokens are stored in the DB
 * 5. User sees a success page
 */

import type { Express, Request, Response } from "express";
import { exchangeCodeForTokens } from "./amocrm";

export function registerAmoCrmOAuthRoutes(app: Express): void {
  /**
   * GET /api/amocrm/oauth
   * Called by amoCRM after user authorizes the integration.
   */
  app.get("/api/amocrm/oauth", async (req: Request, res: Response) => {
    const { code, referer, platform } = req.query as Record<string, string>;

    console.log("[amoCRM OAuth] Callback received", { code: code ? "present" : "missing", referer, platform });

    if (!code) {
      return res.status(400).send(renderPage(false, "Ошибка: параметр code отсутствует в запросе."));
    }

    try {
      const tokens = await exchangeCodeForTokens(code);
      console.log("[amoCRM OAuth] Authorization successful, tokens saved to DB");

      return res.send(renderPage(true, "Авторизация прошла успешно! Токены сохранены. Теперь все заявки с сайта будут автоматически передаваться в amoCRM.", tokens.expires_in));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[amoCRM OAuth] Token exchange failed:", errorMessage);

      return res.status(500).send(renderPage(false, `Ошибка при обмене кода на токены: ${errorMessage}`));
    }
  });
}

function renderPage(success: boolean, message: string, expiresIn?: number): string {
  const icon = success ? "✅" : "❌";
  const title = success ? "amoCRM подключён" : "Ошибка подключения amoCRM";
  const bgColor = success ? "#0A0F1E" : "#1a0505";
  const accentColor = success ? "#D0021B" : "#cc4400";
  const expiryInfo = expiresIn ? `<p style="color:#888;font-size:14px;margin-top:8px;">Токен действителен ${Math.round(expiresIn / 3600)} часов. Обновление происходит автоматически.</p>` : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: ${bgColor};
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 56px; margin-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
    .accent { color: ${accentColor}; }
    p { color: #ccc; line-height: 1.6; margin-bottom: 8px; }
    .btn {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 28px;
      background: ${accentColor};
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
    }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1 class="accent">${title}</h1>
    <p>${message}</p>
    ${expiryInfo}
    ${success ? `
    <p style="margin-top:16px;color:#aaa;font-size:14px;">Перейдите в панель администратора и нажмите «Проверить подключение» для подтверждения.</p>
    <a href="/admin/leads" class="btn">Перейти в панель лидов →</a>
    ` : `
    <a href="/" class="btn">На главную</a>
    `}
  </div>
</body>
</html>`;
}
