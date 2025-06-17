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
import { Loader2, ArrowLeft, AlertCircle, History } from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function PaymentDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    currentSchedule = null,
    loading = false,
    fetchScheduleById,
    updateProjectValue,
    updatePaymentStructure,
    updateCurrentMilestone
  } = useAdminPaymentStore();

  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    projectValue: 0,
    milestones: [] as Array<{ timeline: string; percentage: number }>,
    currentMilestone: 1
  });

  // Fetch payment schedule on mount
  useEffect(() => {
    if (projectId) {
      fetchScheduleById(projectId);
    }
  }, [projectId, fetchScheduleById]);

  // Update edited values when schedule changes
  useEffect(() => {
    if (currentSchedule) {
      setEditedValues({
        projectValue: currentSchedule?.totalProjectValue ?? 0,
        milestones: currentSchedule?.milestones?.map(m => ({
          timeline: m?.timeline ?? '',
          percentage: m?.percentage ?? 0
        })) ?? [],
        currentMilestone: currentSchedule?.currentMilestone ?? 1
      });
    }
  }, [currentSchedule]);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '₹ 0';
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

  // Handle milestone update
  const handleMilestoneUpdate = (index: number, field: 'timeline' | 'percentage', value: string) => {
    setEditedValues(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => 
        i === index 
          ? { ...m, [field]: field === 'percentage' ? parseFloat(value) || 0 : value }
          : m
      )
    }));
  };

  // Handle current milestone update
  const handleCurrentMilestoneUpdate = (value: string) => {
    const milestone = parseInt(value);
    if (!currentSchedule) return;
    
    setEditedValues(prev => ({
      ...prev,
      currentMilestone: milestone || 1
    }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      if (!currentSchedule?._id) {
        toast.error('Invalid payment schedule');
        return;
      }

      // Validate total percentage equals 100
      const totalPercentage = editedValues.milestones.reduce((sum, m) => sum + (m?.percentage ?? 0), 0);
      if (Math.abs(totalPercentage - 100) >= 0.01) {
        toast.error('Total milestone percentages must equal 100%');
        return;
      }

      // Update project value if changed
      if (editedValues.projectValue !== currentSchedule?.totalProjectValue) {
        await updateProjectValue(currentSchedule._id, editedValues.projectValue);
      }

      // Update milestone structure if changed
      const structureChanged = editedValues.milestones.some((m, i) => 
        m?.timeline !== currentSchedule?.milestones?.[i]?.timeline ||
        m?.percentage !== currentSchedule?.milestones?.[i]?.percentage
      );

      if (structureChanged) {
        await updatePaymentStructure(currentSchedule._id, editedValues.milestones);
      }

      // Update current milestone if changed
      if (editedValues.currentMilestone !== currentSchedule?.currentMilestone) {
        await updateCurrentMilestone(currentSchedule._id, editedValues.currentMilestone);
      }

      setEditMode(false);
      toast.success('Payment schedule updated successfully');
      fetchScheduleById(projectId);
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
        <h2 className="text-2xl font-semibold text-gray-800">No Schedule Exists</h2>
        <p className="text-muted-foreground mb-4">The requested payment schedule does not exist.</p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>
      </div>
    );
  }

  const totalPaid = currentSchedule?.totalPaid ?? 0;
  const totalRemaining = currentSchedule?.totalRemaining ?? 0;
  const totalOverpayment = currentSchedule?.totalOverpayment ?? 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="border-b">
          <div className="px-6 py-6">
            {/* Navigation and status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Payments
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/admin/projects/${currentSchedule?.projectId?._id ?? ''}/transactions`)}
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View Transaction History
                </Button>
              </div>
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
                  <span className="font-mono">#{currentSchedule?._id ?? 'N/A'}</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                  {currentSchedule?.projectId?.title ?? 'Untitled Project'}
                </h1>
              </div>

              {/* Overall progress */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium">
                    {Math.round((totalPaid / (currentSchedule?.totalProjectValue ?? 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(totalPaid / (currentSchedule?.totalProjectValue ?? 1)) * 100}%`
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
                <h2 className="text-xl font-semibold">{currentSchedule?.projectId?.title ?? 'Untitled Project'}</h2>
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
                    <span className="text-xl font-semibold">{formatCurrency(currentSchedule?.totalProjectValue)}</span>
                  )}
                </div>
              </div>
              {editMode && (
                <div>
                  <label className="text-sm text-muted-foreground">Current Milestone</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32">
                      <Input 
                        type="number"
                        min={1}
                        max={currentSchedule?.milestones?.length ?? 1}
                        value={editedValues.currentMilestone}
                        onChange={(e) => handleCurrentMilestoneUpdate(e.target.value)}
                        className="w-full pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        / {currentSchedule?.milestones?.length ?? 1}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Timeline:</span>{' '}
                      {currentSchedule?.milestones?.find(m => m?.slNo === editedValues.currentMilestone)?.timeline ?? 'Invalid milestone'}
                    </div>
                  </div>
                </div>
              )}
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
                {currentSchedule?.milestones?.map((milestone, index) => (
                  <TableRow 
                    key={milestone?.slNo ?? index} 
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors relative",
                      milestone?.slNo === currentSchedule?.currentMilestone && "bg-red-100 hover:bg-red-100"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {milestone?.slNo === currentSchedule?.currentMilestone && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                            Current
                          </div>
                        )}
                        {milestone?.slNo ?? index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input 
                          value={editedValues.milestones[index]?.timeline ?? ''}
                          onChange={(e) => handleMilestoneUpdate(index, 'timeline', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <div className="font-medium">{milestone?.timeline ?? 'N/A'}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editMode ? (
                        <Input 
                          type="number"
                          value={editedValues.milestones[index]?.percentage ?? 0}
                          onChange={(e) => handleMilestoneUpdate(index, 'percentage', e.target.value)}
                          className="w-20 text-center mx-auto"
                        />
                      ) : (
                        `${milestone?.percentage ?? 0}%`
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(milestone?.amount)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-medium",
                        (milestone?.actualPaid ?? 0) > 0 ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {(milestone?.actualPaid ?? 0) > 0 ? formatCurrency(milestone?.actualPaid) : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {(milestone?.effectivePaid ?? 0) > 0 ? (
                        <div>
                          <span className="font-medium">
                            {formatCurrency(Math.min(milestone?.effectivePaid ?? 0, milestone?.amount ?? 0))}
                          </span>
                          {(milestone?.overpayment ?? 0) > 0 && (
                            <span className="text-green-600 text-sm ml-1">
                              (+{formatCurrency(milestone?.overpayment)})
                            </span>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        (milestone?.toBePaid ?? 0) > 0 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-green-100 text-green-700"
                      )}>
                        {(milestone?.toBePaid ?? 0) > 0 ? formatCurrency(milestone?.toBePaid) : 'Paid'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {editMode && (
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={2} className="px-4 py-3 text-right font-medium">
                      Total Percentage:
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "font-bold",
                        Math.abs(editedValues.milestones.reduce((sum, m) => sum + (m?.percentage ?? 0), 0) - 100) < 0.01
                          ? "text-green-600"
                          : "text-red-600"
                      )}>
                        {editedValues.milestones.reduce((sum, m) => sum + (m?.percentage ?? 0), 0).toFixed(2)}%
                      </span>
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
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
                    <span className="font-medium">{formatCurrency(currentSchedule?.totalProjectValue)}</span>
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