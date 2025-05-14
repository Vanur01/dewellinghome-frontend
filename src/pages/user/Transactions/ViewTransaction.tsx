import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useTransactionStore } from "../../../store/user/TransactionStore";
import { Badge } from "../../../components/ui/badge";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Transaction } from "@/utils/api";

interface ViewTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

export function ViewTransaction({ isOpen, onClose, transactionId }: ViewTransactionProps) {
  const { getTransactionById } = useTransactionStore();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTransaction = async () => {
      if (isOpen && transactionId) {
        setLoading(true);
        const result = await getTransactionById(transactionId);
        setTransaction(result);
        setLoading(false);
      }
    };
    loadTransaction();
  }, [isOpen, transactionId, getTransactionById]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : transaction ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                <p className="text-sm font-medium">{transaction.razorpay_payment_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div>{getStatusBadge(transaction.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium">{transaction.method}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Project</p>
                <p className="text-sm font-medium">{transaction.projectId.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Paid On</p>
                <p className="text-sm font-medium">{format(new Date(transaction.paidAt), "PPP")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Transaction not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}