#!/bin/bash

echo "🏠 Setup Casa Vacanze Torpè"
echo "================================"
echo ""

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo "${YELLOW}⚠️  Node.js non trovato. Installalo da: https://nodejs.org${NC}"
    exit 1
fi

echo "${GREEN}✓${NC} Node.js trovato: $(node --version)"

# Installa dipendenze
echo ""
echo "${BLUE}📦 Installazione dipendenze...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo "${GREEN}✓${NC} Dipendenze installate"
else
    echo "${YELLOW}⚠️  Errore installazione dipendenze${NC}"
    exit 1
fi

# Crea file .env se non esiste
if [ ! -f .env ]; then
    echo ""
    echo "${BLUE}🔧 Configurazione variabili d'ambiente...${NC}"
    cp .env.example .env
    echo "${YELLOW}⚠️  Configura il file .env con i tuoi dati${NC}"
    echo ""
    echo "Apri il file .env e inserisci:"
    echo "  - VITE_TELEGRAM_BOT_TOKEN"
    echo "  - VITE_TELEGRAM_CHAT_ID"
    echo "  - VITE_TELEGRAM_BOT_USERNAME"
fi

# Inizializza git se non esiste
if [ ! -d .git ]; then
    echo ""
    echo "${BLUE}📚 Inizializzazione Git...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Casa Vacanze Torpè"
    echo "${GREEN}✓${NC} Repository Git inizializzato"
    echo ""
    echo "Prossimi passi:"
    echo "1. Crea un repository su GitHub"
    echo "2. Esegui:"
    echo "   git remote add origin https://github.com/TUO_USERNAME/casa-torpe.git"
    echo "   git push -u origin main"
fi

echo ""
echo "${GREEN}✅ Setup completato!${NC}"
echo ""
echo "Comandi disponibili:"
echo "  ${BLUE}npm run dev${NC}      - Avvia server di sviluppo"
echo "  ${BLUE}npm run build${NC}    - Build per produzione"
echo "  ${BLUE}npm run preview${NC}  - Preview build produzione"
echo ""
echo "Deploy su Vercel:"
echo "  1. Vai su https://vercel.com"
echo "  2. Importa il repository GitHub"
echo "  3. Configura le variabili d'ambiente"
echo "  4. Deploy!"
echo ""
