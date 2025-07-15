import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IndianRupee, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { paymentApi } from '@/utils/api';
import { useAuthStore } from '@/store/auth.store';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  totalRemaining: number;
  onPaymentSuccess?: () => void; // Add callback for payment success
}

// Define Razorpay response type
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number;
  projectId: string;
  userId: string;
}

// interface RazorpayOrder {
//   id: string;
//   amount: number;
//   currency: string;
//   receipt: string;
//   status: string;
//   notes: {
//     projectId: string;
//     userId: string;
//   };
//   amount_due: number;
//   amount_paid: number;
//   attempts: number;
//   created_at: number;
//   entity: string;
//   offer_id: null;
// }

// Define Razorpay interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayClass {
  new (options: RazorpayOptions): { open: () => void };
}

declare global {
  interface Window {
    Razorpay: RazorpayClass;
  }
}

export default function PaymentModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  totalRemaining,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { user } = useAuthStore();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
          setIsScriptLoaded(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve();
        };
        script.onerror = () => {
          script.remove();
          reject(new Error('Failed to load Razorpay SDK'));
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().catch((error) => {
      console.error('Razorpay script loading failed:', error);
      toast.error('Failed to load payment system. Please try again later.');
    });

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script && !isOpen) {
        script.remove();
        setIsScriptLoaded(false);
      }
    };
  }, [isOpen]);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };


  const checkTransactionStatus = async (orderId: string): Promise<boolean> => {
    try {
      const response = await paymentApi.checkTransactionStatus(orderId);
      const { status } = response.data.data;
  
      if (status === 'success') return true;
      if (status === 'failed') throw new Error('Payment failed');
      if (status === 'not_found') throw new Error('Transaction not found');
      if (status === 'error') throw new Error('Transaction status check failed');
  
      throw new Error('Payment still processing');
    } catch (err) {
      console.error('Status check error:', err);
      throw err;
    }
  };
  
  const initializePayment = async () => {
    if (!isScriptLoaded) {
      toast.error('Payment system is still loading. Please try again.');
      return;
    }

    try {
      setLoading(true);
      
      // Create order using our API instance
      const response = await paymentApi.createOrder({
        amount: parseInt(amount),
        projectId,
        userId: user?._id || ""
      });

      const orderResponse = response.data;
      console.log(orderResponse)
      if (!orderResponse.success || !orderResponse.data.order) {
        throw new Error('Failed to create order');
      }

      const { order } = orderResponse.data;

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
        amount: order.amount,
        currency: order.currency,
        name: "Dwelling Home",
        description: `Payment for ${projectTitle}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('Razorpay payment response:', response);
            
            // Verify payment using our API instance
            const verifyResponse = await paymentApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              projectId,
              userId: user?._id || ""
            });
            
            const verifyResult = verifyResponse.data;
            console.log('Payment verification response:', verifyResponse);
            
            if (verifyResult.success) {
              // Check transaction status with polling
              toast.loading('Verifying payment status...');
              
              try {
                console.log('Checking transaction status for order:', order.id);
                await checkTransactionStatus(order.id);
                toast.dismiss();
                toast.success('Payment successful!');
                onClose();
                
                // Call the success callback to refresh payment schedule
                if (onPaymentSuccess) {
                  console.log('Calling payment success callback');
                  onPaymentSuccess();
                }
              } catch (statusError) {
                toast.dismiss();
                console.error('Payment status check failed:', statusError);
                toast.error('Payment verification failed. Please contact support.');
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: "#ef4444",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to initialize payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    initializePayment();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to pay for {projectTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-10"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-sm text-gray-500">
              Remaining to be paid: {formatCurrency(totalRemaining)}
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !parseInt(amount) || !isScriptLoaded}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isScriptLoaded ? 'Loading...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 