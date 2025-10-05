// index.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// 🔗 Укажи свой Google Apps Script Web App URL (с /exec)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz9bAtvT100ZF4rg59SIxoysyPQj_SfbkTINW2PrhTC9UtrTH1OoK_MW9-ZxNEbw-o/exec";

// 📬 Telegram будет стучаться сюда
app.post('/webhook', async (req, res) => {
  try {
    // Пересылаем данные в Google Script
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.status(200).send('OK'); // Telegram доволен
  } catch (err) {
    console.error("Ошибка при пересылке:", err);
    res.sendStatus(500);
  }
});

// Проверка в браузере
app.get('/', (req, res) => res.send('Bot proxy is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
