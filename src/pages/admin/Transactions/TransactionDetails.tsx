import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdminTransactionStore } from "@/store/admin/adminTransaction.store"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function TransactionDetailsModal() {
  const { selectedTransaction, isViewModalOpen, clearSelectedTransaction } = useAdminTransactionStore()
  const navigate = useNavigate()

  const formatCurrency = (amount: string | number) => {
    const numAmount = parseFloat(amount?.toString() || "0")
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numAmount)
  }

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewProject = () => {
    if (selectedTransaction?.projectId?._id) {
      clearSelectedTransaction()
      navigate(`/admin/projects/${selectedTransaction.projectId._id}`)
    }
  }

  return (
    <Dialog open={isViewModalOpen} onOpenChange={() => clearSelectedTransaction()}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information about this transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Transaction ID:</div>
            <div className="col-span-3 font-mono text-sm">
              {selectedTransaction?.transactionId || "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Status:</div>
            <div className="col-span-3">
              {selectedTransaction?.status && getStatusBadge(selectedTransaction.status)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Amount:</div>
            <div className="col-span-3">
              {formatCurrency(selectedTransaction?.amount || 0)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Method:</div>
            <div className="col-span-3">
              {selectedTransaction?.method === 'manual' ? 'Manual' : 'Razorpay'}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">User:</div>
            <div className="col-span-3">
              {selectedTransaction?.userId?.name || "N/A"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Project:</div>
            <div className="col-span-3 flex items-center justify-between">
              <span>{selectedTransaction?.projectId?.title || "N/A"}</span>
              {selectedTransaction?.projectId?._id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewProject}
                  className="ml-2"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Project
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">Paid At:</div>
            <div className="col-span-3">
              {selectedTransaction?.paidAt 
                ? new Date(selectedTransaction.paidAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : "N/A"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}