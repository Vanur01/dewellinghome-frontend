import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaymentStore } from '@/store/user/PaymentStore';
import { Card } from '@/components/ui/card';
import { Loader2, IndianRupee, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button'

export default function Payment() {
  const navigate = useNavigate();
  const { userSchedules, loading, getUserPaymentSchedules } = usePaymentStore();

  useEffect(() => {
    getUserPaymentSchedules();
    console.log(userSchedules);
  }, []);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Schedules</h1>

      <div className="grid gap-6">
        {userSchedules.map((schedule) => (
          <Card key={schedule._id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {schedule.projectId.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Project Value: {formatCurrency(schedule.totalProjectValue)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span>Payment Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.totalRemaining === 0 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {schedule.totalRemaining === 0 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(schedule.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Amount Remaining</span>
                  <span className="font-medium text-blue-600">{formatCurrency(schedule.totalRemaining)}</span>
                </div>
                {schedule.totalOverpayment > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Overpayment</span>
                    <span className="font-medium text-green-600">{formatCurrency(schedule.totalOverpayment)}</span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(schedule.totalPaid / schedule.totalProjectValue) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">
                      {Math.round((schedule.totalPaid / schedule.totalProjectValue) * 100)}% Complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button

                  onClick={() => navigate(`/dashboard/payment/${schedule.projectId._id}`)}
                  className="flex items-center gap-2 bg-red-600 text-white"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {userSchedules.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Payment Schedules Found</h3>
            <p className="text-gray-500 mt-2">You don't have any payment schedules yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}