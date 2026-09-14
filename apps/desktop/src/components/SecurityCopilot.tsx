import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGroq } from '../services/groq';
import { Fact, Finding } from '@alcatraz/contracts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function SecurityCopilot({ 
  isOpen, 
  onClose, 
  facts, 
  findings 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  facts: Fact[];
  findings: Finding[];
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Alcatraz Security Copilot, powered by Groq and Llama-3. I have reviewed the deterministic engine\'s output. Ask me to explain any findings or summarize the risk.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Build dynamic system prompt injected with the Engine's current state
      const systemPrompt = `
You are the "Alcatraz Security Copilot", an elite cybersecurity AI assistant running on Snapdragon architecture.
You help analysts understand the output of the Alcatraz Deterministic Rules Engine.
Keep your answers brief, professional, and directly related to the facts and findings provided.

CURRENT ENGINE STATE:
Extracted Facts: ${JSON.stringify(facts.map(f => ({ attr: f.attribute, val: f.value })))}
Flagged Findings: ${JSON.stringify(findings.map(f => ({ type: f.type, explanation: f.explanation })))}
      `;

      // Convert our message format to Groq's format
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: userMsg });

      const reply = await chatWithGroq(chatHistory, systemPrompt);
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error communicating with Groq API. Please check your network or API key.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] max-h-[80vh] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 z-[60] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 p-4 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-2 font-bold">
              <Bot size={20} />
              Alcatraz Copilot
              <span className="bg-blue-800 text-[10px] px-2 py-0.5 rounded-full border border-blue-500 uppercase tracking-wider">Llama 3 (Groq)</span>
            </div>
            <button onClick={onClose} className="hover:bg-blue-500/50 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                )}
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <ShieldAlert size={16} />
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-300 dark:border-gray-700"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the findings..."
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
