import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from '@/store/user/PaymentStore';
import { Loader2, IndianRupee, AlertCircle, CheckCircle2, Clock, ArrowLeft, Building, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PaymentModal from '@/components/admin/payment/PaymentModal';
import { toast } from 'sonner';

interface Milestone {
  slNo: number;
  timeline: string;
  percentage: number;
  amount: number;
  actualPaid: number;
  toBePaid: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  status: 'pending' | 'partially_paid' | 'paid';
}

export default function PaymentScheduleDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentSchedule, loading, getPaymentScheduleByProject, clearSchedule } = usePaymentStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  useEffect(() => {
    clearSchedule();
    if (projectId) {
      getPaymentScheduleByProject(projectId).catch((error) => {
        console.log(error)
        clearSchedule();
      });
    }
  }, [projectId, clearSchedule, getPaymentScheduleByProject]);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.actualPaid >= milestone.amount) {
      return { 
        label: 'Completed', 
        icon: CheckCircle2, 
        className: 'text-emerald-600', 
        bgClassName: 'bg-emerald-50',
        borderClassName: 'border-emerald-200'
      };
    }
    if (milestone.actualPaid > 0) {
      return { 
        label: 'Partial', 
        icon: Clock, 
        className: 'text-amber-600', 
        bgClassName: 'bg-amber-50',
        borderClassName: 'border-amber-200'
      };
    }
    return { 
      label: 'Pending', 
      icon: AlertCircle, 
      className: 'text-slate-500', 
      bgClassName: 'bg-slate-50',
      borderClassName: 'border-slate-200'
    };
  };

  // Function to refresh payment schedule after successful payment
  const handlePaymentSuccess = async () => {
    if (projectId) {
      try {
        console.log('Refreshing payment schedule for project:', projectId);
        await getPaymentScheduleByProject(projectId);
        toast.success('Payment schedule updated successfully!');
      } catch (error) {
        console.error('Failed to refresh payment schedule:', error);
        toast.error('Payment successful but failed to update schedule. Please refresh the page.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentSchedule) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800">Payment Schedule Not Found</h2>
        <p className="text-gray-600 mt-2">The requested payment schedule could not be found.</p>
      </div>
    );
  }

  const completionPercentage = ((currentSchedule?.totalPaid ?? 0) / (currentSchedule?.totalProjectValue ?? 1)) * 100;
  const currentMilestone = currentSchedule?.milestones?.find(m => m.slNo === currentSchedule?.currentMilestone);
  
  // Calculate cumulative amounts up to current milestone
  const getCurrentMilestoneCumulative = () => {
    if (!currentSchedule?.milestones || !currentSchedule?.currentMilestone) return { totalDue: 0, totalPaid: 0, amountDue: 0 };
    
    const milestonesUpToCurrent = currentSchedule.milestones.filter(
      m => m.slNo <= currentSchedule.currentMilestone
    );
    
    const totalDue = milestonesUpToCurrent.reduce((sum, m) => sum + m.amount, 0);
    const totalPaid = milestonesUpToCurrent.reduce((sum, m) => sum + m.actualPaid, 0);
    const amountDue = totalDue - totalPaid;
    
    return { totalDue, totalPaid, amountDue };
  };
  
  const cumulativePayment = getCurrentMilestoneCumulative();
  const paymentActions = [];

  // Add Pay Now button if there's remaining amount
  if (cumulativePayment.amountDue > 0) {
    paymentActions.push(
      <Button 
        key="pay"
        onClick={() => setIsPaymentModalOpen(true)}
        className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm w-full sm:w-auto"
      >
        <IndianRupee className="h-4 w-4 mr-2" />
        Pay Now
      </Button>
    );
  }

  // Add View Transactions button
  paymentActions.push(
    <Button 
      key="transactions"
      variant="outline"
      onClick={() => navigate(`/dashboard/projects/${projectId}/transactions`)}
      className="border-slate-300 text-slate-700 hover:bg-slate-50 w-full sm:w-auto"
    >
      <History className="h-4 w-4 mr-2" />
      View Transactions
    </Button>
  );

  return (
    <div className="sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Clean Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-slate-100 text-slate-600 p-0"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-slate-700">
                <Building className="h-5 w-5" />
                <span className="text-base sm:text-lg font-semibold">Project Payment Details</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {paymentActions}
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
                {currentSchedule?.projectId?.title}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Badge variant="secondary" className="py-1.5 px-3 bg-slate-100 text-slate-700 w-fit">
                  Project ID: {currentSchedule?.projectId?._id?.slice(-8)?.toUpperCase()}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "py-1.5 px-3 w-fit",
                    completionPercentage >= 100 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                      : "bg-amber-100 text-amber-700 border-amber-200"
                  )}
                >
                  {completionPercentage >= 100 ? 'Payment Completed' : 'Payment In Progress'}
                </Badge>
              </div>
            </div>

            {/* Current Milestone Info */}
            {currentMilestone && (
              <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-lg p-4 sm:p-6 border border-rose-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Current Stage</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Timeline</p>
                    <p className="text-base sm:text-lg font-medium text-slate-900 break-words">{currentMilestone.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Stage Payment Status</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="text-base sm:text-lg font-medium text-slate-900 break-all">
                        {formatCurrency(currentMilestone.actualPaid)} / {formatCurrency(currentMilestone.amount)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "py-1 px-2 w-fit",
                          currentMilestone.toBePaid === 0 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                            : currentMilestone.actualPaid > 0 
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                        )}
                      >
                        {currentMilestone.toBePaid === 0 
                          ? 'Paid' 
                          : currentMilestone.actualPaid > 0 
                            ? 'Partially Paid'
                            : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((currentMilestone?.actualPaid ?? 0) / (currentMilestone?.amount ?? 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Total Value</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 break-all">
                   {formatCurrency(currentSchedule?.totalProjectValue ?? 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                <p className="text-sm text-emerald-700 mb-1">Paid Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-700 break-all">
                   {formatCurrency(currentSchedule?.totalPaid ?? 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 sm:col-span-2 lg:col-span-1">
                <p className="text-sm text-blue-700 mb-1">Remaining</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700 break-all">
                   {formatCurrency(currentSchedule?.totalRemaining ?? 0)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-slate-700">
                <span className="font-medium">Overall Progress</span>
                <span className="font-semibold">{Math.round(completionPercentage)}% Complete</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    completionPercentage >= 100 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Table Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-slate-900">Payment Milestones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Milestone</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Percentage</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">To Be Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Total Due</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentSchedule?.milestones?.map((milestone, index) => {
                  const status = getMilestoneStatus(milestone);
                  const StatusIcon = status.icon;
                  const isCurrent = milestone.slNo === currentSchedule?.currentMilestone;
                  
                  // Calculate cumulative due up to current milestone (only show for current)
                  let cumulativeDue = 0;
                  if (isCurrent) {
                    cumulativeDue = currentSchedule.milestones
                      .slice(0, index + 1)
                      .reduce((sum, m) => sum + m.toBePaid, 0);
                  }
                  
                  return (
                    <tr 
                      key={milestone.slNo} 
                      className={cn(
                        "hover:bg-slate-50 transition-colors border-b border-slate-100",
                        isCurrent && "bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-150"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full font-medium">
                              CURRENT
                            </div>
                          )}
                          <span className="font-semibold text-slate-900">{milestone.slNo}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-slate-700 max-w-xs break-words leading-relaxed">
                            {milestone?.timeline}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <StatusIcon className={cn("h-4 w-4", status.className)} />
                          <span className={cn("text-sm font-medium", status.className)}>
                            {status.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          {milestone.percentage}%
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-900">
                        {formatCurrency(milestone.amount)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-emerald-600">
                          {milestone.actualPaid > 0 ? formatCurrency(milestone.actualPaid) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={cn(
                          "font-semibold",
                          milestone.toBePaid > 0 ? "text-blue-600" : "text-emerald-600"
                        )}>
                        {formatCurrency(milestone.toBePaid)} 
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {isCurrent && cumulativeDue > 0 ? (
                          <div>
                            <span className="font-bold text-rose-600">
                              {formatCurrency(cumulativeDue)}
                            </span>
                            <div className="text-xs text-rose-500 mt-1 font-medium">Due Now</div>
                          </div>
                        ) : isCurrent && cumulativeDue === 0 ? (
                          <span className="font-semibold text-emerald-600">✓ Cleared</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-slate-200">
            {currentSchedule?.milestones?.map((milestone, index) => {
              const status = getMilestoneStatus(milestone);
              const StatusIcon = status.icon;
              const isCurrent = milestone.slNo === currentSchedule?.currentMilestone;
              
              // Calculate cumulative due up to current milestone (only show for current)
              let cumulativeDue = 0;
              if (isCurrent) {
                cumulativeDue = currentSchedule.milestones
                  .slice(0, index + 1)
                  .reduce((sum, m) => sum + m.toBePaid, 0);
              }
              
              return (
                <div 
                  key={milestone.slNo}
                  className={cn(
                    "p-4 space-y-3",
                    isCurrent && "bg-gradient-to-r from-rose-50 to-rose-100"
                  )}
                >
                  {/* Simplified Milestone Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <div className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full font-medium">
                          CURRENT
                        </div>
                      )}
                      <span className="font-semibold text-slate-900">Milestone {milestone.slNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-4 w-4", status.className)} />
                      <span className={cn("text-sm font-medium", status.className)}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Full Timeline Display */}
                  <div>
                    <p className="font-medium text-slate-900 text-sm break-words leading-relaxed">
                      {milestone.timeline}
                    </p>
                  </div>

                  {/* Simplified Payment Details - Only show key information */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Amount</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(milestone.amount)}</span>
                    </div>
                    
                    {milestone.actualPaid > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Paid</span>
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(milestone.actualPaid)}
                        </span>
                      </div>
                    )}
                    
                    {milestone.toBePaid > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Remaining</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(milestone.toBePaid)}
                        </span>
                      </div>
                    )}
                    
                    {isCurrent && cumulativeDue > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-sm font-medium text-rose-600">Total Due Now</span>
                        <span className="font-bold text-rose-600">
                          {formatCurrency(cumulativeDue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <IndianRupee className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Payment Instructions</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Please ensure timely payments according to the schedule above to avoid any delay in project completion.
                For any payment-related queries, contact our finance department.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {currentSchedule && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          projectId={projectId!}
          projectTitle={currentSchedule?.projectId?.title ?? ''}
          totalRemaining={cumulativePayment.amountDue > 0 ? cumulativePayment.amountDue : currentSchedule?.totalRemaining ?? 0}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}