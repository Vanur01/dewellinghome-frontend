import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useTransactionStore } from "@/store/transaction.store";

interface ViewTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

export function ViewTransaction({ isOpen, onClose, transactionId }: ViewTransactionProps) {
  const { getTransactionById, selectedTransaction, loading, clearSelectedTransaction } = useTransactionStore();

  useEffect(() => {
    if (isOpen && transactionId) {
      getTransactionById(transactionId);
    } else {
      clearSelectedTransaction();
    }
  }, [isOpen, transactionId, getTransactionById, clearSelectedTransaction]);

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount ?? 0);
  };

  const getStatusBadge = (status: string | undefined) => {
    switch(status?.toLowerCase() ?? '') {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="outline">{status ?? 'Unknown'}</Badge>;
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
        ) : selectedTransaction ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                <p className="text-sm font-medium">{selectedTransaction?.razorpay_payment_id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-sm font-medium">{formatCurrency(selectedTransaction?.amount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div>{getStatusBadge(selectedTransaction?.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p className="text-sm font-medium">{selectedTransaction?.method}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Project</p>
                <p className="text-sm font-medium">{selectedTransaction?.projectId?.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Paid On</p>
                <p className="text-sm font-medium">{format(new Date(selectedTransaction?.paidAt ?? ''), "PPP")}</p>
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