import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertRecipientSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // In real app, send OTP via SMS
      // For demo, we'll just return success
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }

      // In real app, verify OTP
      // For demo, accept any 6-digit code
      if (otp.length !== 6) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Check if user exists, create if not
      let user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        user = await storage.createUser({ phoneNumber });
      }

      res.json({ user, token: "demo-token" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Balance routes
  app.get("/api/users/:id/balances", async (req, res) => {
    try {
      const balances = await storage.getUserBalances(req.params.id);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ message: "Failed to get balances" });
    }
  });

  // Transaction routes
  app.get("/api/users/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  app.post("/api/users/:id/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction({
        ...transactionData,
        userId: req.params.id,
      });
      
      // Simulate processing
      setTimeout(async () => {
        await storage.updateTransactionStatus(transaction.id, "completed");
      }, 2000);

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Recipients routes
  app.get("/api/users/:id/recipients", async (req, res) => {
    try {
      const recipients = await storage.getUserRecipients(req.params.id);
      res.json(recipients);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recipients" });
    }
  });

  app.post("/api/users/:id/recipients", async (req, res) => {
    try {
      const recipientData = insertRecipientSchema.parse(req.body);
      const recipient = await storage.createRecipient({
        ...recipientData,
        userId: req.params.id,
      });
      res.json(recipient);
    } catch (error) {
      res.status(500).json({ message: "Failed to create recipient" });
    }
  });

  // Exchange rates
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) {
        return res.status(400).json({ message: "From and to currencies are required" });
      }
      
      const rate = await storage.getExchangeRate(from as string, to as string);
      if (!rate) {
        return res.status(404).json({ message: "Exchange rate not found" });
      }
      
      res.json(rate);
    } catch (error) {
      res.status(500).json({ message: "Failed to get exchange rate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
