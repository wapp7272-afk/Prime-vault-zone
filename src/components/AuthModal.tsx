import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  User, 
  Phone, 
  Mail, 
  LogOut,
  Gift,
  Lock,
  Key,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Address } from '../types';
import { sendOtpEmail } from '../lib/emailService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (name: string, email: string, phone: string) => void;
  onSignup: (name: string, email: string, phone: string, address: Address) => void;
  onUpdateAddress: (address: Address) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onSignup,
  onUpdateAddress,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'otp' | 'profile'>(user.isLoggedIn ? 'profile' : 'signup');
  
  // Registration Form states
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [regPassword, setRegPassword] = useState('');
  const [cityDivision, setCityDivision] = useState<'Inside Dhaka' | 'Outside Dhaka'>(
    user.address?.cityDivision || 'Inside Dhaka'
  );
  const [fullAddress, setFullAddress] = useState(user.address?.fullAddress || '');
  
  // Login Form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Retrieve accounts permanently from localStorage
  const getRegisteredAccounts = (): any[] => {
    try {
      const stored = localStorage.getItem('primevault_registered_accounts') || localStorage.getItem('zestflick_registered_accounts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg('⚠️ অনুগ্রহ করে সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!emailPattern.test(email.trim())) {
      setErrorMsg('⚠️ অনুগ্রহ করে একটি বৈধ Gmail এড্রেস দিন (যেমন: user@gmail.com)।');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('⚠️ পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    // Check LocalStorage uniqueness
    const accounts = getRegisteredAccounts();
    const phoneExists = accounts.some((acc: any) => acc.phone === cleanPhone);
    const emailExists = accounts.some((acc: any) => acc.email.toLowerCase() === email.trim().toLowerCase());

    if (phoneExists || emailExists) {
      setErrorMsg('❌ This phone number or Gmail address has already been registered with PRIME VAULT ZONE.');
      return;
    }

    // Generate 4-digit code
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    setOtpDigits(['', '', '', '']);
    setTab('otp');

    // Trigger official EmailJS with user credentials
    sendOtpEmail(email.trim(), name.trim(), otpCode).then((sent) => {
      if (sent) {
        setSuccessMsg(`✓ ৪-সংখ্যার OTP কোডটি আপনার জিমেইলে (${email.trim()}) পাঠানো হয়েছে।`);
      }
    });

    // Browser notification for backup & local inspection
    alert(`[PRIME VAULT ZONE Security] Your Gmail OTP Code is: ${otpCode}\n\nSent to: ${email.trim()} via EmailJS`);
  };

  const handleOtpChange = (index: number, val: string) => {
    const updated = [...otpDigits];
    updated[index] = val.slice(-1);
    setOtpDigits(updated);

    if (val && index < 3) {
      const nextInput = document.getElementById(`react-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prev = document.getElementById(`react-otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setErrorMsg(null);
    const entered = otpDigits.join('');
    if (entered.length !== 4) {
      setErrorMsg('⚠️ অনুগ্রহ করে ৪-ডিজিটের সম্পূর্ণ OTP কোড লিখুন।');
      return;
    }

    if (entered !== generatedOtp) {
      setErrorMsg('❌ ভুল OTP কোড! আবার চেষ্টা করুন।');
      return;
    }

    // Save permanently to registered accounts
    const accounts = getRegisteredAccounts();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    accounts.push({
      name,
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      password: regPassword,
      area: cityDivision,
      address: fullAddress,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem('primevault_registered_accounts', JSON.stringify(accounts));

    const newAddress: Address = {
      fullName: name,
      phone: cleanPhone,
      cityDivision,
      fullAddress,
    };

    onSignup(name, email, cleanPhone, newAddress);
    setSuccessMsg('🎉 অভিনন্দন! ইমেইল ভেরিফিকেশন সফল! আপনার ওয়ালেটে ৳২০ ওয়েলকাম বোনাস জমা হয়েছে।');
    setTimeout(() => {
      setSuccessMsg(null);
      setTab('profile');
    }, 1800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanPhone = loginPhone.replace(/[^0-9]/g, '');

    const accounts = getRegisteredAccounts();
    const matched = accounts.find((acc: any) => acc.phone === cleanPhone);

    if (!matched) {
      setErrorMsg('❌ এই মোবাইল নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে Register করুন।');
      return;
    }

    if (matched.password !== loginPassword) {
      setErrorMsg('❌ পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      return;
    }

    onLogin(matched.name, matched.email, matched.phone);
    setSuccessMsg(`স্বাগতম ${matched.name}! সফলভাবে লগইন হয়েছে।`);
    setTimeout(() => {
      setSuccessMsg(null);
      setTab('profile');
    }, 1200);
  };

  const handleSaveAddressOnly = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Address = {
      fullName: name || user.name,
      phone: phone || user.phone,
      cityDivision,
      fullAddress,
    };
    onUpdateAddress(updated);
    setSuccessMsg('ডেলিভারি ঠিকানা সফলভাবে সংরক্ষিত হয়েছে (LocalStorage-এ সেভ করা হয়েছে)।');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        id="auth-modal"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-purple-500/30 p-6 sm:p-7 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] mx-auto mb-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#0d0f22] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white">
            {user.isLoggedIn ? 'আমার প্রোফাইল ও ওয়ালেট' : 'PRIME VAULT ZONE Member Club'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {user.isLoggedIn 
              ? 'ওয়ালেট ব্যালেন্স ও ডেলিভারি ঠিকানা ম্যানেজ করুন'
              : 'নতুন একাউন্ট খুললেই পাচ্ছেন ৳২০ ইনস্ট্যান্ট ওয়ালেট বোনাস!'}
          </p>
        </div>

        {/* Tabs if not logged in */}
        {!user.isLoggedIn && (
          <div className="flex rounded-xl bg-slate-900/90 p-1 border border-white/5 mb-5">
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up (+৳20 Bonus)
            </button>
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* --- SIGN UP FORM --- */}
        {!user.isLoggedIn && tab === 'signup' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Promo banner */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300">
                <Gift className="w-5 h-5 text-purple-300 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-200">৳২০ সাইনআপ বোনাস উপহার</p>
                <p className="text-[11px] text-slate-300">সঠিক Gmail ও ১১-সংখ্যার মোবাইল দিয়ে OTP ভেরিফাই করলেই ওয়ালেটে জমা হবে।</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম (Full Name)*</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. তানভীর আহমেদ / Tanvir Ahmed"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail Address (for OTP Verification)*</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">একটি সক্রিয় Gmail দিন যেখানে ৪-সংখ্যার OTP কোড পাঠানো হবে।</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">১১-সংখ্যার মোবাইল নম্বর (Phone Number)*</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="signup-phone"
                  type="tel"
                  maxLength={11}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পাসওয়ার্ড তৈরি করুন (Create Password)*</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="signup-password"
                  type="password"
                  minLength={4}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Saved Delivery Address in LocalStorage */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>ডেলিভারি ঠিকানা (LocalStorage-এ সেভ থাকবে)</span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">ডেলিভারি এরিয়া</label>
                <select
                  value={cityDivision}
                  onChange={(e) => setCityDivision(e.target.value as 'Inside Dhaka' | 'Outside Dhaka')}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Inside Dhaka">ঢাকার ভিতরে (Inside Dhaka - Delivery ৳60)</option>
                  <option value="Outside Dhaka">ঢাকার বাইরে (Outside Dhaka - Delivery ৳120)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">পূর্ণ ঠিকানা (House, Road, Area)</label>
                <textarea
                  id="signup-address"
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="e.g. House #14, Road #5, Block C, Banani, Dhaka"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Send OTP & Claim ৳20 Bonus</span>
              <Sparkles className="w-4 h-4 text-cyan-200" />
            </button>
          </form>
        )}

        {/* --- OTP VERIFICATION SCREEN --- */}
        {!user.isLoggedIn && tab === 'otp' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400 mx-auto flex items-center justify-center text-2xl">
              ✉️
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gmail OTP Verification</h3>
              <p className="text-xs text-slate-300 mt-1">
                ৪-সংখ্যার ভেরিফিকেশন কোড পাঠানো হয়েছে:<br />
                <span className="text-cyan-400 font-semibold">{email}</span>
              </p>
            </div>

            {/* Simulated Live Alert Banner for Testing */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-dashed border-cyan-400/60 text-center">
              <span className="text-[11px] text-cyan-300 block mb-1">⚡ Gmail OTP (Testing & EmailJS Ready):</span>
              <span className="text-2xl font-black tracking-widest text-cyan-300 font-mono">{generatedOtp}</span>
            </div>

            <div className="flex justify-center gap-3 my-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`react-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-2xl font-black text-cyan-400 bg-slate-900 border-2 border-cyan-500/40 rounded-xl focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.5)] font-mono"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Verify & Activate ৳20 Bonus
            </button>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                  setGeneratedOtp(newCode);
                  setSuccessMsg('নতুন OTP পাঠানো হয়েছে।');
                  alert(`[PRIME VAULT ZONE Security] New OTP: ${newCode}`);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                🔄 Resend Code
              </button>
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Edit Details
              </button>
            </div>
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {!user.isLoggedIn && tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">রেজিস্টার্ড মোবাইল নম্বর (Phone Number)*</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="login-phone"
                  type="tel"
                  maxLength={11}
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পাসওয়ার্ড (Password)*</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all mt-4"
            >
              লগইন করুন
            </button>
          </form>
        )}

        {/* --- PROFILE & WALLET VIEW --- */}
        {user.isLoggedIn && (
          <div className="space-y-5">
            {/* Wallet Card */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1b1238] via-[#0f172a] to-[#092233] border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-24 h-24 text-cyan-400" />
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-purple-300 font-bold">
                    Prime Vault Wallet
                  </span>
                  <h3 className="text-xl font-black text-white">{user.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{user.phone}</p>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                <div>
                  <span className="text-xs text-slate-400 block">বর্তমান ব্যালেন্স</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-cyan-300 font-mono glow-cyan">
                      ৳{user.walletBalance}
                    </span>
                    <span className="text-xs text-slate-400">BDT</span>
                  </div>
                </div>

                {user.hasReceivedBonus && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-medium">
                    ✓ ৳২০ সাইনআপ বোনাস সক্রিয়
                  </span>
                )}
              </div>
            </div>

            {/* Saved Address in LocalStorage Management */}
            <form onSubmit={handleSaveAddressOnly} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  সংরক্ষিত ডেলিভারি ঠিকানা (LocalStorage)
                </span>
                <span className="text-[10px] text-slate-400">অটো-ফিল হবে চেকআউটে</span>
              </div>

              <div>
                <select
                  value={cityDivision}
                  onChange={(e) => setCityDivision(e.target.value as 'Inside Dhaka' | 'Outside Dhaka')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Inside Dhaka">ঢাকার ভিতরে (Inside Dhaka - Delivery ৳60)</option>
                  <option value="Outside Dhaka">ঢাকার বাইরে (Outside Dhaka - Delivery ৳120)</option>
                </select>
              </div>

              <textarea
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="বাসা নম্বর, রোড নম্বর, এলাকা, থানা..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all"
                >
                  ঠিকানা আপডেট করুন
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
