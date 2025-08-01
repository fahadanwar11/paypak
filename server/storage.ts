import { type User, type InsertUser, type Transaction, type Balance, type Recipient, type ExchangeRate, type InsertTransaction, type InsertRecipient } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Balance operations
  getUserBalances(userId: string): Promise<Balance[]>;
  getBalance(userId: string, currency: string): Promise<Balance | undefined>;
  updateBalance(userId: string, currency: string, amount: string): Promise<Balance>;

  // Transaction operations
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined>;

  // Recipient operations
  getUserRecipients(userId: string): Promise<Recipient[]>;
  createRecipient(recipient: InsertRecipient & { userId: string }): Promise<Recipient>;

  // Exchange rate operations
  getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate | undefined>;
  updateExchangeRate(fromCurrency: string, toCurrency: string, rate: string): Promise<ExchangeRate>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private balances: Map<string, Balance>;
  private transactions: Map<string, Transaction>;
  private recipients: Map<string, Recipient>;
  private exchangeRates: Map<string, ExchangeRate>;

  constructor() {
    this.users = new Map();
    this.balances = new Map();
    this.transactions = new Map();
    this.recipients = new Map();
    this.exchangeRates = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize exchange rates
    const rates = [
      { from: "PKR", to: "USD", rate: "0.0035" },
      { from: "USD", to: "PKR", rate: "284.50" },
      { from: "PKR", to: "USDT", rate: "0.0035" },
      { from: "USDT", to: "PKR", rate: "284.10" },
      { from: "PKR", to: "BTC", rate: "0.0000001" },
      { from: "BTC", to: "PKR", rate: "12500000" },
      { from: "PKR", to: "GBP", rate: "0.0028" },
      { from: "GBP", to: "PKR", rate: "356.20" },
      { from: "PKR", to: "AED", rate: "0.0129" },
      { from: "AED", to: "PKR", rate: "77.45" },
    ];

    rates.forEach(rate => {
      const id = randomUUID();
      this.exchangeRates.set(id, {
        id,
        fromCurrency: rate.from,
        toCurrency: rate.to,
        rate: rate.rate,
        updatedAt: new Date(),
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.phoneNumber === phoneNumber,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      cnicNumber: insertUser.cnicNumber || null,
      kycLevel: 0,
      isVerified: false,
      preferredLanguage: insertUser.preferredLanguage || "en",
      createdAt: new Date(),
    };
    this.users.set(id, user);

    // Initialize default balances
    const currencies = ["PKR", "USDT", "BTC"];
    currencies.forEach(currency => {
      const balanceId = randomUUID();
      this.balances.set(balanceId, {
        id: balanceId,
        userId: id,
        currency,
        amount: currency === "PKR" ? "25000" : "0",
        updatedAt: new Date(),
      });
    });

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserBalances(userId: string): Promise<Balance[]> {
    return Array.from(this.balances.values()).filter(
      (balance) => balance.userId === userId,
    );
  }

  async getBalance(userId: string, currency: string): Promise<Balance | undefined> {
    return Array.from(this.balances.values()).find(
      (balance) => balance.userId === userId && balance.currency === currency,
    );
  }

  async updateBalance(userId: string, currency: string, amount: string): Promise<Balance> {
    const existing = await this.getBalance(userId, currency);
    if (existing) {
      existing.amount = amount;
      existing.updatedAt = new Date();
      this.balances.set(existing.id, existing);
      return existing;
    } else {
      const id = randomUUID();
      const balance: Balance = {
        id,
        userId,
        currency,
        amount,
        updatedAt: new Date(),
      };
      this.balances.set(id, balance);
      return balance;
    }
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createTransaction(transactionData: InsertTransaction & { userId: string }): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...transactionData,
      id,
      fromCurrency: transactionData.fromCurrency || null,
      toCurrency: transactionData.toCurrency || null,
      fromAmount: transactionData.fromAmount || null,
      toAmount: transactionData.toAmount || null,
      fee: transactionData.fee || null,
      recipientName: transactionData.recipientName || null,
      recipientCountry: transactionData.recipientCountry || null,
      exchangeRate: transactionData.exchangeRate || null,
      status: "pending",
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    transaction.status = status;
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserRecipients(userId: string): Promise<Recipient[]> {
    return Array.from(this.recipients.values()).filter(
      (recipient) => recipient.userId === userId,
    );
  }

  async createRecipient(recipientData: InsertRecipient & { userId: string }): Promise<Recipient> {
    const id = randomUUID();
    const recipient: Recipient = {
      ...recipientData,
      id,
      accountDetails: recipientData.accountDetails || null,
      createdAt: new Date(),
    };
    this.recipients.set(id, recipient);
    return recipient;
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate | undefined> {
    return Array.from(this.exchangeRates.values()).find(
      (rate) => rate.fromCurrency === fromCurrency && rate.toCurrency === toCurrency,
    );
  }

  async updateExchangeRate(fromCurrency: string, toCurrency: string, rate: string): Promise<ExchangeRate> {
    const existing = await this.getExchangeRate(fromCurrency, toCurrency);
    if (existing) {
      existing.rate = rate;
      existing.updatedAt = new Date();
      this.exchangeRates.set(existing.id, existing);
      return existing;
    } else {
      const id = randomUUID();
      const exchangeRate: ExchangeRate = {
        id,
        fromCurrency,
        toCurrency,
        rate,
        updatedAt: new Date(),
      };
      this.exchangeRates.set(id, exchangeRate);
      return exchangeRate;
    }
  }
}

export const storage = new MemStorage();
