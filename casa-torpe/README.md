# 🏠 Casa Vacanze Torpè - Sito Web

Sito web per la gestione e promozione dell'appartamento vacanze a Torpè, Sardegna.

## 🚀 Funzionalità

- ✅ Sito web responsive e moderno
- ✅ Galleria immagini interattiva
- ✅ Calendario disponibilità
- ✅ Form di contatto integrato con Telegram
- ✅ Bot Telegram per risposte automatiche
- ✅ Integrazione Google Calendar (in sviluppo)

## 📋 Prerequisiti

- Account GitHub
- Account Vercel (gratuito)
- Bot Telegram configurato

## 🔧 Setup Completo

### 1. Setup GitHub

```bash
cd casa-torpe
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/casa-torpe.git
git push -u origin main
```

### 2. Crea Bot Telegram

1. Apri Telegram e cerca `@BotFather`
2. Invia `/newbot`
3. Scegli nome: "Casa Vacanze Torpè"
4. Scegli username: "CasaTorpeBot" (o simile)
5. Salva il **TOKEN** che ricevi

**Ottieni il tuo Chat ID:**
1. Cerca `@userinfobot` su Telegram
2. Invia `/start`
3. Salva l'**ID** che ricevi

### 3. Deploy su Vercel

#### Opzione A - Da Dashboard Vercel:
1. Vai su [vercel.com](https://vercel.com)
2. Clicca "Add New Project"
3. Importa il repository GitHub
4. Configura le variabili d'ambiente:
   - `VITE_TELEGRAM_BOT_TOKEN`: Il token del bot
   - `VITE_TELEGRAM_CHAT_ID`: Il tuo chat ID
   - `VITE_TELEGRAM_BOT_USERNAME`: Username del bot (senza @)
5. Clicca "Deploy"

#### Opzione B - Da CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

Poi configura le env variables dalla dashboard Vercel.

### 4. Configurazione Bot Telegram

Crea un file `telegram-bot.js` in una cartella separata per il bot:

```javascript
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = 'IL_TUO_TOKEN';
const bot = new TelegramBot(TOKEN, {polling: true});

const OWNER_CHAT_ID = 'IL_TUO_CHAT_ID';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `🏠 Benvenuto alla Casa Vacanze Torpè!\n\n` +
    `Come posso aiutarti?\n\n` +
    `📅 /disponibilita - Controlla disponibilità\n` +
    `📍 /posizione - Dove siamo\n` +
    `💰 /prezzi - Tariffe\n` +
    `📞 /contatti - Informazioni contatto\n` +
    `ℹ️ /info - Info sull'appartamento`
  );
});

bot.onText(/\/disponibilita/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    `📅 Verifica disponibilità:\n` +
    `https://TUO-SITO.vercel.app/#calendario`
  );
});

bot.onText(/\/prezzi/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    `💰 Tariffe:\n\n` +
    `🌞 Alta stagione (Lug-Ago): €800/settimana\n` +
    `🌤️ Media stagione (Giu, Set): €600/settimana\n` +
    `❄️ Bassa stagione: €400/settimana\n\n` +
    `📝 Minimo 3 notti`
  );
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    `🏠 Appartamento Torpè:\n\n` +
    `👥 Fino a 6 ospiti\n` +
    `🛏️ 2 camere da letto\n` +
    `🚿 1 bagno\n` +
    `📶 WiFi incluso\n` +
    `🅿️ Parcheggio privato\n` +
    `🏖️ 15 min dalle spiagge`
  );
});

bot.onText(/\/posizione/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    `📍 Torpè, Nuoro, Sardegna\n\n` +
    `✈️ Aeroporto Olbia: 40km\n` +
    `🏖️ Spiagge Posada: 15 min\n` +
    `🏖️ San Teodoro: 25 min`
  );
  bot.sendLocation(msg.chat.id, 40.6667, 9.6333);
});

bot.onText(/\/contatti/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    `📞 Contatti:\n\n` +
    `📱 Tel: +39 123 456 7890\n` +
    `📧 Email: info@casatorpe.it\n` +
    `🌐 Sito: https://TUO-SITO.vercel.app`
  );
});

bot.on('message', (msg) => {
  const text = msg.text;
  
  if (text && !text.startsWith('/')) {
    bot.sendMessage(OWNER_CHAT_ID, 
      `📨 Nuovo messaggio da:\n` +
      `👤 ${msg.from.first_name} ${msg.from.last_name || ''}\n` +
      `🆔 @${msg.from.username || 'N/A'}\n` +
      `💬 ${text}`
    );
    
    bot.sendMessage(msg.chat.id, 
      `Grazie! Ti risponderemo al più presto.\n\n` +
      `Usa i comandi per info immediate:\n` +
      `/disponibilita /prezzi /info`
    );
  }
});

console.log('Bot avviato!');
```

**Installa e avvia il bot:**
```bash
npm install node-telegram-bot-api
node telegram-bot.js
```

**Per hosting bot 24/7:**
- [Railway.app](https://railway.app) (consigliato)
- [Render.com](https://render.com)
- VPS con PM2

### 5. Personalizzazioni

Nel file `src/App.jsx`:

1. **Sostituisci le immagini** (linea ~38):
   ```javascript
   const images = [
     '/images/foto1.jpg',  // Metti le tue foto in /public/images/
     '/images/foto2.jpg',
     '/images/foto3.jpg',
   ];
   ```

2. **Aggiorna contatti** (cerca nella sezione contatti):
   - Telefono
   - Email
   - Indirizzo

3. **Personalizza descrizioni**

### 6. Integrazione Google Calendar (Opzionale)

Per sincronizzare le prenotazioni:

1. Vai su [Google Cloud Console](https://console.cloud.google.com)
2. Crea progetto
3. Abilita "Google Calendar API"
4. Crea credenziali API Key
5. Aggiungi su Vercel: `VITE_GOOGLE_CALENDAR_API_KEY`

Poi modifica `src/App.jsx` per chiamare l'API.

## 🎨 Personalizzazione Stile

I colori principali sono in `src/App.jsx`:
- Blu primario: `blue-600` 
- Verde disponibilità: `green-50`
- Rosso prenotato: `red-100`

Modifica in Tailwind per cambiare colori.

## 📱 Testing Locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000

## 🐛 Troubleshooting

**Build fallisce su Vercel:**
- Verifica che tutte le env variables siano configurate
- Controlla i log di build nella dashboard Vercel

**Form non invia:**
- Verifica TOKEN e CHAT_ID in Vercel
- Controlla console browser per errori

**Bot non risponde:**
- Verifica che il bot sia in esecuzione
- Usa `/start` per inizializzare la conversazione

## 📞 Supporto

Per problemi o domande, apri una Issue su GitHub.

## 📄 Licenza

MIT

---

Made with ❤️ for Casa Vacanze Torpè
