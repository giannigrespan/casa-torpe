# 🎯 GUIDA COMPLETA DEPLOY - Casa Vacanze Torpè

## 📦 Cosa hai adesso

Ho creato 2 progetti separati:

1. **`/casa-torpe/`** - Sito web React
2. **`/casa-torpe-bot/`** - Bot Telegram

## 🚀 PASSO 1: Deploy Sito Web su Vercel + GitHub

### A. Setup GitHub

```bash
cd casa-torpe

# Inizializza Git
git init
git add .
git commit -m "Initial commit - Casa Vacanze Torpè"
git branch -M main

# Crea repository su GitHub
# Vai su github.com → New Repository → "casa-torpe"
# NON aggiungere README, .gitignore o licenza

# Collega al repository
git remote add origin https://github.com/TUO_USERNAME/casa-torpe.git
git push -u origin main
```

### B. Crea Bot Telegram

1. Apri Telegram
2. Cerca `@BotFather`
3. Invia `/newbot`
4. Nome: "Casa Vacanze Torpè"
5. Username: "CasaTorpeBot" (o altro disponibile)
6. **SALVA IL TOKEN** che ricevi

### C. Ottieni il tuo Chat ID

1. Cerca `@userinfobot` su Telegram
2. Invia `/start`
3. **SALVA IL TUO CHAT ID**

### D. Deploy su Vercel

#### Opzione 1 - Web Dashboard (più semplice):

