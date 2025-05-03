import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminPaymentStore } from '@/store/admin/adminPayment.store';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, Bell, FileText, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PaymentDetails() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { 
    currentSchedule,
    loading,
    fetchScheduleById,
    updateProjectValue,
    updateMilestonePayment 
  } = useAdminPaymentStore();

  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    projectValue: 0,
    payments: {}
  });

  // Fetch payment schedule on mount
  useEffect(() => {
    if (scheduleId) {
      fetchScheduleById(scheduleId);
    }
  }, [scheduleId]);

  // Update edited values when schedule changes
  useEffect(() => {
    if (currentSchedule) {
      setEditedValues({
        projectValue: currentSchedule.totalProjectValue,
        payments: Object.fromEntries(
          currentSchedule.milestones.map(m => [m._id, m.actualPaid])
        )
      });
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

  // Handle project value change
  const handleProjectValueChange = (value: string) => {
    setEditedValues(prev => ({
      ...prev,
      projectValue: parseFloat(value) || 0
    }));
  };

  // Handle payment update
  const handlePaymentUpdate = (milestoneId: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        [milestoneId]: parseFloat(value) || 0
      }
    }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      // Update project value if changed
      if (editedValues.projectValue !== currentSchedule?.totalProjectValue) {
        await updateProjectValue(scheduleId!, editedValues.projectValue);
      }

      // Update milestone payments if changed
      for (const [milestoneId, amount] of Object.entries(editedValues.payments)) {
        const milestone = currentSchedule?.milestones.find(m => m._id === milestoneId);
        if (milestone && amount !== milestone.actualPaid) {
          await updateMilestonePayment(scheduleId!, milestoneId, {
            amount: amount as number,
            paymentMethod: milestone.paymentMethod || 'cash',
            paymentReference: milestone.paymentReference
          });
        }
      }

      setEditMode(false);
      toast.success('Payment schedule updated successfully');
      fetchScheduleById(scheduleId!);
    } catch (error) {
      toast.error('Failed to update payment schedule');
      console.error('Error updating payment schedule:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!currentSchedule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-gray-800">Payment Schedule Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested payment schedule could not be found.</p>
        <Button
          onClick={() => navigate('/admin/payments')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>
      </div>
    );
  }

  const totalPaid = currentSchedule.totalPaid;
  const totalRemaining = currentSchedule.totalRemaining;
  const totalOverpayment = currentSchedule.totalOverpayment;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="border-b">
          <div className="px-6 py-6">
            {/* Navigation and status */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => navigate('/admin/payments')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payments
              </Button>
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                totalRemaining === 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              )}>
                {totalRemaining === 0 ? 'Completed' : 'In Progress'}
              </div>
            </div>

            {/* Project information */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <span>Payment Schedule</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  <span className="font-mono">#{scheduleId}</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                  {currentSchedule.projectId.title}
                </h1>
              </div>

              {/* Overall progress */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium">
                    {Math.round((totalPaid / currentSchedule.totalProjectValue) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(totalPaid / currentSchedule.totalProjectValue) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 space-y-6">
          {/* Project Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Project Name</label>
                <h2 className="text-xl font-semibold">{currentSchedule.projectId.title}</h2>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Total Project Value</label>
                <div className="flex items-center gap-4">
                  {editMode ? (
                    <Input 
                      type="number" 
                      value={editedValues.projectValue}
                      onChange={(e) => handleProjectValueChange(e.target.value)}
                      className="w-64 text-right font-medium"
                    />
                  ) : (
                    <span className="text-xl font-semibold">{formatCurrency(currentSchedule.totalProjectValue)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Payment Status</label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Received</div>
                    <div className="text-xl font-semibold text-green-600">{formatCurrency(totalPaid)}</div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Remaining</div>
                    <div className="text-xl font-semibold text-blue-600">{formatCurrency(totalRemaining)}</div>
                  </div>
                </div>
              </div>
              {totalOverpayment > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Overpayment Detected</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Client has overpaid by {formatCurrency(totalOverpayment)}, applied to future milestones.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Milestones Table */}
          <div className="mt-8 rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">Sl No.</TableHead>
                  <TableHead>Payments Timelines and Services</TableHead>
                  <TableHead className="text-center w-24">Percentage</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actual Paid</TableHead>
                  <TableHead className="text-right">Effective Paid</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchedule.milestones.map((milestone) => (
                  <TableRow key={milestone._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{milestone.slNo}</TableCell>
                    <TableCell>
                      <div className="font-medium">{milestone.timeline}</div>
                    </TableCell>
                    <TableCell className="text-center">{milestone.percentage}%</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(milestone.amount)}</TableCell>
                    <TableCell className="text-right">
                      {editMode ? (
                        <Input 
                          type="number" 
                          value={editedValues.payments[milestone._id]}
                          onChange={(e) => handlePaymentUpdate(milestone._id, e.target.value)}
                          className="w-32 text-right"
                        />
                      ) : (
                        <span className={cn(
                          "font-medium",
                          milestone.actualPaid > 0 ? "text-green-600" : "text-muted-foreground"
                        )}>
                          {milestone.actualPaid > 0 ? formatCurrency(milestone.actualPaid) : '-'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {milestone.effectivePaid > 0 ? (
                        <div>
                          <span className="font-medium">
                            {formatCurrency(Math.min(milestone.effectivePaid, milestone.amount))}
                          </span>
                          {milestone.overpayment > 0 && (
                            <span className="text-green-600 text-sm ml-1">
                              (+{formatCurrency(milestone.overpayment)})
                            </span>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        milestone.toBePaid > 0 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-green-100 text-green-700"
                      )}>
                        {milestone.toBePaid > 0 ? formatCurrency(milestone.toBePaid) : 'Paid'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary and Actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Project Value</span>
                    <span className="font-medium">{formatCurrency(currentSchedule.totalProjectValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Received</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Remaining</span>
                    <span className="font-medium text-blue-600">{formatCurrency(totalRemaining)}</span>
                  </div>
                  {totalOverpayment > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Overpayment</span>
                      <span className="font-medium text-green-600">{formatCurrency(totalOverpayment)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <div className="space-y-4">
                  {!editMode ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => navigate('/admin/payments')}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Payments
                      </Button>
                      <Button 
                        onClick={() => setEditMode(true)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        Edit Values
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          className="flex items-center justify-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <Bell className="h-4 w-4" />
                          Send Reminder
                        </Button>
                        <Button
                          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <FileText className="h-4 w-4" />
                          Generate Invoice
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}