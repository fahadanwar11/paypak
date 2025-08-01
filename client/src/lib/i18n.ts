export const translations = {
  en: {
    // Common
    continue: "Continue",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Onboarding
    phoneTitle: "Enter your phone number",
    phoneSubtitle: "We'll send you a verification code to get started securely",
    phoneLabel: "Phone Number",
    phonePlaceholder: "301 2345678",
    sendOTP: "Send Verification Code",
    whyPhoneTitle: "Why we need this",
    whyPhoneText: "Your phone number helps us verify your identity and secure your account. We're regulated by SBP and follow strict data protection standards.",
    
    // OTP
    otpTitle: "Enter verification code",
    otpSubtitle: "We sent a code to",
    otpResend: "Resend code",
    otpVerify: "Verify & Continue",
    
    // Dashboard
    welcomeBack: "Welcome back",
    totalBalance: "Total Balance",
    quickActions: "Quick Actions",
    addMoney: "Add Money",
    send: "Send",
    exchange: "Exchange",
    help: "Help",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    
    // Send Money
    sendMoney: "Send Money",
    whereAreSending: "Where are you sending?",
    international: "International",
    domestic: "Domestic",
    selectCountry: "Select country",
    recentRecipients: "Recent recipients",
    addNew: "Add New",
    
    // Settings
    settings: "Settings",
    languageAndRegion: "Language & Region",
    language: "Language",
    region: "Region",
    security: "Security",
    
    // Trust indicators
    regulatedBy: "Regulated by SBP",
    proofOfReserves: "Proof of Reserves ✓",
  },
  ur: {
    // Common
    continue: "جاری رکھیں",
    cancel: "منسوخ",
    back: "واپس",
    next: "اگلا",
    confirm: "تصدیق",
    loading: "لوڈ ہو رہا ہے...",
    error: "خرابی",
    success: "کامیابی",
    
    // Onboarding
    phoneTitle: "اپنا فون نمبر درج کریں",
    phoneSubtitle: "ہم آپ کو محفوظ طریقے سے شروع کرنے کے لیے ایک تصدیقی کوڈ بھیجیں گے",
    phoneLabel: "فون نمبر",
    phonePlaceholder: "301 2345678",
    sendOTP: "تصدیقی کوڈ بھیجیں",
    whyPhoneTitle: "ہمیں اس کی ضرورت کیوں ہے",
    whyPhoneText: "آپ کا فون نمبر آپ کی شناخت کی تصدیق اور اکاؤنٹ کو محفوظ بنانے میں مدد کرتا ہے۔ ہم SBP کے ذریعے منظم ہیں اور سخت ڈیٹا تحفظ کے معیارات پر عمل کرتے ہیں۔",
    
    // OTP
    otpTitle: "تصدیقی کوڈ درج کریں",
    otpSubtitle: "ہم نے کوڈ بھیجا ہے",
    otpResend: "کوڈ دوبارہ بھیجیں",
    otpVerify: "تصدیق اور جاری رکھیں",
    
    // Dashboard
    welcomeBack: "واپس خوش آمدید",
    totalBalance: "کل بیلنس",
    quickActions: "فوری اعمال",
    addMoney: "پیسے شامل کریں",
    send: "بھیجیں",
    exchange: "تبادلہ",
    help: "مدد",
    recentActivity: "حالیہ سرگرمی",
    viewAll: "سب دیکھیں",
    
    // Send Money
    sendMoney: "پیسے بھیجیں",
    whereAreSending: "آپ کہاں بھیج رہے ہیں؟",
    international: "بین الاقوامی",
    domestic: "ملکی",
    selectCountry: "ملک منتخب کریں",
    recentRecipients: "حالیہ وصول کنندگان",
    addNew: "نیا شامل کریں",
    
    // Settings
    settings: "ترتیبات",
    languageAndRegion: "زبان اور علاقہ",
    language: "زبان",
    region: "علاقہ",
    security: "سیکیورٹی",
    
    // Trust indicators
    regulatedBy: "SBP کے ذریعے منظم",
    proofOfReserves: "ذخائر کا ثبوت ✓",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function getTranslation(key: TranslationKey, lang: Language = "en"): string {
  return translations[lang][key] || translations.en[key] || key;
}
