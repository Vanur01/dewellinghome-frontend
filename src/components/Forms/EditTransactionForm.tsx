"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building, User, Calendar } from "lucide-react"
import { UpdateTransactionData, Transaction } from "@/api/types"

interface EditTransactionFormProps {
  initialData: Transaction;
  onSubmit: (data: UpdateTransactionData) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export default function EditTransactionForm({
  initialData,
  onSubmit,
  loading,
  onCancel
}: EditTransactionFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    paymentReference: "",
    notes: "",
    paidAt: "",
  })

  // Initialize form data from the transaction
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        method: initialData.method,
        paymentReference: initialData.paymentReference || "",
        notes: initialData.notes || "",
        paidAt: initialData.paidAt ? new Date(initialData.paidAt).toISOString().split('T')[0] : "",
      })
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.method) {
      alert("Please fill in all required fields")
      return
    }

    const updateData: UpdateTransactionData = {
      amount: parseFloat(formData.amount),
      method: formData.method as "cash" | "cheque" | "upi" | "bank_transfer" | "other",
      paymentReference: formData.paymentReference || undefined,
      notes: formData.notes || undefined,
      paidAt: formData.paidAt || undefined,
    }
    
    await onSubmit(updateData)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Transaction Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Transaction Information
          </CardTitle>
          <CardDescription>
            View the project and client details for this transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Transaction ID */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">Transaction ID</span>
            </div>
            <div className="text-lg font-mono">{initialData.transactionId}</div>
          </div>

          {/* Project Information */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <Building className="h-4 w-4 mr-2" />
              <span className="font-medium">Project</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Title:</strong> {initialData.projectId.title}</div>
              <div className="text-muted-foreground">Project cannot be changed when editing</div>
            </div>
          </div>

          {/* Client Information */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">Client</span>
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {initialData.userId.name}</div>
              <div><strong>Email:</strong> {initialData.userId.email}</div>
              <div><strong>Phone:</strong> {initialData.userId.phone}</div>
            </div>
          </div>

          {/* Transaction Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  initialData.status === 'success' ? 'bg-green-100 text-green-800' :
                  initialData.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {initialData.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Verified:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  initialData.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {initialData.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              {initialData.recordedBy && (
                <div className="text-sm text-muted-foreground">
                  <strong>Recorded by:</strong> {initialData.recordedBy.name}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Transaction Details</CardTitle>
          <CardDescription>
            Modify the payment details for this transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => handleInputChange("method", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Payment Reference</Label>
              <Input
                id="paymentReference"
                placeholder="Reference number, cheque number, UPI ID, etc."
                value={formData.paymentReference}
                onChange={(e) => handleInputChange("paymentReference", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidAt">Payment Date</Label>
              <Input
                id="paidAt"
                type="date"
                value={formData.paidAt}
                onChange={(e) => handleInputChange("paidAt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this payment..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            {/* Razorpay specific fields (if applicable) */}
            {initialData.razorpay_order_id && (
              <div className="space-y-2">
                <Label>Razorpay Details</Label>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <div><strong>Order ID:</strong> {initialData.razorpay_order_id}</div>
                  {initialData.razorpay_payment_id && (
                    <div><strong>Payment ID:</strong> {initialData.razorpay_payment_id}</div>
                  )}
                  <div className="text-muted-foreground">
                    Razorpay details cannot be modified
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Updating..." : "Update Transaction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
