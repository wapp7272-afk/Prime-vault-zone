import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Check,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Coins,
  History
} from 'lucide-react';
import { UserProfile, Address, WalletTransaction } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (name: string, email: string, phone: string, isPhoneVerified?: boolean, authProvider?: 'google' | 'phone' | 'email', avatar?: string) => void;
  onSignup: (name: string, email: string, phone: string, address: Address, isPhoneVerified?: boolean, authProvider?: 'google' | 'phone' | 'email', avatar?: string) => void;
  onVerifyPhoneSuccess?: (phone: string) => void;
  onUpdateAddress: (address: Address) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onSignup,
  onVerifyPhoneSuccess,
  onUpdateAddress,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'phone_verify' | 'otp' | 'profile'>(
    user.isLoggedIn ? 'profile' : 'signup'
  );

  // Form states
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [regPassword, setRegPassword] = useState('');
  const [authProvider, setAuthProvider] = useState<'google' | 'phone' | 'email'>('google');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(user.avatar);

  const [cityDivision, setCityDivision] = useState<'Inside Dhaka' | 'Outside Dhaka'>(
    user.address?.cityDivision || 'Inside Dhaka'
  );
  const [fullAddress, setFullAddress] = useState(user.address?.fullAddress || '');

  // Login Form states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Phone Verification Engine states
  const [verificationPhone, setVerificationPhone] = useState(user.phone || '');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [smsToast, setSmsToast] = useState<{ code: string; phone: string } | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // Google OAuth Dialog Modal Simulator
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer for resend
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (user.isLoggedIn) {
      setTab('profile');
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      if (user.address) {
        setCityDivision(user.address.cityDivision || 'Inside Dhaka');
        setFullAddress(user.address.fullAddress || '');
      }
    }
  }, [user]);

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

  // Trigger Phone Verification Code Generation
  const triggerSendOtp = (targetPhone: string, userName: string) => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg('⚠️ অনুগ্রহ করে সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return false;
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);
    setOtpDigits(['', '', '', '']);
    setVerificationPhone(cleanPhone);
    setResendTimer(60);
    setTab('otp');
    setErrorMsg(null);

    // Show instant, non-blocking simulated SMS notification banner
    setSmsToast({ code: otpCode, phone: cleanPhone });
    setTimeout(() => {
      // Focus on first input
      document.getElementById('phone-otp-0')?.focus();
    }, 150);

    return true;
  };

  // Google Sign-In Handler
  const handleGoogleSignInClick = () => {
    setErrorMsg(null);
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = (googleUser: { name: string; email: string; avatar: string }) => {
    setShowGoogleChooser(false);
    setName(googleUser.name);
    setEmail(googleUser.email);
    setUserAvatar(googleUser.avatar);
    setAuthProvider('google');

    // Check if account already registered and verified
    const accounts = getRegisteredAccounts();
    const existing = accounts.find((a: any) => a.email.toLowerCase() === googleUser.email.toLowerCase());

    if (existing && existing.isPhoneVerified) {
      // Already verified, log in directly!
      onLogin(existing.name, existing.email, existing.phone, true, 'google', googleUser.avatar);
      setSuccessMsg(`✓ Welcome back, ${existing.name}! Logged in with Google.`);
      setTimeout(() => {
        setSuccessMsg(null);
        setTab('profile');
      }, 800);
    } else {
      // Needs phone verification to claim the ৳20 bonus!
      setTab('phone_verify');
      setSuccessMsg(`✓ Google Authenticated: ${googleUser.email}. Please verify mobile number to activate ৳20 bonus.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // Direct Sign Up Submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg('⚠️ অনুগ্রহ করে সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('⚠️ অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('⚠️ পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    // Check LocalStorage uniqueness
    const accounts = getRegisteredAccounts();
    const phoneExists = accounts.some((acc: any) => acc.phone === cleanPhone);
    if (phoneExists) {
      setErrorMsg('❌ This phone number has already been registered. Please Log In.');
      return;
    }

    triggerSendOtp(cleanPhone, name.trim());
  };

  const handleOtpChange = (index: number, val: string) => {
    const updated = [...otpDigits];
    updated[index] = val.slice(-1);
    setOtpDigits(updated);

    if (val && index < 3) {
      const nextInput = document.getElementById(`phone-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prev = document.getElementById(`phone-otp-${index - 1}`);
      prev?.focus();
    }
  };

  // Verification Completion & ৳20 Bonus Award
  const handleVerifyOtp = () => {
    setErrorMsg(null);
    const entered = otpDigits.join('');
    if (entered.length !== 4) {
      setErrorMsg('⚠️ অনুগ্রহ করে ৪-ডিজিটের সম্পূর্ণ OTP কোড লিখুন।');
      return;
    }

    if (entered !== generatedOtp) {
      setErrorMsg('❌ ভুল OTP কোড! আবার সঠিক ৪-ডিজিট কোড লিখুন।');
      return;
    }

    // Success! Save to registered accounts
    const accounts = getRegisteredAccounts();
    const cleanPhone = verificationPhone.replace(/[^0-9]/g, '');

    const initialWalletHistory: WalletTransaction[] = [
      {
        id: `tx-welcome-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: 20,
        type: 'credit',
        description: 'Welcome Sign-up & Phone Verification Reward'
      }
    ];

    const accountData = {
      name: name || 'Prime Member',
      email: email.trim().toLowerCase() || `${cleanPhone}@primevault.zone`,
      phone: cleanPhone,
      password: regPassword || 'google-auth-verified',
      isPhoneVerified: true,
      authProvider: authProvider,
      avatar: userAvatar,
      area: cityDivision,
      address: {
        fullName: name || 'Prime Member',
        phone: cleanPhone,
        cityDivision,
        fullAddress,
      },
      registeredAt: new Date().toISOString(),
      walletBalance: 20,
      hasReceivedBonus: true,
      walletHistory: initialWalletHistory
    };

    const existingIndex = accounts.findIndex((a: any) => a.phone === cleanPhone || (email && a.email === email.toLowerCase()));
    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...accountData };
    } else {
      accounts.push(accountData);
    }
    localStorage.setItem('primevault_registered_accounts', JSON.stringify(accounts));

    const newAddress: Address = {
      fullName: name || 'Prime Member',
      phone: cleanPhone,
      cityDivision,
      fullAddress,
    };

    onSignup(name || 'Prime Member', email, cleanPhone, newAddress, true, authProvider, userAvatar);

    if (onVerifyPhoneSuccess) {
      onVerifyPhoneSuccess(cleanPhone);
    }

    setSmsToast(null);
    setSuccessMsg('🎉 অভিনন্দন! মোবাইল নম্বর সফলভাবে ভেরিফাইড! আপনার ওয়ালেটে ৳২০ ওয়েলকাম বোনাস জমা হয়েছে।');
    setTimeout(() => {
      setSuccessMsg(null);
      setTab('profile');
    }, 1800);
  };

  // Traditional Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanPhone = loginPhone.replace(/[^0-9]/g, '');

    const accounts = getRegisteredAccounts();
    const matched = accounts.find((acc: any) => acc.phone === cleanPhone);

    if (!matched) {
      setErrorMsg('❌ এই মোবাইল নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে Sign Up করুন।');
      return;
    }

    if (matched.password !== loginPassword && matched.password !== 'google-auth-verified') {
      setErrorMsg('❌ পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      return;
    }

    onLogin(matched.name, matched.email, matched.phone, matched.isPhoneVerified ?? true, matched.authProvider || 'phone');
    setSuccessMsg(`স্বাগতম ${matched.name}! সফলভাবে লগইন হয়েছে।`);
    setTimeout(() => {
      setSuccessMsg(null);
      setTab('profile');
    }, 1000);
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
    setSuccessMsg('✓ ডেলিভারি ঠিকানা সফলভাবে সংরক্ষিত হয়েছে (LocalStorage-এ সেভ করা হয়েছে)।');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="auth-modal"
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#0d1020] rounded-2xl border border-purple-500/40 p-6 sm:p-7 shadow-2xl text-[#f8fafc]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
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
              ? 'লাইভ ওয়ালেট ব্যালেন্স ও ডেলিভারি ঠিকানা ম্যানেজ করুন'
              : 'Google Sign-In ও মোবাইল ভেরিফিকেশনে পাচ্ছেন ৳২০ ইনস্ট্যান্ট ওয়ালেট বোনাস!'}
          </p>
        </div>

        {/* Simulated Live SMS Alert Toast Banner */}
        {smsToast && (
          <div className="mb-4 p-3.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-cyan-200 text-xs shadow-lg flex items-start gap-2.5 animate-slideDown">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                  💬 SMS Delivery Simulation (Instant)
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Banglalink / Grameenphone</span>
              </div>
              <p className="text-[11px] text-cyan-100 mt-0.5">
                PrimeVault Verification Code for <strong className="font-mono text-white">{smsToast.phone}</strong> is:
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-900 border border-cyan-400 font-mono font-black text-white text-base tracking-widest">
                  {smsToast.code}
                </span>
                <span className="text-[10px] text-slate-300">Valid for 5 minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs (Only if not logged in) */}
        {!user.isLoggedIn && tab !== 'otp' && tab !== 'phone_verify' && (
          <div className="flex rounded-xl bg-slate-900/90 p-1 border border-white/5 mb-5">
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up (+৳20 Bonus)
            </button>
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. GOOGLE SIGN-IN HERO BUTTON */}
        {/* ========================================================================= */}
        {!user.isLoggedIn && (tab === 'signup' || tab === 'login') && (
          <div className="mb-5 space-y-3">
            <button
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleSignInClick}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#1f2937] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 border border-gray-200 cursor-pointer active:scale-98"
            >
              {/* Google G Multi-Color SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (1-Click Login)</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                +৳20
              </span>
            </button>

            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <div className="flex-1 h-px bg-slate-800" />
              <span>or sign in with phone</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE ACCOUNT CHOOSER POPUP DIALOG SIMULATOR */}
        {/* ========================================================================= */}
        {showGoogleChooser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-sm bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-scaleUp">
              {/* Google Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-gray-700">Sign in with Google</span>
                </div>
                <button
                  onClick={() => setShowGoogleChooser(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-gray-600 font-medium">
                  Choose an account to continue to <strong className="text-gray-900">PRIME VAULT ZONE</strong>
                </p>

                {/* Primary Google Account Choice */}
                <button
                  onClick={() =>
                    handleSelectGoogleAccount({
                      name: 'Tanvir Ahmed',
                      email: 'wapp7272@gmail.com',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    T
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">Tanvir Ahmed</p>
                    <p className="text-[11px] text-gray-500 font-mono truncate">wapp7272@gmail.com</p>
                  </div>
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Default
                  </span>
                </button>

                {/* Secondary Account Choice */}
                <button
                  onClick={() =>
                    handleSelectGoogleAccount({
                      name: 'Rahim Sheikh',
                      email: 'customer.vault@gmail.com',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">Rahim Sheikh</p>
                    <p className="text-[11px] text-gray-500 font-mono truncate">customer.vault@gmail.com</p>
                  </div>
                </button>

                {/* Option 3: Custom Google Account */}
                {!showCustomGoogleInput ? (
                  <button
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="w-full p-2.5 rounded-xl border border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50/50 transition-colors flex items-center gap-3 text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-lg shrink-0">
                      +
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800">Use another Google account</p>
                      <p className="text-[11px] text-gray-500">Sign in with any custom Gmail ID</p>
                    </div>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-gray-50 border border-purple-200 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900">Custom Google Account</span>
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleInput(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name (e.g. Mahfuz Rahman)"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="your.email@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white text-gray-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!customGoogleEmail.trim()}
                      onClick={() => {
                        const emailInput = customGoogleEmail.trim().toLowerCase();
                        const finalEmail = emailInput.includes('@') ? emailInput : `${emailInput}@gmail.com`;
                        const finalName = customGoogleName.trim() || finalEmail.split('@')[0];
                        handleSelectGoogleAccount({
                          name: finalName,
                          email: finalEmail,
                          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=5B21B6&color=fff`
                        });
                      }}
                      className="w-full py-2 rounded-lg bg-[#5B21B6] hover:bg-[#4C1D95] disabled:bg-gray-300 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Sign In with this Google Account
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-500">
                    To continue, Google will share your name, email address, and language preference with Prime Vault Zone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SIGN UP FORM */}
        {/* ========================================================================= */}
        {!user.isLoggedIn && tab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
            {/* Promo banner */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-900/60 text-purple-300">
                <Gift className="w-5 h-5 text-purple-300 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-200">৳২০ সাইনআপ বোনাস উপহার</p>
                <p className="text-[11px] text-slate-300">১১-সংখ্যার মোবাইল নম্বর দিয়ে SMS OTP ভেরিফাই করলেই ওয়ালেটে জমা হবে।</p>
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
                  placeholder="e.g. Tanvir Ahmed / তানভীর আহমেদ"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ১১-সংখ্যার মোবাইল নম্বর (Phone Number for OTP)*
              </label>
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
              <p className="text-[10px] text-slate-400 mt-1">
                ভেরিফিকেশন কোডসহ ইনস্ট্যান্ট SMS পাঠানো হবে।
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পাসওয়ার্ড তৈরি করুন (Password)*</label>
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

            <button
              id="signup-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>Send Phone OTP & Claim ৳20 Bonus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 3. STEP 2: GOOGLE PHONE NUMBER VERIFICATION ENGINE */}
        {/* ========================================================================= */}
        {!user.isLoggedIn && tab === 'phone_verify' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-3">
              {userAvatar ? (
                <img src={userAvatar} alt="Google Avatar" className="w-10 h-10 rounded-full border border-purple-300" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center">
                  G
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                  ✓ Google Account Verified
                </span>
                <p className="text-xs font-bold text-white truncate">{name}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{email}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Smartphone className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Step 2: Bangladesh Mobile Verification</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                আপনার একাউন্ট সুরক্ষা নিশ্চিত করতে এবং <strong className="text-amber-300">৳২০ ওয়ালেট বোনাস</strong> একটিভ করতে আপনার ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন:
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">মোবাইল নম্বর (01XXXXXXXXX)*</label>
                <input
                  id="google-verification-phone"
                  type="tel"
                  maxLength={11}
                  value={verificationPhone}
                  onChange={(e) => setVerificationPhone(e.target.value)}
                  placeholder="e.g. 01883418309"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={() => triggerSendOtp(verificationPhone, name)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send 4-Digit SMS Code</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. OTP INPUT SCREEN */}
        {/* ========================================================================= */}
        {!user.isLoggedIn && tab === 'otp' && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400 mx-auto flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mobile SMS OTP Verification</h3>
              <p className="text-xs text-slate-300 mt-1">
                ৪-সংখ্যার ভেরিফিকেশন কোড পাঠানো হয়েছে:<br />
                <span className="text-cyan-400 font-mono font-bold">{verificationPhone}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3 my-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`phone-otp-${idx}`}
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
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Verify Code & Activate ৳20 Bonus
            </button>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => triggerSendOtp(verificationPhone, name)}
                className={`text-xs flex items-center gap-1 cursor-pointer ${
                  resendTimer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTab(authProvider === 'google' ? 'phone_verify' : 'signup')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Edit Number
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. LOGIN FORM */}
        {/* ========================================================================= */}
        {!user.isLoggedIn && tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                রেজিস্টার্ড মোবাইল নম্বর (Phone Number)*
              </label>
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
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all mt-4 cursor-pointer"
            >
              লগইন করুন (Log In)
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 6. PROFILE & LIVE WALLET MANAGEMENT VIEW */}
        {/* ========================================================================= */}
        {user.isLoggedIn && (
          <div className="space-y-5">
            {/* Wallet Card */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1b1238] via-[#0f172a] to-[#092233] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-24 h-24 text-cyan-400" />
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-purple-300 font-bold">
                      Prime Vault Wallet
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{user.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{user.phone || user.email}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Coins className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                <div>
                  <span className="text-xs text-slate-400 block">বর্তমান লাইভ ওয়ালেট ব্যালেন্স</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-cyan-300 font-mono">
                      ৳{user.walletBalance}
                    </span>
                    <span className="text-xs text-slate-400">BDT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold inline-block">
                    ✓ চেকআউটে সরাসরি ব্যবহারযোগ্য
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    অর্ডার সামারিতে স্বয়ংক্রিয় ছাড় হবে
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Ledger / Transaction History */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Wallet Transaction Ledger</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {user.walletHistory?.length || 1} records
                </span>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {user.walletHistory && user.walletHistory.length > 0 ? (
                  user.walletHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white text-[11px]">{tx.description}</p>
                        <p className="text-[10px] text-slate-500">{tx.date}</p>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.type === 'credit' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white text-[11px]">৳২০ সাইনআপ ও ফোন ভেরিফিকেশন বোনাস</p>
                      <p className="text-[10px] text-slate-500">Welcome Reward Credit</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+৳20</span>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Address in LocalStorage Management */}
            <form onSubmit={handleSaveAddressOnly} className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  সংরক্ষিত ডেলিভারি ঠিকানা (LocalStorage)
                </span>
                <span className="text-[10px] text-slate-400">চেকআউটে অটো-ফিল হবে</span>
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
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ঠিকানা আপডেট করুন
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
