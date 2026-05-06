import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    if (isOpen) {
      // Quand on ferme, supprimer la conversation
      setMessages([]);
      setInput('');
    }
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simuler le temps de réponse
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(input);
      const botMsg = { from: 'bot', text: response, time: new Date() };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    
    // Congés
    if (msg.includes('conge') || msg.includes('congé') || msg.includes('vacation')) {
      return 'Pour demander un congé :\n\n📅 Allez dans Congés > Demander un Congé\n\nChoisissez le type : Annuel, Maladie ou Maternité';
    } 
    // Salaire / Bulletin de paie
    else if (msg.includes('salaire') || msg.includes('paie') || msg.includes('bulletin') || msg.includes('net')) {
      return 'Pour voir votre bulletin de paie :\n\n💰 Documents Administratifs > Bulletin de Paie\n\nVous pouvez télécharger vos bulletins mensuels';
    }
    // Réclamations
    else if (msg.includes('reclamation') || msg.includes('réclamation') || msg.includes('plainte')) {
      return 'Pour soumettre une réclamation :\n\n📝 Réclamations > Soumettre une Réclamation\n\nDécrivez votre problème et nous traiterons votre demande';
    }
    // Inventaire / Matériels
    else if (msg.includes('inventaire') || msg.includes('matériel') || msg.includes('materiel') || msg.includes('pc') || msg.includes('téléphone')) {
      return 'Pour les matériels :\n\n💻 Inventaire > Mes Matériels\n\nVous pouvez voir vos équipements assignés';
    }
    // Profil
    else if (msg.includes('profil') || msg.includes('modifier') || msg.includes('information')) {
      return 'Pour modifier votre profil :\n\n👤 Mon Profil\n\nVous pouvez mettre à jour vos informations personnelles et professionnelles';
    }
    // Documents
    else if (msg.includes('document') || msg.includes('attestation') || msg.includes('contrat') || msg.includes('certificat')) {
      return 'Documents disponibles :\n\n📄 Bulletin de Paie\n📄 Attestation de Travail\n📄 Contrat de Travail\n📄 Certificat Médical\n\nAllez dans Documents Administratifs';
    }
    // Hello / Bonjour
    else if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello') || msg.includes('hi')) {
      return 'Bonjour ! 👋\n\nJe suis là pour vous aider. Posez-moi une question sur les congés, la paie, les réclamations, etc.';
    }
    // Merci
    else if (msg.includes('merci') || msg.includes('thanks')) {
      return 'De rien ! 😊\n\nN\'hésitez pas si vous avez d\'autres questions !';
    }
    // Aide
    else if (msg.includes('aide') || msg.includes('help') || msg.includes('quoi')) {
      return 'Je peux vous aider pour :\n\n📅 - Les congés\n💰 - Le salaire / Bulletin de paie\n📝 - Les réclamations\n💻 - Les matériels\n👤 - Votre profil\n📄 - Les documents\n\nTapez votre question !';
    }
    // Par défaut
    else {
      return 'Désolé, je n\'ai pas bien compris 🤔\n\nEssayez de poser une question sur : les congés, la paie, les réclamations, les matériels, ou votre profil';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    'Comment demander un congés ?',
    'Voir mon bulletin de paie',
    'Soumettre une réclamation',
    'Mes matériels'
  ];

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => sendMessage(), 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Bouton flottant */}
      <div className="chatbot-button" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>SmartHR Assistant</div>
                <small style={{ opacity: 0.8 }}>En ligne</small>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>✕</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <span style={{ fontSize: '40px' }}>👋</span>
                <h3>Bonjour !</h3>
                <p>Je suis SmartHR Assistant</p>
                <p style={{ fontSize: '13px', color: '#666' }}>Comment puis-je vous aider ?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.from}`}>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{formatTime(msg.time)}</div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies - Toujours visibles */}
          <div className="quick-replies">
            {quickReplies.map((reply, index) => (
              <button 
                key={index} 
                onClick={() => handleQuickReply(reply)}
                className="quick-reply-btn"
              >
                {reply}
              </button>
            ))}
          </div>
          
          {/* Zone de saisie - TOUJOURS VISIBLE */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre question..."
              autoFocus
            />
            <button onClick={sendMessage} className="send-btn">➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;