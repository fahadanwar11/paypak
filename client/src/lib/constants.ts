export const CURRENCIES = {
  PKR: { name: "Pakistani Rupee", symbol: "₨", icon: "₨" },
  USDT: { name: "Tether USD", symbol: "USDT", icon: "U" },
  BTC: { name: "Bitcoin", symbol: "BTC", icon: "₿" },
  USD: { name: "US Dollar", symbol: "$", icon: "$" },
  GBP: { name: "British Pound", symbol: "£", icon: "£" },
  AED: { name: "UAE Dirham", symbol: "AED", icon: "د.إ" },
};

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", deliveryTime: "1-2 hours" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", deliveryTime: "2-4 hours" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", deliveryTime: "30 mins" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", deliveryTime: "1-3 hours" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", deliveryTime: "2-4 hours" },
];

export const TRANSACTION_TYPES = {
  SEND: "send",
  RECEIVE: "receive",
  EXCHANGE: "exchange",
  ADD_MONEY: "add_money",
} as const;

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const KYC_LEVELS = {
  BASIC: 0,
  ENHANCED: 1,
  PREMIUM: 2,
} as const;

export const FEES = {
  TRANSFER_FEE: 125, // PKR
  EXCHANGE_FEE_PERCENT: 0.5,
  NETWORK_FEE_USDT: 85, // PKR
  NETWORK_FEE_BTC: 150, // PKR
};

export const QUICK_AMOUNTS = [1000, 2500, 5000, 10000]; // PKR

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
];
