import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentApi } from '@/utils/api';
import { toast } from 'sonner';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userId: string;
  onSuccess: () => void;
}

export function ManualPaymentModal({
  isOpen,
  onClose,
  projectId,
  userId,
  onSuccess
}: ManualPaymentModalProps) {
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await paymentApi.addManualPayment({
        amount: parseFloat(amount),
        projectId,
        userId
      });

      toast.success('Manual payment added successfully');
      onSuccess();
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Error adding manual payment:', error);
      toast.error('Failed to add manual payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manual Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Payment Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
                className="text-right"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Processing...' : 'Add Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