1. Vai su [vercel.com](https://vercel.com)
2. Fai login con GitHub
3. Click "Add New Project"
4. Importa `casa-torpe` da GitHub
5. Click "Deploy"

#### Opzione 2 - CLI:

```bash
npm install -g vercel
vercel login
vercel --prod
```

### E. Configura Variabili d'Ambiente su Vercel

1. Dashboard Vercel → Seleziona progetto
2. Settings → Environment Variables
3. Aggiungi queste variabili:

```
VITE_TELEGRAM_BOT_TOKEN = il_token_da_botfather
VITE_TELEGRAM_CHAT_ID = il_tuo_chat_id
VITE_TELEGRAM_BOT_USERNAME = CasaTorpeBot (senza @)
```

4. Click "Save"
5. Deployments → Redeploy (per applicare le variabili)

### F. Verifica il Sito

Apri l'URL che Vercel ti ha dato (es: `casa-torpe.vercel.app`)

✅ Il sito dovrebbe essere online!

---

## 🤖 PASSO 2: Setup Bot Telegram

### A. Prepara il Bot

```bash
cd ../casa-torpe-bot

# Installa dipendenze
npm install

# Copia il file .env di esempio
cp .env.example .env
```

### B. Configura il file .env

Apri `.env` e inserisci:

```
TELEGRAM_BOT_TOKEN=il_token_da_botfather
OWNER_CHAT_ID=il_tuo_chat_id
WEBSITE_URL=https://tuosito.vercel.app
```

### C. Test in Locale

```bash
npm start
```

Vai su Telegram e invia `/start` al tuo bot.
Dovrebbe rispondere! 🎉

**Per fermare:** `Ctrl+C`

---

## 🌐 PASSO 3: Deploy Bot 24/7

Il bot deve essere sempre attivo. Hai 3 opzioni:

### Opzione A: Railway.app (CONSIGLIATO - Gratis)

1. Vai su [railway.app](https://railway.app)
2. Sign up con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Seleziona `casa-torpe-bot`
5. Click sul progetto → Variables
6. Aggiungi le 3 variabili:
   - `TELEGRAM_BOT_TOKEN`
   - `OWNER_CHAT_ID`
   - `WEBSITE_URL`
7. Deploy automatico!

### Opzione B: Render.com (Alternativa gratis)

1. Vai su [render.com](https://render.com)
2. Sign up con GitHub
3. "New +" → "Background Worker"
4. Connetti repository `casa-torpe-bot`
5. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Environment → Aggiungi le 3 variabili
7. "Create Web Service"

### Opzione C: VPS (Più controllo, ma richiede server)

Se hai un VPS (DigitalOcean, Hetzner, ecc.):

```bash
# Connettiti al server
ssh user@your-server.com

# Installa Node.js (se non presente)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Carica i file del bot
scp -r casa-torpe-bot/ user@your-server.com:/home/user/

# Sul server
cd casa-torpe-bot
npm install

# Installa PM2 per gestire il bot
npm install -g pm2

# Avvia bot
pm2 start bot.js --name casa-torpe-bot

# Configura avvio automatico
pm2 startup
pm2 save

# Comandi utili:
pm2 status              # Verifica stato
pm2 logs                # Visualizza log
pm2 restart casa-torpe-bot  # Riavvia
pm2 stop casa-torpe-bot     # Ferma
```

---

## ✅ PASSO 4: Verifica che Tutto Funzioni

### Test Sito Web:

1. Apri il sito su Vercel
2. Naviga tra le sezioni
3. Controlla il calendario
4. Compila il form di contatto
5. Verifica di ricevere il messaggio su Telegram

### Test Bot:

1. Apri Telegram
2. Cerca il tuo bot
3. Invia `/start`
4. Prova tutti i comandi:
   - `/disponibilita`
   - `/prezzi`
   - `/info`
   - `/posizione`
   - `/contatti`
5. Invia un messaggio libero
6. Verifica di ricevere la notifica

---

## 🎨 PASSO 5: Personalizzazioni

### A. Cambia Immagini del Sito

1. Prepara 4-6 foto dell'appartamento (formato JPG, max 2MB)
2. Crea cartella `/public/images/` in `casa-torpe`
3. Carica le foto
4. Modifica `src/App.jsx`:

```javascript
const images = [
  '/images/foto1.jpg',
  '/images/foto2.jpg',
  '/images/foto3.jpg',
  '/images/foto4.jpg',
];
```

### B. Aggiorna Contatti

Modifica `src/App.jsx` cerca:
- `+39 123 456 7890` → Il tuo telefono
- `info@casatorpe.it` → La tua email

### C. Aggiorna Descrizioni

Personalizza i testi nel file `src/App.jsx`:
- Descrizione appartamento
- Caratteristiche
- Servizi inclusi
- Informazioni zona

### D. Personalizza Bot

Modifica `casa-torpe-bot/bot.js`:
- Tariffe in `/prezzi`
- Informazioni in `/info`
- Contatti in `/contatti`

### E. Dopo le modifiche:

```bash
# Sito web
cd casa-torpe
git add .
git commit -m "Personalizzazioni"
git push

# Vercel farà automaticamente il deploy!

# Bot (se su VPS)
pm2 restart casa-torpe-bot

# Bot (se su Railway/Render)
# Fai commit e push, deploy automatico!
```

---

## 🔧 PASSO 6: Configurazione Google Calendar (Opzionale)

### Setup Google Calendar API:

1. Vai su [console.cloud.google.com](https://console.cloud.google.com)
2. Crea nuovo progetto
3. Abilita "Google Calendar API"
4. Crea credenziali → API Key
5. Restrizioni:
   - Application restrictions: HTTP referrers
   - Website restrictions: `*.vercel.app/*`
   - API restrictions: Google Calendar API

### Aggiungi su Vercel:

Environment Variables:
```
VITE_GOOGLE_CALENDAR_API_KEY=la_tua_api_key
VITE_GOOGLE_CALENDAR_ID=il_tuo_calendar_id
```

### Codice per integrare (in `src/App.jsx`):

```javascript
// Nell'useEffect per caricare date prenotate
useEffect(() => {
  const fetchBookedDates = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
    const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
    
    if (!apiKey || !calendarId) return;
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${new Date().toISOString()}`
      );
      const data = await response.json();
      
      const dates = [];
      data.items?.forEach(event => {
        // Processa gli eventi e aggiungi alle date prenotate
      });
      
      setBookedDates(dates);
    } catch (error) {
      console.error('Errore caricamento calendario:', error);
    }
  };
  
  fetchBookedDates();
}, []);
```

---

## 📊 Monitoraggio

### Vercel:
- Dashboard → Progetto → Analytics
- Vedi visite, performance, errori

### Bot Telegram:
- Railway/Render: Dashboard → Logs
- VPS: `pm2 logs casa-torpe-bot`

---

## 🆘 Risoluzione Problemi

### Sito non si vede:
1. Verifica deploy su Vercel (deve essere "Ready")
2. Controlla errori in Vercel → Deployments → Build Logs

### Form non invia:
1. Verifica variabili d'ambiente su Vercel
2. Apri Console browser (F12) per vedere errori
3. Verifica TOKEN e CHAT_ID corretti

### Bot non risponde:
1. Verifica che sia in esecuzione (Railway/Render dashboard o `pm2 status`)
2. Controlla i logs
3. Invia `/start` per inizializzare

### Bot riceve messaggi ma non notifica:
- Verifica OWNER_CHAT_ID sia corretto
- Prova a inviare `/start` al bot come owner

---

## 🎉 Fatto!

Ora hai:
✅ Sito web professionale online
✅ Bot Telegram funzionante 24/7
✅ Form di contatto integrato
✅ Calendario disponibilità

## 📞 Prossimi Passi

1. Condividi il link del sito
2. Condividi il link del bot Telegram
3. Testa tutto con amici/famiglia
4. Inizia a ricevere prenotazioni! 🎊

---

**Domande?** Scrivimi!
