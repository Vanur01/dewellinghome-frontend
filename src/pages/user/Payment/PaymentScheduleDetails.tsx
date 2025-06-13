import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from '@/store/user/PaymentStore';
import { Loader2, IndianRupee, AlertCircle, CheckCircle2, Clock, ArrowLeft, Building, AlertTriangle, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PaymentModal from '@/components/admin/payment/PaymentModal';

interface Milestone {
  slNo: number;
  timeline: string;
  percentage: number;
  amount: number;
  effectivePaid: number;
  actualPaid: number;
  overpayment: number;
  toBePaid: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  status: 'pending' | 'partially_paid' | 'paid';
}

export default function PaymentScheduleDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentSchedule, loading, getPaymentScheduleByProject ,clearSchedule} = usePaymentStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [milestonesWithPreviousDues, setMilestonesWithPreviousDues] = useState<Array<Milestone & { previousDues: number }>>([]);

  useEffect(() => {
    clearSchedule();
    if (projectId) {
      getPaymentScheduleByProject(projectId).catch((error) => {
        clearSchedule();
      });
    }
  }, [projectId, getPaymentScheduleByProject]);

  // Calculate previous dues for each milestone
  useEffect(() => {
    if (currentSchedule) {
      const enrichedMilestones = currentSchedule.milestones.map((milestone, index) => {
        // Calculate total dues from all previous milestones
        let previousDues = 0;
        for (let i = 0; i < index; i++) {
          previousDues += currentSchedule.milestones[i].toBePaid;
        }
        
        return {
          ...milestone,
          previousDues
        };
      });
      
      setMilestonesWithPreviousDues(enrichedMilestones);
    }
  }, [currentSchedule]);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.effectivePaid >= milestone.amount) {
      return { label: 'Completed', icon: CheckCircle2, className: 'text-green-600' };
    }
    if (milestone.effectivePaid > 0) {
      return { label: 'Partial', icon: Clock, className: 'text-yellow-600' };
    }
    return { label: 'Pending', icon: AlertCircle, className: 'text-gray-500' };
  };

  const getStatusBadge = (milestone: Milestone) => {
    if (milestone.effectivePaid >= milestone.amount) {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Paid</Badge>;
    }
    if (milestone.effectivePaid > 0) {
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Partially Paid</Badge>;
    }
    return <Badge variant="outline" className="text-gray-700">Pending</Badge>;
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

  const completionPercentage = (currentSchedule.totalPaid / currentSchedule.totalProjectValue) * 100;
  const currentMilestone = currentSchedule?.milestones.find(m => m.slNo === currentSchedule.currentMilestone);
  const paymentActions = [];

  // Add Pay Now button if there's remaining amount
  if (currentSchedule?.totalRemaining > 0) {
    paymentActions.push(
      <Button 
        key="pay"
        onClick={() => setIsPaymentModalOpen(true)}
        className="bg-red-500 hover:bg-red-600"
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
      className="border-gray-200"
    >
      <History className="h-4 w-4 mr-2" />
      View Transactions
    </Button>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Clean Header Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100 text-gray-600 p-0"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-5 w-5" />
                <span className="text-lg font-medium">Project Payment Details</span>
              </div>
            </div>
            <div className="flex gap-2">
              {paymentActions}
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {currentSchedule.projectId.title}
              </h1>
              <div className="flex gap-3">
                <Badge variant="secondary" className="py-1.5 px-3">
                  Project ID: {currentSchedule.projectId._id.slice(-8).toUpperCase()}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "py-1.5 px-3",
                    completionPercentage >= 100 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {completionPercentage >= 100 ? 'Payment Completed' : 'Payment In Progress'}
                </Badge>
              </div>
            </div>

            {/* Current Milestone Info */}
            {currentMilestone && (
              <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <h3 className="text-lg font-semibold text-gray-900">Current Stage</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Timeline</p>
                    <p className="text-lg font-medium text-gray-900">{currentMilestone.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-gray-900">
                        {formatCurrency(currentMilestone.effectivePaid)} / {formatCurrency(currentMilestone.amount)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "py-1 px-2",
                          currentMilestone.toBePaid === 0 
                            ? "bg-green-100 text-green-700" 
                            : currentMilestone.effectivePaid > 0 
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {currentMilestone.toBePaid === 0 
                          ? 'Paid' 
                          : currentMilestone.effectivePaid > 0 
                            ? 'Partially Paid'
                            : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(currentMilestone.effectivePaid / currentMilestone.amount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                   {formatCurrency(currentSchedule.totalProjectValue)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Paid Amount</p>
                <p className="text-2xl font-semibold text-green-600">
                   {formatCurrency(currentSchedule.totalPaid)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Remaining</p>
                <p className="text-2xl font-semibold text-blue-600">
                   {formatCurrency(currentSchedule.totalRemaining)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Overall Progress</span>
                <span>{Math.round(completionPercentage)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    completionPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Table Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Payment Milestones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Milestone</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Payment Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Percentage</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Remaining</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Previous Dues</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total To Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {milestonesWithPreviousDues.map((milestone) => {
                  const status = getMilestoneStatus(milestone);
                  const StatusIcon = status.icon;
                  const isCurrent = milestone.slNo === currentSchedule.currentMilestone;
                  const totalToPay = milestone.toBePaid + milestone.previousDues;
                  
                  return (
                    <tr 
                      key={milestone.slNo} 
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        isCurrent && "bg-red-50/80 hover:bg-red-50/80"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {isCurrent && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                              C
                            </div>
                          )}
                          <span className="font-medium text-gray-900">{milestone.slNo}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-gray-600">{milestone.timeline.length> 10? milestone.timeline.slice(0,10):milestone.timeline}</span>
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
                        {getStatusBadge(milestone)}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{milestone.percentage}%</td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(milestone.amount)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div>
                          <span className="font-medium text-green-600">
                            {milestone.effectivePaid > 0 ? formatCurrency(Math.min(milestone.effectivePaid, milestone.amount)) : '-'}
                          </span>
                          {milestone.overpayment > 0 && (
                            <span className="text-green-600 text-sm block">
                              +{formatCurrency(milestone.overpayment)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={cn(
                          "font-medium",
                          milestone.toBePaid > 0 ? "text-blue-600" : "text-green-600"
                        )}>
                        {formatCurrency(milestone.toBePaid)} 
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {milestone.previousDues > 0 ? (
                          <span className="font-medium text-red-600">
                            {formatCurrency(milestone.previousDues)}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {totalToPay > 0 ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-semibold text-red-600">
                              {formatCurrency(totalToPay)}
                            </span>
                            {milestone.previousDues > 0 && (
                              <div className="group relative">
                                <div className="absolute right-0 bottom-full mb-2 w-52 p-2 bg-white shadow-lg rounded-md border border-gray-200 text-xs text-gray-700 invisible group-hover:visible z-10">
                                  Includes ₹{milestone.previousDues.toLocaleString('en-IN')} from previous unpaid milestones
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium text-green-600">Paid</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <IndianRupee className="h-6 w-6 text-gray-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Instructions</h3>
              <p className="text-gray-600">
                Please ensure timely payments according to the schedule above to avoid any delay in project completion.
                For any payment-related queries, contact our finance department.
              </p>
              {currentSchedule.totalOverpayment > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-700 font-medium">
                    Your advance payment of {formatCurrency(currentSchedule.totalOverpayment)} has been applied to future milestones as shown in the table above.
                  </p>
                </div>
              )}
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
          projectTitle={currentSchedule.projectId.title}
          totalRemaining={currentSchedule.totalRemaining}
        />
      )}
    </div>
  );
}