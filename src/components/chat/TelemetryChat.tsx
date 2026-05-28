'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';

interface TelemetryChatProps {
  telemetryContext?: string;
}

export const TelemetryChat: React.FC<TelemetryChatProps> = ({ telemetryContext = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      telemetryContext,
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm the Purdue Sim Racing AI. Ready to analyze your telemetry. What would you like to know about your latest lap?"
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Club AI Assistant</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Telemetry Engineer (Gemini)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${m.role === 'user' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400'}
                `}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`
                  p-3 rounded-2xl text-sm leading-relaxed
                  ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}
                `}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-2xl text-sm bg-slate-800 text-slate-400 rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-slate-800/50 border-t border-slate-700"
          >
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your telemetry..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white p-2 rounded-xl transition shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full" />
        </button>
      )}
    </div>
  );
};
