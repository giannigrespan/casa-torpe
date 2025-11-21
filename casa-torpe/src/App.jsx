import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Wifi, Car, Waves, Mountain, Phone, Mail, MessageCircle, Star, Users, Bed, Bath, ChevronLeft, ChevronRight, Send, Check, AlertTriangle } from 'lucide-react';

const App = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    dataArrivo: '',
    dataPartenza: '',
    ospiti: '2',
    messaggio: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Immagini placeholder (sostituisci con le tue foto reali)
  const images = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop'
  ];

  // Helper per aggiungere giorni a una data
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Carica date prenotate da Google Calendar
  useEffect(() => {
    const fetchBookedDates = async () => {
      // NOTA: In un progetto Vite reale, usa import.meta.env.VITE_...
      // Qui usiamo stringhe vuote per evitare errori di compilazione nell'anteprima
      const apiKey = ""; // import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
      const calendarId = "30b4ce93b122922faa6a2d31336dca98611c0790fdd3732491f40593b14f2557@group.calendar.google.com"; // import.meta.env.VITE_GOOGLE_CALENDAR_ID
      
      // Controllo specifico per capire quale variabile manca
      if (!apiKey || !calendarId) {
        console.warn(`⚠️ Google Calendar non configurato.`);
        
        // ATTIVA DEMO MODE: Mostra date finte per testare la UI
        setIsDemoMode(true);
        const today = new Date();
        setBookedDates([
          addDays(today, 2).toISOString().split('T')[0],
          addDays(today, 3).toISOString().split('T')[0],
          addDays(today, 10).toISOString().split('T')[0],
          addDays(today, 11).toISOString().split('T')[0],
          addDays(today, 12).toISOString().split('T')[0],
        ]);
        return;
      }
      
      try {
        const now = new Date().toISOString();
        // Nota: singleEvents=true espande gli eventi ricorrenti
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now}&maxResults=100&singleEvents=true&orderBy=startTime`
        );
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Errore caricamento calendario');
        }
        
        const data = await response.json();
        const dates = [];
        
        data.items?.forEach(event => {
          // Supporta sia eventi "tutto il giorno" (start.date) che orari specifici (start.dateTime)
          const startStr = event.start?.date || event.start?.dateTime;
          const endStr = event.end?.date || event.end?.dateTime;

          if (startStr) {
            const startDate = new Date(startStr);
            const endDate = endStr ? new Date(endStr) : startDate;
            
            // Se è un evento orario nello stesso giorno, consideralo occupato
            if (startDate.toDateString() === endDate.toDateString()) {
               dates.push(startDate.toISOString().split('T')[0]);
            } else {
              // Loop attraverso i giorni
              for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                if (!dates.includes(dateStr)) {
                  dates.push(dateStr);
                }
              }
            }
          }
        });
        
        setBookedDates(dates);
        setIsDemoMode(false);
      } catch (error) {
        console.error('Errore Google Calendar API:', error);
        setIsDemoMode(true); // Fallback visuale in caso di errore API
      }
    };
    
    fetchBookedDates();
    const interval = setInterval(fetchBookedDates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // NOTA: In produzione usare import.meta.env...
    const telegramBotToken = ""; // import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    const chatId = ""; // import.meta.env.VITE_TELEGRAM_CHAT_ID

    // Se non ci sono token telegram, simula solo l'invio
    if (!telegramBotToken || !chatId) {
      console.warn("Telegram Token mancante - Simulazione invio");
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
      return;
    }
    
    const message = `
🏠 *Nuova Richiesta Prenotazione*

👤 *Nome:* ${formData.nome}
📧 *Email:* ${formData.email}
📱 *Telefono:* ${formData.telefono}
📅 *Check-in:* ${formData.dataArrivo}
📅 *Check-out:* ${formData.dataPartenza}
👥 *Ospiti:* ${formData.ospiti}

💬 *Messaggio:*
${formData.messaggio}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          nome: '', email: '', telefono: '', dataArrivo: '', 
          dataPartenza: '', ospiti: '2', messaggio: ''
        });
      }, 5000);
    } catch (error) {
      console.error('Errore invio messaggio:', error);
      alert('Errore nell\'invio. Riprova o contattaci direttamente.');
    }
  };

  // Navigazione Calendario sicura (senza mutazione diretta)
  const changeMonth = (offset) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBooked = (date) => {
    // Format YYYY-MM-DD locale coerente
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return bookedDates.includes(dateStr);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedMonth);
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isBooked = isDateBooked(date);
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      
      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200
            ${isBooked 
              ? 'bg-red-100 text-red-800 font-medium cursor-not-allowed border border-red-200' 
              : isPast 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'bg-green-50 text-green-700 font-medium hover:bg-green-100 hover:shadow-sm cursor-pointer border border-green-100'}`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Modalità Demo: Calendario non connesso (Date simulate)</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} 
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-lg capitalize text-gray-800">
            {selectedMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-xs uppercase tracking-wider text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        
        <div className="flex gap-4 text-sm mt-6 border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-100 rounded"></div>
            <span className="text-gray-600">Disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Prenotato</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 tracking-tight">Casa Vacanze Torpè</h1>
              <p className="text-xs font-medium text-blue-500 uppercase tracking-wide">Sardegna Orientale</p>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#home" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#appartamento" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Appartamento</a>
              <a href="#calendario" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Disponibilità</a>
              <a href="#contatti" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contatti</a>
            </nav>
            {/* Mobile menu button placeholder */}
            <button className="md:hidden p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section con Galleria */}
      <section id="home" className="relative h-[600px] overflow-hidden group">
        <div className="absolute inset-0 transition-transform duration-700 ease-out">
          <img 
            src={images[currentImageIndex]} 
            alt="Appartamento Torpè"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">Benvenuti a Torpè</h2>
            <p className="text-xl md:text-2xl mb-10 font-light opacity-90">Scopri l'autentica bellezza della Sardegna tra mare e montagna</p>
            <a href="#contatti" className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
              Prenota il tuo Soggiorno
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
          <ChevronRight className="w-8 h-8" />
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </section>

      {/* Appartamento Section */}
      <section id="appartamento" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">La Struttura</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Il Tuo Rifugio in Sardegna</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Recentemente ristrutturato, il nostro appartamento unisce il comfort moderno all'ospitalità tradizionale. 
              Situato in una posizione strategica per esplorare sia le spiagge incontaminate che l'entroterra selvaggio.
            </p>
          </div>
          
          <div className="grid md:grid-cols-12 gap-12 items-start">
            {/* Left Column: Features */}
            <div className="md:col-span-7 space-y-8">
              <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Caratteristiche Principali
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {[
                    { icon: Users, label: "4-6 Ospiti", desc: "Ideale per famiglie" },
                    { icon: Bed, label: "2 Camere", desc: "Matrimoniale + Doppia" },
                    { icon: Bath, label: "1 Bagno", desc: "Doccia spaziosa" },
                    { icon: Wifi, label: "WiFi Fibra", desc: "Connessione gratuita" },
                    { icon: Car, label: "Parcheggio", desc: "Privato incluso" },
                    { icon: Waves, label: "Climatizzato", desc: "In ogni stanza" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">{item.label}</span>
                        <span className="text-xs text-gray-500">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="prose prose-blue text-gray-600">
                <p>
                  L'appartamento dispone di una cucina completamente attrezzata, un ampio soggiorno luminoso e una terrazza panoramica dove godersi le serate estive. Forniamo biancheria da letto e da bagno, oltre a tutto il necessario per cucinare.
                </p>
              </div>
            </div>
            
            {/* Right Column: Highlight Card */}
            <div className="md:col-span-5 bg-gray-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">Perché sceglierci?</h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Posizione Strategica</h4>
                      <p className="text-gray-400 text-sm">15 minuti da Posada, 25 minuti da San Teodoro.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mountain className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Tranquillità</h4>
                      <p className="text-gray-400 text-sm">Lontano dal caos turistico, ma vicino a tutto.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Supporto H24</h4>
                      <p className="text-gray-400 text-sm">Assistenza continua tramite WhatsApp o Telegram.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendario Disponibilità */}
      <section id="calendario" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifica Disponibilità</h2>
            <p className="text-gray-600">Le date in <span className="text-green-600 font-semibold">verde</span> sono libere per la prenotazione</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                {renderCalendar()}
              </div>
              <div className="md:col-span-2 bg-blue-50 rounded-2xl p-6 flex flex-col justify-center">
                <h4 className="font-bold text-blue-900 mb-4 text-lg">Pronto a partire?</h4>
                <p className="text-sm text-blue-800 mb-6">
                  Seleziona le tue date preferite e compila il modulo sottostante per bloccare il prezzo.
                </p>
                <a href="#contatti" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg">
                  Richiedi Preventivo
                </a>
                <div className="mt-6 pt-6 border-t border-blue-100 text-xs text-blue-600 text-center">
                  * Cancellazione gratuita fino a 30 giorni prima
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Contatti */}
      <section id="contatti" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900 to-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              
              {/* Contact Info Side */}
              <div className="p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Contattaci</h2>
                  <p className="text-blue-200 mb-10">Siamo a tua disposizione per qualsiasi informazione.</p>
                  
                  <div className="space-y-8">
                    <a href="tel:+391234567890" className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-blue-300 uppercase tracking-wide block">Chiamaci</span>
                        <span className="text-lg font-semibold">+39 123 456 7890</span>
                      </div>
                    </a>
                    
                    <a href="mailto:info@casatorpe.it" className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-blue-300 uppercase tracking-wide block">Scrivici</span>
                        <span className="text-lg font-semibold">info@casatorpe.it</span>
                      </div>
                    </a>

                    <a href={`https://t.me/CasaTorpeBot`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-blue-300 uppercase tracking-wide block">Telegram</span>
                        <span className="text-lg font-semibold">Chatta con noi</span>
                      </div>
                    </a>
                  </div>
                </div>
                
                <div className="mt-12 relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                    <MapPin className="w-6 h-6 mb-3 text-blue-400" />
                    <p className="text-sm leading-relaxed text-blue-100">
                      Via Nazionale, Torpè (NU)<br />
                      Sardegna, Italia
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="bg-white p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Invia una richiesta</h3>
                
                {formSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Messaggio Inviato!</h4>
                    <p className="text-gray-500">Grazie per averci contattato. Ti risponderemo al più presto.</p>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="mt-8 text-blue-600 font-semibold hover:text-blue-800"
                    >
                      Invia un'altra richiesta
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Nome</label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Mario Rossi"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Telefono</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="+39..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="mario@email.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Arrivo</label>
                        <input
                          type="date"
                          name="dataArrivo"
                          value={formData.dataArrivo}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Partenza</label>
                        <input
                          type="date"
                          name="dataPartenza"
                          value={formData.dataPartenza}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Ospiti</label>
                        <select
                          name="ospiti"
                          value={formData.ospiti}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                          {[1,2,3,4,5,6].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Ospite' : 'Ospiti'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Messaggio</label>
                      <textarea
                        name="messaggio"
                        value={formData.messaggio}
                        onChange={handleFormChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Vorrei sapere se..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    >
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Invia Richiesta
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Casa Vacanze Torpè</h2>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Airbnb</a>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
