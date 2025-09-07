import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCanDismiss, setPopupCanDismiss] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with ParseIt today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupTimeoutRef = useRef<number | null>(null);
  const dismissTimeoutRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show popup after 5 seconds if chat is closed
  useEffect(() => {
    if (!isOpen) {
      popupTimeoutRef.current = setTimeout(() => {
        setShowPopup(true);
        // Allow dismissal after 1 second
        dismissTimeoutRef.current = setTimeout(() => {
          setPopupCanDismiss(true);
        }, 1000);
      }, 2000);
    } else {
      setShowPopup(false);
      setPopupCanDismiss(false);
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    }

    return () => {
      if (popupTimeoutRef.current) {
        clearTimeout(popupTimeoutRef.current);
      }
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Hide popup only when user clicks outside the chatbot area (and dismissal is allowed)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatbotElement = document.querySelector('[data-chatbot-container]');
      if (showPopup && popupCanDismiss && chatbotElement && !chatbotElement.contains(event.target as Node)) {
        setShowPopup(false);
        setPopupCanDismiss(false);
      }
    };

    if (showPopup && popupCanDismiss) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPopup, popupCanDismiss]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: generateAIResponse(inputValue.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('parse') || input.includes('tokenizer')) {
      return "ParseIt uses a context-free grammar to tokenize arithmetic expressions. It breaks down input strings into tokens like numbers, operators, and parentheses, then validates them against grammar rules.";
    }
    
    if (input.includes('grammar') || input.includes('cfg')) {
      return "The context-free grammar defines the structure of valid arithmetic expressions. It includes productions for expressions, terms, factors, and numbers, ensuring proper syntactic validation.";
    }
    
    if (input.includes('validation') || input.includes('valid')) {
      return "ParseIt validates expressions by checking if the token sequence can be derived from the start symbol using the grammar productions. Invalid expressions are rejected with detailed error messages.";
    }
    
    if (input.includes('derivation') || input.includes('parse tree')) {
      return "For valid expressions, ParseIt shows the derivation process - how the expression is built step by step from the grammar rules, revealing the syntactic structure.";
    }
    
    if (input.includes('help') || input.includes('how')) {
      return "I can help you understand ParseIt's features: CFG-based tokenization, syntactic validation, and derivation output. Try asking about specific concepts or visit the playground to experiment!";
    }
    
    if (input.includes('playground') || input.includes('demo')) {
      return "The playground lets you test ParseIt with your own arithmetic expressions. You can see real-time tokenization, validation, and derivation results. Click 'Init Parse()' to get started!";
    }
    
    return "I'm here to help you understand ParseIt! You can ask me about tokenization, grammar validation, derivations, or how to use the playground. What would you like to know?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" data-chatbot-container>
      {/* Need Help Popup */}
      {showPopup && !isOpen && (
        <div className="absolute bottom-16 right-0 animate-fade-in-up animate">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg relative w-80 cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200"
            onClick={() => {
              setShowPopup(false);
              setIsOpen(true);
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>
                Need help with ParseIt?
              </span>
            </div>
            <p className="text-xs mt-1 opacity-90">
              Ask me about tokenization, grammar validation, or derivations!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
                setPopupCanDismiss(false);
              }}
              className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Arrow pointing to chat button */}
            <div className="absolute bottom-0 right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500 transform translate-y-full"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
          {/* Header */}
          <div className="bg-gray-700 px-4 py-3 border-b border-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium" style={{ fontFamily: 'DM Mono, monospace' }}>
                AI Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {message.text}
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-600 p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about ParseIt..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPopup(false);
          setPopupCanDismiss(false);
        }}
        className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative z-10"
        style={{
          boxShadow: '0 6px 12px rgba(20, 185, 132, 0.35)',
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Help Text - only show on hover when popup is not visible */}
      {!isOpen && !showPopup && (
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-5">
          <span className="text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
            Need help?
          </span>
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Pulse animation for button when popup is shown */}
      {showPopup && !isOpen && (
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping z-0"></div>
      )}
    </div>
  );
};

export default ChatBot;
