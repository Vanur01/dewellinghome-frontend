import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/utils/api";
import { formatDateToLocal, formatPrice } from "@/lib/utils";

interface TransactionViewModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const TransactionViewModal = ({
  open,
  onClose,
  transaction,
}: TransactionViewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Payment ID:</span>
            <span>{transaction.razorpay_payment_id}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Order ID:</span>
            <span>{transaction.razorpay_order_id}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Amount:</span>
            <span>{formatPrice(transaction.amount)}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <span className="capitalize">{transaction.status}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Date:</span>
            <span>{formatDateToLocal(new Date().toISOString())}</span>
          </div>
          {transaction.userId && (
            <>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">User Name:</span>
                <span>{transaction.userId.name}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">User Email:</span>
                <span>{transaction.userId.email}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionViewModal;
