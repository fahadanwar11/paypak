import { ArrowDownCircle, ArrowUpCircle, RefreshCw, PlusCircle } from "lucide-react";
import { Transaction } from "@shared/schema";
import { TRANSACTION_TYPES, CURRENCIES } from "@/lib/constants";

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case TRANSACTION_TYPES.SEND:
        return <ArrowUpCircle className="w-5 h-5 text-primary" />;
      case TRANSACTION_TYPES.RECEIVE:
        return <ArrowDownCircle className="w-5 h-5 text-success" />;
      case TRANSACTION_TYPES.EXCHANGE:
        return <RefreshCw className="w-5 h-5 text-warning" />;
      case TRANSACTION_TYPES.ADD_MONEY:
        return <PlusCircle className="w-5 h-5 text-success" />;
      default:
        return <ArrowUpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case TRANSACTION_TYPES.SEND:
        return `Sent to ${transaction.recipientName || 'Recipient'}`;
      case TRANSACTION_TYPES.RECEIVE:
        return `Received from ${transaction.recipientName || 'Sender'}`;
      case TRANSACTION_TYPES.EXCHANGE:
        return `${transaction.fromCurrency} → ${transaction.toCurrency}`;
      case TRANSACTION_TYPES.ADD_MONEY:
        return "Money Added";
      default:
        return "Transaction";
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const currency = transaction.fromCurrency || transaction.toCurrency || "PKR";
    const amount = transaction.fromAmount || transaction.toAmount || "0";
    const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
    const symbol = currencyInfo?.symbol || currency;
    
    const isPositive = transaction.type === TRANSACTION_TYPES.RECEIVE || 
                      transaction.type === TRANSACTION_TYPES.ADD_MONEY;
    
    const prefix = isPositive ? "+" : "-";
    return `${prefix}${symbol} ${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "failed":
        return "text-destructive bg-destructive/10";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-sm">{getTransactionTitle(transaction)}</p>
          <p className="text-xs text-text-gray">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">{getTransactionAmount(transaction)}</p>
        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
          <div className="w-1.5 h-1.5 bg-current rounded-full mr-1"></div>
          {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
        </span>
      </div>
    </button>
  );
}
