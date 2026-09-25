import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  Sparkles, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ChatMessage } from '../types';

export const CustomerSupport: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম! PRIME VAULT ZONE-এ আপনাকে স্বাগতম। ✨\nআমি আপনার AI শপিং সহকারী। আমাদের লাক্সারি পারফিউম, রয়্যাল আতর, ডেলিভারি, পেমেন্ট, কুপন বা ভল্ট প্রোডাক্ট সম্পর্কে যেকোনো প্রশ্ন করতে পারেন:',
      time: 'এখন',
      quickOptions: [
        '✨ সেরা লাক্সারি পারফিউম কোনগুলো?',
        '🚚 ডেলিভারি চার্জ ও সময় কত?',
        '💳 বিকাশ ও নগদে পেমেন্ট নিয়ম',
        '🎟️ ZEST20 কুপন কোড কীভাবে কাজ করে?',
        '🎁 ৳২০ সাইনআপ বোনাস কীভাবে কাজে লাগাব?',
        '🔄 রিটার্ন ও রিপ্লেসমেন্ট পলিসি কী?'
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen, isTyping]);

  // Intelligent Bengali Knowledge Base
  const getAIAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('ডেলিভারি') || q.includes('সময়') || q.includes('চার্জ') || q.includes('delivery')) {
      return `🚚 **PRIME VAULT ZONE ডেলিভারি সংক্রান্ত তথ্য:**\n• **ঢাকার ভিতরে:** চার্জ মাত্র ৳৬০, সময় ২৪ থেকে ৪৮ ঘণ্টা।\n• **ঢাকার বাইরে:** চার্জ ৳১২০, সময় ২ থেকে ৪ দিন।\n• ক্যাশ অন ডেলিভারিতে কোনো অগ্রিম চার্জ ছাড়াই পণ্য গ্রহণ করতে পারবেন!`;
    }

    if (q.includes('বিকাশ') || q.includes('নগদ') || q.includes('পেমেন্ট') || q.includes('bkash') || q.includes('nagad') || q.includes('trx')) {
      return `💳 **পেমেন্ট পদ্ধতি:**\n১. **ক্যাশ অন ডেলিভারি (COD):** পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন।\n২. **bKash & Nagad মার্চেন্ট / পার্সোনাল নম্বর:** 01883418309 নম্বরে Send Money বা Cash Out করে প্রাপ্ত TrxID চেকআউটে বসিয়ে দিন। কোনো সমস্যা হলে সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন।`;
    }

    if (q.includes('কুপন') || q.includes('zest20') || q.includes('coupon') || q.includes('ছাড়') || q.includes('discount')) {
      return `🎟️ **কুপন কোড অফার:**\nকার্ট পেজে কুপন বক্সে **ZEST20** লিখুন এবং Apply চাপুন। আপনি আপনার মোট পণ্যের মূল্যের উপর সাথে সাথে **১০% ফ্ল্যাট ডিসকাউন্ট** পেয়ে যাবেন!`;
    }

    if (q.includes('বোনাস') || q.includes('bonus') || q.includes('wallet') || q.includes('ওয়ালেট') || q.includes('২০')) {
      return `🎁 **৳২০ ওয়ালেট সাইনআপ বোনাস:**\nPRIME VAULT ZONE-এ প্রথমবার একাউন্ট খুললেই আপনার ওয়ালেটে সাথে সাথে ৳২০ বোনাস ক্রেডিট হয়ে যাবে। কার্ট ওপেন করে 'Apply ৳20 Wallet Bonus' বক্সে টিক চিহ্ন দিলেই আপনার বিল থেকে সরাসরি ৳২০ মাইনাস হয়ে যাবে!`;
    }

    if (q.includes('রিটার্ন') || q.includes('পরিবর্তন') || q.includes('পলিসি') || q.includes('return') || q.includes('refund')) {
      return `🔄 **৭ দিনের সহজ রিটার্ন পলিসি:**\nপণ্য হাতে পাওয়ার পর যদি কোনো ত্রুটি বা সমস্যা দেখতে পান, ডেলিভারির ৭ দিনের মধ্যে আমাদের হোয়াটসঅ্যাপে (01798-245190) ভিডিও বা ছবি পাঠিয়ে ফ্রি রিপ্লেসমেন্ট বা ফুল রিফান্ড নিতে পারবেন।`;
    }

    if (q.includes('ল্যাম্প') || q.includes('লাইট') || q.includes('lamp') || q.includes('glow') || q.includes('ক্যাপিবারা')) {
      return `💡 **সিলিকন গ্লো ল্যাম্প কালেকশন:**\nআমাদের **Capybara Tap-Dim Lamp** এবং **Lazy Duck Touch Lamp** বর্তমানে সর্বাধিক জনপ্রিয়! এগুলো ফুড-গ্রেড নরম সিলিকন দিয়ে তৈরি, স্পর্শ করলেই ডিম বা লাইট অন-অফ হয় এবং টাইপ-সি রিচার্জেবল ব্যাটারিতে চলে।`;
    }

    if (q.includes('আতর') || q.includes('পারফিউম') || q.includes('attar') || q.includes('perfume') || q.includes('সুগন্ধি')) {
      return `🌺 **প্রিমিয়াম আতর কালেকশন:**\nআমাদের সব আতর ১০০% অ্যালকোহল মুক্ত। বিশেষ করে **Royal White Musk** এবং **Golden Oudh Al-Amir** কাপড়ে ২৪ ঘণ্টার বেশি মিষ্টি ও মনোরম সুবাস বজায় রাখে।`;
    }

    if (q.includes('নোটবুক') || q.includes('খাতা') || q.includes('notebook') || q.includes('journal')) {
      return `📓 **নিয়ন ও হলোগ্রাফিক নোটবুক:**\n১২০ GSM এর প্রিমিয়াম ব্লিডপ্রুফ পেপারের 'Cyberpunk Neon Edge Dot-Grid' ও 'Astral Constellation' জার্নালগুলো আপনার ডায়েরি বা নোট লেখার অভিজ্ঞতা অনন্য করে তুলবে!`;
    }

    if (q.includes('খেলনা') || q.includes('ব্রিক') || q.includes('brick') || q.includes('lego') || q.includes('টয়')) {
      return `🧱 **ব্রিকস টয় কিট:**\nআমাদের মেকা রোবট, চেরি ব্লসম বনসাই এবং টোকিও রামেন বার মিনি মডেলগুলো অত্যন্ত নিখুঁত পার্টস ও এলইডি লাইট সহ আসে—উপহার বা ডেকোরেশনের জন্য দারুণ!`;
    }

    return `ধন্যবাদ আপনার মেসেজের জন্য! 😊\nআমরা সর্বদা সেরা মানের পণ্য ও দ্রুততম হোম ডেলিভারি দিতে প্রতিশ্রুতিবদ্ধ।\nআরও বিস্তারিত বা সরাসরি প্রতিনিধির সাথে কথা বলতে নিচের **WhatsApp** বাটনে ক্লিক করতে পারেন অথবা 01798-245190 এ কল করতে পারেন।`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // AI typing delay simulation
    setTimeout(() => {
      const responseText = getAIAnswer(messageText);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Buttons Stack - Bottom Right */}
      <div 
        id="floating-support-bar"
        className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-2.5"
      >
        {/* Social channels (collapsed/open or elegant vertical stack) */}
        <div className="flex flex-col gap-2.5 items-end">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/8801883418309"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_0_16px_rgba(37,211,102,0.6),0_0_24px_rgba(0,242,254,0.3)] hover:shadow-[0_0_24px_rgba(37,211,102,0.85),0_0_35px_rgba(0,242,254,0.5)] border border-[#25D366]/50 hover:border-[#25D366] hover:scale-110 active:scale-95 transition-all group relative"
            aria-label="WhatsApp Support"
            title="Chat on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"></i>
            <span className="absolute right-14 px-2.5 py-1 bg-slate-900/90 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none shadow-xl">
              WhatsApp Support
            </span>
          </a>

          {/* Telegram Button */}
          <a
            href="https://t.me/+8801883418309"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#0088cc] hover:bg-[#007bb8] text-white flex items-center justify-center shadow-[0_0_16px_rgba(0,136,204,0.65),0_0_24px_rgba(0,242,254,0.35)] hover:shadow-[0_0_24px_rgba(0,136,204,0.9),0_0_35px_rgba(0,242,254,0.6)] border border-[#0088cc]/50 hover:border-[#00f2fe] hover:scale-110 active:scale-95 transition-all group relative"
            aria-label="Telegram Support"
            title="Chat on Telegram"
          >
            <i className="fa-brands fa-telegram text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"></i>
            <span className="absolute right-14 px-2.5 py-1 bg-slate-900/90 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none shadow-xl">
              Telegram Support
            </span>
          </a>
        </div>

        {/* Primary AI Assistant Floating Trigger */}
        <button
          id="open-ai-chat-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-xs shadow-md transition-all group cursor-pointer active:scale-95"
          aria-label="Open AI Shop Assistant"
        >
          <div className="relative">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 border-2 border-[#4F46E5] rounded-full" />
          </div>
          <span className="tracking-wide">AI চ্যাট সহকারী</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        </button>
      </div>

      {/* --- INTERACTIVE AI CHAT MODAL --- */}
      {isChatOpen && (
        <div 
          id="ai-chat-modal"
          className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-96 max-w-[400px] max-h-[580px] h-[520px] flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden animate-slideUp"
        >
          {/* Chat Header */}
          <div className="p-3.5 bg-[#0F172A] text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Bot className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F172A] rounded-full" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  PRIME VAULT ZONE AI
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    বাংলা
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  অনলাইন • সার্বক্ষণিক সহায়তা
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F9FAFB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4F46E5] text-white rounded-tr-none shadow-2xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>

                {/* Quick Option Suggestion Chips */}
                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.quickOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(opt)}
                        className="text-[10px] text-left px-2.5 py-1.5 rounded-md bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-[#4F46E5] transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-white border border-slate-200 w-16">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="বাংলা বা ইংরেজিতে প্রশ্ন লিখুন..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
            />
            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
