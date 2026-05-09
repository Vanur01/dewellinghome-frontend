import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, History, AlertCircle, Loader2 } from "lucide-react";
import { useAdminPaymentStore } from "@/store/admin/adminPayment.store";

export default function PaymentDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    currentSchedule = null,
    loading = false,
    fetchScheduleById,
    updateProjectValue,
    updatePaymentStructure,
    updateCurrentMilestone,
    resetStore,
  } = useAdminPaymentStore();

  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState({
    projectValue: 0,
    milestones: [] as Array<{
      timeline: string;
      percentage: number;
      actualPaid: number;
      amount: number; // base + carryover from last save (server-calculated)
    }>,
    currentMilestone: 1,
  });

  // Clear stale data and fetch fresh schedule on mount
  useEffect(() => {
    resetStore();
    if (projectId) {
      fetchScheduleById(projectId);
    }
  }, [projectId]);

  // Update edited values when schedule changes
  useEffect(() => {
    if (currentSchedule) {
      setEditedValues({
        projectValue: currentSchedule?.totalProjectValue ?? 0,
        milestones:
          currentSchedule?.milestones?.map((m) => ({
            timeline: m?.timeline ?? "",
            percentage: m?.percentage ?? 0,
            actualPaid: m?.actualPaid ?? 0,
            amount: m?.amount ?? 0,
          })) ?? [],
        currentMilestone: currentSchedule?.currentMilestone ?? 1,
      });
    }
  }, [currentSchedule]);

  // Format currency to Indian Rupee format
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "₹ 0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };

  // Recalculate all milestone amounts with carry-forward (mirrors backend pre-save hook)
  const recalculateMilestones = (
    milestones: typeof editedValues.milestones,
    projectValue: number,
  ) => {
    let runningOutstanding = 0;
    return milestones.map((m) => {
      const baseAmount = Math.round(projectValue * (m.percentage / 100));
      const carriedOver = runningOutstanding;
      const amount = baseAmount + carriedOver;
      const toBePaid = Math.max(0, amount - m.actualPaid);
      runningOutstanding = toBePaid;
      return { ...m, amount };
    });
  };

  // Handle project value change — recalculate all milestones with carry-forward
  const handleProjectValueChange = (value: string) => {
    const newTotal = parseFloat(value) || 0;
    setEditedValues((prev) => ({
      ...prev,
      projectValue: newTotal,
      milestones: recalculateMilestones(prev.milestones, newTotal),
    }));
  };

  // Handle milestone update
  // actualPaid is capped to amount (base + carryover from last server save).
  // Carryover recalculates server-side on save.
  const handleMilestoneUpdate = (
    index: number,
    field: "timeline" | "percentage" | "actualPaid",
    value: string,
  ) => {
    setEditedValues((prev) => {
      const maxPayable = prev.milestones[index]?.amount ?? 0;

      let parsedValue: string | number =
        field === "percentage" || field === "actualPaid"
          ? parseFloat(value) || 0
          : value;

      if (field === "actualPaid" && typeof parsedValue === "number") {
        parsedValue = Math.min(parsedValue, maxPayable);
      }

      const updatedMilestones = prev.milestones.map((m, i) =>
        i === index ? { ...m, [field]: parsedValue } : m,
      );

      // Recascade carry-forward after any change
      const recascaded = recalculateMilestones(
        updatedMilestones,
        prev.projectValue,
      );

      return {
        ...prev,
        milestones: recascaded,
      };
    });
  };

  // Handle current milestone update
  const handleCurrentMilestoneUpdate = (value: string) => {
    const milestone = parseInt(value);
    if (!currentSchedule) return;

    setEditedValues((prev) => ({
      ...prev,
      currentMilestone: milestone || 1,
    }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      if (!currentSchedule?._id) {
        toast.error("Invalid payment schedule");
        return;
      }

      // Validate actualPaid amounts are not negative
      for (let i = 0; i < editedValues.milestones.length; i++) {
        const milestone = editedValues.milestones[i];

        if (milestone.actualPaid < 0) {
          toast.error(
            `Actual paid amount for milestone ${i + 1} cannot be negative`,
          );
          return;
        }
      }

      // Validate: Total Project Value must be >= total paid amount
      const totalPaidNow = editedValues.milestones.reduce(
        (sum, m) => sum + (m.actualPaid ?? 0),
        0,
      );
      if (editedValues.projectValue < totalPaidNow) {
        toast.error(
          `Total Project Value (₹${editedValues.projectValue.toLocaleString("en-IN")}) cannot be less than total paid amount (₹${totalPaidNow.toLocaleString("en-IN")})`,
        );
        return;
      }

      // Update project value if changed
      if (editedValues.projectValue !== currentSchedule?.totalProjectValue) {
        await updateProjectValue(
          currentSchedule._id,
          editedValues.projectValue,
        );
      }

      // Update milestone structure if changed (including actualPaid)
      const structureChanged = editedValues.milestones.some(
        (m, i) =>
          m?.timeline !== currentSchedule?.milestones?.[i]?.timeline ||
          m?.percentage !== currentSchedule?.milestones?.[i]?.percentage ||
          m?.actualPaid !== currentSchedule?.milestones?.[i]?.actualPaid,
      );

      if (structureChanged) {
        const milestonesPayload = editedValues.milestones.map((m, i) => ({
          slNo: currentSchedule.milestones[i]?.slNo ?? i + 1,
          timeline: m.timeline,
          percentage: m.percentage,
        }));

        const updatePayments = editedValues.milestones
          .map((m, i) => ({ m, i }))
          .filter(
            ({ m, i }) =>
              m.actualPaid !==
              (currentSchedule?.milestones?.[i]?.actualPaid ?? 0),
          )
          .map(({ m, i }) => ({
            slNo: currentSchedule.milestones[i]?.slNo ?? i + 1,
            actualPaid: m.actualPaid,
            paymentDate: new Date().toISOString().split("T")[0],
          }));

        await updatePaymentStructure(
          currentSchedule._id,
          milestonesPayload,
          updatePayments.length > 0 ? updatePayments : undefined,
        );
      }

      // Update current milestone if changed
      if (editedValues.currentMilestone !== currentSchedule?.currentMilestone) {
        await updateCurrentMilestone(
          currentSchedule._id,
          editedValues.currentMilestone,
        );
      }

      setEditMode(false);
      toast.success("Payment schedule updated successfully");
      fetchScheduleById(projectId);
    } catch (error) {
      toast.error("Failed to update payment schedule");
      console.error("Error updating payment schedule:", error);
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
        <h2 className="text-2xl font-semibold text-gray-800">
          No Schedule Exists
        </h2>
        <p className="text-muted-foreground mb-4">
          The requested payment schedule does not exist.
        </p>
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
                  onClick={() =>
                    navigate(
                      `/admin/projects/${
                        currentSchedule?.projectId?._id ?? ""
                      }/transactions`,
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View Transaction History
                </Button>
              </div>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  totalRemaining === 0
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700",
                )}
              >
                {totalRemaining === 0 ? "Completed" : "In Progress"}
              </div>
            </div>

            {/* Project information */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <span>Payment Schedule</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  <span className="font-mono">
                    #{currentSchedule?._id ?? "N/A"}
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mt-1">
                  {currentSchedule?.projectId?.title ?? "Untitled Project"}
                </h1>
              </div>

              {/* Overall progress */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium">
                    {Math.round(
                      (totalPaid / (currentSchedule?.totalProjectValue ?? 1)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (totalPaid /
                          (currentSchedule?.totalProjectValue ?? 1)) *
                        100
                      }%`,
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
                <label className="text-sm text-muted-foreground">
                  Project Name
                </label>
                <h2 className="text-xl font-semibold">
                  {currentSchedule?.projectId?.title ?? "Untitled Project"}
                </h2>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Total Project Value
                </label>
                <div className="flex items-center gap-4">
                  {editMode ? (
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min={editedValues.milestones.reduce(
                          (sum, m) => sum + (m.actualPaid ?? 0),
                          0,
                        )}
                        step={1000}
                        value={editedValues.projectValue}
                        onChange={(e) =>
                          handleProjectValueChange(e.target.value)
                        }
                        className={cn(
                          "w-64 text-right font-medium",
                          editedValues.projectValue <
                            editedValues.milestones.reduce(
                              (sum, m) => sum + (m.actualPaid ?? 0),
                              0,
                            )
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "",
                        )}
                      />
                      <p className="text-xs text-muted-foreground">
                        Current:{" "}
                        {formatCurrency(currentSchedule?.totalProjectValue)}
                      </p>
                      {editedValues.projectValue <
                        editedValues.milestones.reduce(
                          (sum, m) => sum + (m.actualPaid ?? 0),
                          0,
                        ) && (
                        <p className="text-xs text-red-500">
                          Must be ≥ paid amount (₹
                          {editedValues.milestones
                            .reduce((sum, m) => sum + (m.actualPaid ?? 0), 0)
                            .toLocaleString("en-IN")}
                          )
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-xl font-semibold">
                      {formatCurrency(currentSchedule?.totalProjectValue)}
                    </span>
                  )}
                </div>
              </div>
              {editMode && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    Current Milestone
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32">
                      <Input
                        type="number"
                        min={1}
                        max={currentSchedule?.milestones?.length ?? 1}
                        value={editedValues.currentMilestone}
                        onChange={(e) =>
                          handleCurrentMilestoneUpdate(e.target.value)
                        }
                        className="w-full pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        / {currentSchedule?.milestones?.length ?? 1}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Timeline:</span>{" "}
                      {currentSchedule?.milestones?.find(
                        (m) => m?.slNo === editedValues.currentMilestone,
                      )?.timeline ?? "Invalid milestone"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Payment Status
                </label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      Received
                    </div>
                    <div className="text-xl font-semibold text-green-600">
                      {formatCurrency(
                        editMode
                          ? editedValues.milestones.reduce(
                              (sum, m) => sum + (m.actualPaid ?? 0),
                              0,
                            )
                          : totalPaid,
                      )}
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                    <div className="text-xl font-semibold text-blue-600">
                      {formatCurrency(
                        editMode
                          ? Math.max(
                              0,
                              editedValues.projectValue -
                                editedValues.milestones.reduce(
                                  (sum, m) => sum + (m.actualPaid ?? 0),
                                  0,
                                ),
                            )
                          : totalRemaining,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Table */}
          <div className="mt-8 rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                      Sl No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Payments Timelines and Services
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-24">
                      Percentage
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                      Base Amount
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-36">
                      Carried Over
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                      {editMode ? "Amount" : "Total Due"}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                      Actual Paid
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-32">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentSchedule?.milestones?.map((milestone, index) => (
                    <tr
                      key={milestone?.slNo ?? index}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors",
                        milestone?.slNo === currentSchedule?.currentMilestone &&
                          "bg-red-100 hover:bg-red-100",
                      )}
                    >
                      <td className="px-4 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          {milestone?.slNo ===
                            currentSchedule?.currentMilestone && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                              C
                            </div>
                          )}
                          {milestone?.slNo ?? index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {editMode ? (
                          <textarea
                            value={
                              editedValues.milestones[index]?.timeline ?? ""
                            }
                            onChange={(e) =>
                              handleMilestoneUpdate(
                                index,
                                "timeline",
                                e.target.value,
                              )
                            }
                            className="w-full min-h-[60px] p-2 border border-gray-300 rounded-md resize-none text-sm"
                            rows={3}
                          />
                        ) : (
                          <div className="font-medium break-words leading-relaxed text-sm max-w-xs">
                            {milestone?.timeline ?? "N/A"}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {editMode ? (
                          <Input
                            type="number"
                            value={
                              editedValues.milestones[index]?.percentage ?? 0
                            }
                            onChange={(e) =>
                              handleMilestoneUpdate(
                                index,
                                "percentage",
                                e.target.value,
                              )
                            }
                            className="w-20 text-center mx-auto"
                          />
                        ) : (
                          `${milestone?.percentage ?? 0}%`
                        )}
                      </td>
                      {/* Base Amount */}
                      <td className="px-4 py-4 text-right font-medium">
                        {editMode
                          ? formatCurrency(
                              Math.round(
                                (editedValues.projectValue *
                                  (editedValues.milestones[index]?.percentage ??
                                    0)) /
                                  100,
                              ),
                            )
                          : formatCurrency(
                              milestone?.baseAmount ?? milestone?.amount,
                            )}
                      </td>
                      {/* Carried Over */}
                      <td className="px-4 py-4 text-right">
                        {(() => {
                          const carryover =
                            (milestone?.carriedOverOutstanding ?? 0) > 0
                              ? milestone.carriedOverOutstanding
                              : (milestone?.amount ?? 0) -
                                (milestone?.baseAmount ?? 0);
                          return carryover > 0 ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              {`+${formatCurrency(carryover)}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              ₹ 0
                            </span>
                          );
                        })()}
                      </td>
                      {/* Total Due = baseAmount + carriedOver (view) or just baseAmount (edit) */}
                      <td className="px-4 py-4 text-right font-semibold">
                        {editMode
                          ? formatCurrency(
                              Math.round(
                                (editedValues.projectValue *
                                  (editedValues.milestones[index]?.percentage ??
                                    0)) /
                                  100,
                              ),
                            )
                          : formatCurrency(milestone?.amount)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {editMode ? (
                          <div className="flex flex-col items-end gap-1">
                            <Input
                              type="number"
                              min="0"
                              max={editedValues.milestones[index]?.amount ?? 0}
                              value={
                                editedValues.milestones[index]?.actualPaid ?? 0
                              }
                              onChange={(e) =>
                                handleMilestoneUpdate(
                                  index,
                                  "actualPaid",
                                  e.target.value,
                                )
                              }
                              className="w-32 text-right"
                              placeholder="0"
                            />
                            <span className="text-xs text-muted-foreground">
                              max{" "}
                              {formatCurrency(
                                editedValues.milestones[index]?.amount ?? 0,
                              )}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={cn(
                              "font-medium",
                              (milestone?.actualPaid ?? 0) > 0
                                ? "text-green-600"
                                : "text-muted-foreground",
                            )}
                          >
                            {(milestone?.actualPaid ?? 0) > 0
                              ? formatCurrency(milestone?.actualPaid)
                              : "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {editMode ? (
                          (() => {
                            const amt =
                              editedValues.milestones[index]?.amount ?? 0;
                            const paid =
                              editedValues.milestones[index]?.actualPaid ?? 0;
                            const remaining = Math.max(0, amt - paid);
                            return (
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-sm font-medium",
                                  remaining > 0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700",
                                )}
                              >
                                {remaining > 0
                                  ? formatCurrency(remaining)
                                  : "Paid"}
                              </span>
                            );
                          })()
                        ) : (
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-sm font-medium",
                              (milestone?.toBePaid ?? 0) > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700",
                            )}
                          >
                            {(milestone?.toBePaid ?? 0) > 0
                              ? formatCurrency(milestone?.toBePaid)
                              : "Paid"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {editMode && (
                  <tfoot>
                    <tr className="border-t">
                      <td
                        colSpan={2}
                        className="px-4 py-3 text-right font-medium"
                      >
                        Total Percentage:
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-slate-600">
                          {editedValues.milestones
                            .reduce((sum, m) => sum + (m?.percentage ?? 0), 0)
                            .toFixed(0)}
                          %
                        </span>
                      </td>
                      <td colSpan={5}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Project Value
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        editMode
                          ? editedValues.projectValue
                          : currentSchedule?.totalProjectValue,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Received
                    </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(
                        editMode
                          ? editedValues.milestones.reduce(
                              (sum, m) => sum + (m.actualPaid ?? 0),
                              0,
                            )
                          : totalPaid,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total Remaining
                    </span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(
                        editMode
                          ? Math.max(
                              0,
                              editedValues.projectValue -
                                editedValues.milestones.reduce(
                                  (sum, m) => sum + (m.actualPaid ?? 0),
                                  0,
                                ),
                            )
                          : totalRemaining,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <div className="space-y-4">
                  {!editMode ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => navigate("/admin/payments")}
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
