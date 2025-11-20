import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Wifi, Car, Waves, Mountain, Phone, Mail, MessageCircle, Star, Users, Bed, Bath, ChevronLeft, ChevronRight, Send, Check } from 'lucide-react';

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

  // Immagini placeholder (sostituisci con le tue foto reali)
  const images = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop'
  ];

  // Carica date prenotate (da sostituire con chiamata API reale)
  useEffect(() => {
    // Qui integrerai l'API di Google Calendar
    const mockBookedDates = [
      '2024-12-24', '2024-12-25', '2024-12-26',
      '2025-01-01', '2025-01-02', '2025-01-03'
    ];
    setBookedDates(mockBookedDates);
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
    
    // Configurazione bot Telegram
    const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
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
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
          className={`h-10 flex items-center justify-center text-sm rounded-lg transition-colors
            ${isBooked ? 'bg-red-100 text-red-800 cursor-not-allowed' : 
              isPast ? 'text-gray-300 cursor-not-allowed' :
              'bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer'}`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))} 
                  className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-semibold text-lg">
            {selectedMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
                  className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-sm text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        <div className="flex gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span>Disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span>Prenotato</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Casa Vacanze Torpè</h1>
              <p className="text-sm text-gray-600">Il tuo angolo di paradiso in Sardegna</p>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#appartamento" className="text-gray-700 hover:text-blue-600 transition">Appartamento</a>
              <a href="#calendario" className="text-gray-700 hover:text-blue-600 transition">Disponibilità</a>
              <a href="#contatti" className="text-gray-700 hover:text-blue-600 transition">Contatti</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section con Galleria */}
      <section id="home" className="relative h-[600px] overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt="Appartamento Torpè"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-5xl font-bold mb-4">Benvenuti a Torpè</h2>
            <p className="text-xl mb-8">Scopri la bellezza della Sardegna orientale</p>
            <a href="#contatti" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition inline-block">
              Prenota Ora
            </a>
          </div>
        </div>
        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full transition">
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </section>

      {/* Appartamento Section */}
      <section id="appartamento" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Il Tuo Appartamento</h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-blue-900">Descrizione</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Immerso nel cuore della suggestiva Torpè, il nostro appartamento offre un'esperienza autentica 
              della Sardegna. A pochi minuti dalle spiagge cristalline di Posada e San Teodoro, potrai goderti 
              il perfetto equilibrio tra relax e avventura.
            </p>
            <p className="text-gray-700 leading-relaxed">
              L'appartamento è stato recentemente ristrutturato con gusto, combinando il fascino tradizionale 
              sardo con tutti i comfort moderni. Ideale per coppie, famiglie o gruppi di amici che cercano 
              un'esperienza autentica in Sardegna.
            </p>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-blue-900">Caratteristiche</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <span>4-6 Ospiti</span>
              </div>
              <div className="flex items-center gap-3">
                <Bed className="w-6 h-6 text-blue-600" />
                <span>2 Camere</span>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="w-6 h-6 text-blue-600" />
                <span>1 Bagno</span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-6 h-6 text-blue-600" />
                <span>WiFi Gratuito</span>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-blue-600" />
                <span>Parcheggio</span>
              </div>
              <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-blue-600" />
                <span>Vicino al Mare</span>
              </div>
            </div>
          </div>
        </div>

        {/* Servizi */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-6 text-center">Servizi Inclusi</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Wifi className="w-12 h-12 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">WiFi Veloce</h4>
              <p className="text-sm text-blue-100">Connessione internet ad alta velocità</p>
            </div>
            <div className="text-center">
              <Car className="w-12 h-12 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Parcheggio Privato</h4>
              <p className="text-sm text-blue-100">Posto auto riservato incluso</p>
            </div>
            <div className="text-center">
              <Mountain className="w-12 h-12 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Vista Panoramica</h4>
              <p className="text-sm text-blue-100">Terrazzo con vista mozzafiato</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendario Disponibilità */}
      <section id="calendario" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Verifica Disponibilità</h2>
          <p className="text-center text-gray-600 mb-12">Controlla le date disponibili per il tuo soggiorno</p>
          
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            {renderCalendar()}
          </div>
        </div>
      </section>

      {/* Zona e Attrazioni */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Scopri la Zona</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <Waves className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Spiagge</h3>
            <p className="text-gray-600">
              A 15 minuti dalle spiagge di Posada e a 25 minuti da San Teodoro, 
              potrai esplorare alcune delle coste più belle della Sardegna.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <Mountain className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Natura</h3>
            <p className="text-gray-600">
              Escursioni nel Parco Naturale, trekking e mountain bike tra paesaggi 
              mozzafiato e una natura incontaminata.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <Star className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Cultura</h3>
            <p className="text-gray-600">
              Visita i nuraghi, i borghi storici e scopri la ricca tradizione 
              gastronomica della Sardegna autentica.
            </p>
          </div>
        </div>
      </section>

      {/* Form Contatti */}
      <section id="contatti" className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Contattaci</h2>
          <p className="text-center text-blue-100 mb-12">
            Compila il form o scrivici su Telegram per maggiori informazioni
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-6">Richiedi Disponibilità</h3>
              
              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-green-800 mb-2">Messaggio Inviato!</h4>
                  <p className="text-green-700">Ti risponderemo al più presto tramite il nostro bot Telegram</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Check-in</label>
                      <input
                        type="date"
                        name="dataArrivo"
                        value={formData.dataArrivo}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Check-out</label>
                      <input
                        type="date"
                        name="dataPartenza"
                        value={formData.dataPartenza}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Numero Ospiti</label>
                    <select
                      name="ospiti"
                      value={formData.ospiti}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 ospite</option>
                      <option value="2">2 ospiti</option>
                      <option value="3">3 ospiti</option>
                      <option value="4">4 ospiti</option>
                      <option value="5">5 ospiti</option>
                      <option value="6">6 ospiti</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Messaggio</label>
                    <textarea
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleFormChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Raccontaci qualcosa sul tuo soggiorno..."
                    ></textarea>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Invia Richiesta
                  </button>
                </div>
              )}
            </div>
            
            {/* Info Contatti */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Informazioni di Contatto</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Telefono</h4>
                      <p className="text-blue-100">+39 123 456 7890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-blue-100">info@casatorpe.it</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Telegram Bot</h4>
                      <p className="text-blue-100 mb-2">Chatta con noi per info istantanee!</p>
                      <a 
                        href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'CasaTorpeBot'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Apri Telegram
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Posizione</h4>
                      <p className="text-blue-100">Torpè, Nuoro, Sardegna</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl">
                <h4 className="font-semibold mb-3">Come Raggiungerci</h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Aeroporto Olbia: 40 km (35 min)</li>
                  <li>• Porto Torres: 120 km</li>
                  <li>• Cagliari: 180 km</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 Casa Vacanze Torpè. Tutti i diritti riservati.</p>
          <p className="text-gray-400 text-sm">Realizzato con ❤️ in Sardegna</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
