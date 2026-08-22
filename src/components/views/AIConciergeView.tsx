import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Lightbulb, 
  MapPin, 
  Compass, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { Trip, Currency } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIConciergeViewProps {
  trip: Trip;
  currency: Currency;
}

export const AIConciergeView: React.FC<AIConciergeViewProps> = ({ trip, currency }) => {
  const tripTitle = trip?.title || 'Your Journey';
  const cities = trip?.cities || [];
  const travelerNames = trip?.travelerNames || ['Traveler'];
  const styles = trip?.styles || ['Culture & Food'];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm your Globe Trotter AI Co-Pilot for **${tripTitle}**. 

I have your full multi-city context loaded:
- **Cities**: ${cities.map((c) => `${c.name} (${c.stayNights}n)`).join(', ') || 'Your destinations'}
- **Pace**: ${trip?.pace || 'Balanced'}
- **Travelers**: ${trip?.travelersCount || 1} (${travelerNames.join(', ')})
- **Styles**: ${styles.join(', ')}

How can I help refine your journey today? Ask me for secret viewpoints, authentic food pairings, train transfer tips, or daily schedule adjustments!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `Best sunset cocktail spot with a view in ${cities[0]?.name || 'the first city'}?`,
    `How should we optimize our train transfer from ${cities[0]?.name || 'City 1'} to ${cities[1]?.name || 'City 2'}?`,
    `Recommend a hidden local food market with authentic street eats in ${cities[1]?.name || cities[0]?.name || 'the destination'}`,
    `What are the essential cultural etiquette rules & tipping customs for our itinerary?`,
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          tripContext: {
            title: tripTitle,
            cities: cities.map((c) => `${c.name}, ${c.country} (${c.stayNights} nights)`),
            pace: trip?.pace || 'Balanced',
            styles: styles,
            budgetUSD: trip?.budgetTotalUSD || 3000,
            travelers: travelerNames,
          },
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || "I've reviewed your itinerary and have several tailored recommendations for your trip!";

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackAiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your ${trip?.pace || 'balanced'} route through ${cities.map((c) => c.name).join(' & ') || 'your destination'}:

1. **Optimal Timing**: Start your morning visits early (around 8:30 AM) to beat midday crowds at major sights.
2. **Transit Efficiency**: Rail connections between these hubs are fast and scenic—be sure to validate tickets before boarding.
3. **Local Flavor**: Explore side streets at least 3 blocks away from main plazas for authentic regional dining at half the price!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>AI Travel Concierge & Co-Pilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.7 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">Context-aware expert recommendations for {tripTitle}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-1.5 shadow-md ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 text-[10px] opacity-75">
                  <span className="font-bold">{isUser ? 'You' : 'Globe Trotter AI'}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="hover:text-white transition"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Co-Pilot is researching recommendations across your itinerary...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[280px]">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
      >
        <input
          id="ai-concierge-input"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask about restaurants, secret sights, or transit between ${trip.cities.map((c) => c.name).join(' & ')}...`}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        <button
          id="send-ai-message-btn"
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/25 flex items-center gap-1.5 transition disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
