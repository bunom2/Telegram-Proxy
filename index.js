// index.js
import express from "express"; // Современный синтаксис, поддерживается Node 22+
const app = express();
app.use(express.json());

// URL твоего Google Apps Script Web App (с /exec)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9bAtvT100ZF4rg59SIxoysyPQj_SfbkTINW2PrhTC9UtrTH1OoK_MW9-ZxNEbw-o/exec";

// Логируем старт
console.log("🚀 Telegram Proxy Server запущен...");

// Проверочный маршрут для браузера
app.get("/", (req, res) => {
  console.log("GET / — проверка соединения");
  res.send("✅ Bot proxy is running");
});

// Основной маршрут, куда Telegram шлёт обновления
app.post("/webhook", async (req, res) => {
  console.log("📩 Получен запрос от Telegram:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    // Пересылаем данные в Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    console.log(`✅ Ответ от Google Script: ${response.status} ${text.slice(0, 200)}`);

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Ошибка при пересылке в Google Script:", err);
    res.status(500).send("Error");
  }
});

// Запускаем сервер на Render-порту
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Сервер слушает порт ${PORT}`));
