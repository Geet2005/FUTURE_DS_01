import { useState, useRef, useEffect } from "react";
import { ChatMessage, Customer, ChurnStats } from "../types";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  HelpCircle,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GeminiAnalystPanelProps {
  stats: ChurnStats;
  customers: Customer[];
}

export default function GeminiAnalystPanel({ stats, customers }: GeminiAnalystPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: `Hello! I am **Aura Churn Analyst**, your AI retention science companion.
      
I am grounded in your current active customer metrics (including your **${stats.totalCustomers} total accounts** and calculated **${stats.churnRate}% churn rate**).

Feel free to ask me queries about:
- Structural reasons driving early-tenure subscription fatigue.
- Tailored marketing strategies to retain Basic plan subscribers.
- How we clean raw CSV data using imputation averages.
- The mechanics of our Logistic Regression model.

Select one of the quick queries below to begin, or type a custom question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    {
      label: "Support Ticket Impact",
      prompt: "Why do customers with lots of support tickets churn so rapidly, and how can we address this?",
    },
    {
      label: "Basic Plan Retention",
      prompt: "Suggest a tailored retention campaign for our Basic plan subscribers to stop early cancellations.",
    },
    {
      label: "Clean Raw Data Info",
      prompt: "What is data clean imputation, and why is it crucial for customer churn models?",
    },
  ];

  // Self scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      // Assemble standard statistical database summary to ground Gemini
      const activeStats = customers.filter(c => c.churn === "No");
      const churnedStats = customers.filter(c => c.churn === "Yes");

      const yesAge = churnedStats.map(c => c.age);
      const noAge = activeStats.map(c => c.age);
      const avgAgeChurn = yesAge.length ? Math.round(yesAge.reduce((a, b) => a + b, 0) / yesAge.length) : 0;
      const avgAgeActive = noAge.length ? Math.round(noAge.reduce((a, b) => a + b, 0) / noAge.length) : 0;

      const subBreakdown = customers.reduce((acc: any, c) => {
        acc[c.subscriptionType] = (acc[c.subscriptionType] || 0) + 1;
        return acc;
      }, { Basic: 0, Pro: 0, Premium: 0 });

      const csvSnapshot = `
--- CUSTOMER DATABASE SNAPSHOT ---
- Total Ingested Cohort Size: ${stats.totalCustomers}
- Active Subscribers (Retained): ${stats.activeCustomers}
- Canceled Subscribers (Churned): ${stats.churnedCustomers}
- Calculated Base Churn Rate: ${stats.churnRate}%
- Average Satisfaction Level (1-5): ${stats.avgSatisfaction}
- Cumulative revenue lost due to churn: ₹${stats.revenueLost}
- Mean Age of Churned Users: ${avgAgeChurn} vs Active: ${avgAgeActive}
- Total Counts by Tier: Basic=${subBreakdown.Basic}, Pro=${subBreakdown.Pro}, Premium=${subBreakdown.Premium}
----------------------------------
`;

      const response = await fetch("/api/churn/ai-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvSnapshot,
          question: userPromptToGround(userText),
          chatHistory: messages.slice(-6), // last 6 messages
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI support agent.");
      }

      const resData = await response.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: resData.answer || "Blank explanation returned.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Sorry, I could not complete that analysis. Please make sure **GEMINI_API_KEY** is configured in AI Studio Secrets so Aura can run.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };  const userPromptToGround = (text: string) => {
    return text;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="gemini-chat-panel">
      {/* Sidebar quick suggestions and parameters */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-[#161b22] p-4 rounded-lg border border-gray-800 shadow-3xs">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wide">Quick Queries Suggestions</h4>
          </div>
          <p className="text-[11px] text-gray-200 mb-4 leading-normal font-bold">
            Select one of these formatted prompt blocks to instantly dispatch a grounded question to Aura:
          </p>
          <div className="flex flex-col gap-2.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                disabled={loading}
                className="w-full text-left text-xs p-3 font-bold text-gray-100 bg-[#0d1117] hover:bg-indigo-950/40 border border-gray-800 hover:border-indigo-550 hover:text-indigo-300 rounded-lg cursor-pointer transition-all"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context stats */}
        <div className="bg-[#0d1117] border border-gray-800 text-gray-200 p-4 rounded-lg shadow-3xs">
          <div className="flex items-center gap-1.5 mb-2.5 text-slate-200">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Active Grounding State</span>
          </div>
          <p className="text-[11.5px] text-gray-200 leading-normal mb-3 font-bold">
            The AI chatbot dynamically references your current dataset values and statistics to formulate highly exact SaaS insights.
          </p>
          <div className="space-y-1.5 text-[11px] font-mono font-bold">
            <div className="flex justify-between border-b border-gray-800/65 pb-1">
              <span>ACTIVE DATASET</span>
              <span className="font-extrabold text-[#e1e4e8]">{stats.totalCustomers} records</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/65 pb-1">
              <span>BASE CHURN RATE</span>
              <span className="font-extrabold text-rose-400">{stats.churnRate}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/65 pb-1">
              <span>AVG SATISFACTION</span>
              <span className="font-extrabold text-indigo-400">{stats.avgSatisfaction}/5.0</span>
            </div>
            <div className="flex justify-between">
              <span>MRR LOSS EXTENT</span>
              <span className="font-extrabold text-red-400">₹{stats.revenueLost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary chat workspace column */}
      <div className="lg:col-span-8 bg-[#161b22] rounded-lg border border-gray-800 shadow-sm flex flex-col md:h-[540px]" id="chat-workspace">
        {/* Messages feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[460px]">
          {messages.map((msg) => {
            const isAsst = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAsst ? "self-start" : "ml-auto flex-row-reverse"}`}
              >
                {/* Icon bubble */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-solid ${
                  isAsst ? "bg-indigo-950/40 border-indigo-900/60 text-indigo-400" : "bg-[#0d1117] border-gray-700 text-white"
                }`}>
                  {isAsst ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message text block */}
                <div className={`p-4 rounded-lg text-xs select-text leading-relaxed whitespace-pre-wrap font-bold ${
                  isAsst
                    ? "bg-[#0d1117] text-gray-100 border border-gray-800 rounded-tl-none"
                    : "bg-indigo-900/60 text-white border border-indigo-700/50 rounded-tr-none"
                }`}>
                  {/* Visual Markdown rendering fallback: replace asterisks with bold tags */}
                  {msg.content.split("\n").map((line, lidx) => {
                    // Quick check for bold headers
                    let formatted = line;
                    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                    return (
                      <p
                        key={lidx}
                        className="mb-1"
                        dangerouslySetInnerHTML={{ __html: formatted }}
                      />
                    );
                  })}
                  <span className={`block text-[8px] mt-1.5 text-right ${isAsst ? "text-[#8b949e]" : "text-indigo-200"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] self-start" id="chat-pending">
              <div className="h-8 w-8 rounded-full bg-[#0d1117] border border-gray-850 flex items-center justify-center text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              </div>
              <div className="p-3 bg-[#0d1117] text-gray-200 text-xs rounded-lg rounded-tl-none animate-pulse font-bold border border-gray-800">
                Aura Analyst is formulating retention diagnostics, mapping coefficients...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input send tray */}
        <div className="p-3 border-t border-gray-800 bg-[#0d1117]/60 flex gap-2.5 items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
            placeholder="Type subscription diagnostic questions or click suggestions..."
            disabled={loading}
            className="flex-1 bg-[#0d1117] border border-gray-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-500 font-bold"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={loading || !inputMessage.trim()}
            className="h-10 w-10 text-white bg-indigo-650 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer border border-indigo-700/40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
