"use client"

import { useEffect, useState } from "react"
import { useAdminTransactionStore } from "@/store/admin/adminTransaction.store"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Search, 
  FileText, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionDetailsModal } from './TransactionDetails'
import EditTransactionModal from './EditTransactionModal';

export default function AdminTransactionsTable() {
  const [filterValue, setFilterValue] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  
  const { 
    transactions = [], 
    pagination = { currentPage: 1, totalPages: 1, totalItems: 0 }, 
    loading = false, 
    getAllTransactions,
    setSelectedTransaction,
    editTransaction: editTransactionApi
  } = useAdminTransactionStore();

  // Initial data load
  useEffect(() => {
    getAllTransactions({
      page: 1,
      limit: 10
    })
  }, [getAllTransactions])

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAllTransactions({
        page: 1,
        limit: 10,
        paymentId: filterValue || undefined
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [filterValue, getAllTransactions])

  const handlePageChange = (page: number) => {
    getAllTransactions({
      page,
      limit: 10,
      paymentId: filterValue || undefined
    })
  }

  const handleFilterChange = (value: string) => {
    setFilterValue(value)
  }

  const formatCurrency = (amount: string | number | undefined) => {
    const numAmount = parseFloat(amount?.toString() ?? "0")
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numAmount)
  }

  const getStatusBadge = (status: string | undefined) => {
    switch(status?.toLowerCase() ?? '') {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>
      default:
        return <Badge variant="outline">{status ?? 'Unknown'}</Badge>
    }
  }

  const handleEditClick = (transaction) => {
    setEditTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (amount) => {
    if (!editTransaction) return;
    await editTransactionApi(editTransaction._id, amount);
    setEditModalOpen(false);
    setEditTransaction(null);
    // Optionally refresh the list
    const limit = typeof (pagination as { limit?: number }).limit === 'number' ? (pagination as { limit: number }).limit : 10;
    getAllTransactions({
      page: pagination.currentPage,
      limit,
      paymentId: filterValue || undefined
    });
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditTransaction(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Manage payment transactions for all users and projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by payment ID..."
                value={filterValue}
                onChange={(event) => handleFilterChange(event.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Paid At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                        <span className="ml-2">Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions?.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction?._id ?? Math.random()} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {transaction?.razorpay_payment_id ?? 'N/A'}
                      </TableCell>
                      <TableCell>{transaction?.userId?.name ?? "N/A"}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={transaction?.projectId?.title ?? "N/A"}>
                        {transaction?.projectId?.title ?? "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction?.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction?.status)}
                      </TableCell>
                      <TableCell>
                        {transaction?.method === 'manual' ? 'Manual' : 'Razorpay'}
                      </TableCell>
                      <TableCell>
                        {transaction?.paidAt ? new Date(transaction.paidAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => navigator.clipboard.writeText(transaction?.razorpay_payment_id ?? "")}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => transaction && setSelectedTransaction(transaction)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                           {transaction?.method === 'manual' && (
                             <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                               <span className="mr-2">✏️</span>
                               Edit amount
                             </DropdownMenuItem>
                           )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p>No transactions found</p>
                        {filterValue && (
                          <p className="text-sm">Try adjusting your filter</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((pagination?.currentPage ?? 1) - 1)}
                disabled={(pagination?.currentPage ?? 1) <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Page</span>
                <span className="text-sm font-medium">{pagination?.currentPage ?? 1}</span>
                <span className="text-sm text-muted-foreground">of</span>
                <span className="text-sm font-medium">{pagination?.totalPages ?? 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((pagination?.currentPage ?? 1) + 1)}
                disabled={(pagination?.currentPage ?? 1) >= (pagination?.totalPages ?? 1) || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <TransactionDetailsModal />
      <EditTransactionModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        transaction={editTransaction}
        onSubmit={handleEditSubmit}
      />
    </Card>
  )
}