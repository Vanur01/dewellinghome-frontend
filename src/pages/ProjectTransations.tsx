import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransactionStore } from "@/store/transaction.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, MoreHorizontal, Pencil, Eye } from "lucide-react";
import { formatDateToLocal, formatPrice } from "@/lib/utils";
import TransactionViewModal from "@/components/modals/TransactionViewModal";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTransactionModal from "@/pages/admin/Transactions/EditTransactionModal";

const ProjectTransactions = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const {
    transactions,
    pagination,
    loading,
    error,
    getProjectTransactions,
    getTransactionById,
    selectedTransaction,
    isViewModalOpen,
    clearSelectedTransaction,
    updateTransaction,
  } = useTransactionStore();

  useEffect(() => {
    if (id) {
      getProjectTransactions(id, {
        page: currentPage,
        limit: 10,
        status: status === "all" ? undefined : status,
      });
    }
  }, [id, currentPage, status, getProjectTransactions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleViewTransaction = (transactionId: string) => {
    getTransactionById(transactionId);
  };

  const handleEditClick = (transaction) => {
    setEditTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (amount) => {
    if (!editTransaction) return;
    await updateTransaction(editTransaction._id, amount);
    setEditModalOpen(false);
    setEditTransaction(null);
    // Refresh the list
    if (id) {
      getProjectTransactions(id, {
        page: currentPage,
        limit: 10,
        status: status === "all" ? undefined : status,
      });
    }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditTransaction(null);
  };

  if (!id) {
    return <div className="p-4 text-red-500">Project ID is required</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <CardTitle>Project Transactions</CardTitle>
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center h-32 text-muted-foreground"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="font-medium">
                            {transaction.razorpay_payment_id ?? "N/A"}
                          </TableCell>
                          <TableCell>
                            {formatPrice(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.method === 'manual' ? 'Manual' : 'Razorpay'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getStatusBadgeColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDateToLocal(new Date().toISOString())}
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
                                <DropdownMenuItem onClick={() => handleViewTransaction(transaction._id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {/* Only show edit for admin and manual transactions */}
                                {transaction.method === 'manual' && (
                                  <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Amount
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {transactions.length > 0 && pagination && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalTransactions
                    )}{" "}
                    of {pagination.totalTransactions} transactions
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.currentPage > 1) {
                              handlePageChange(pagination.currentPage - 1);
                            }
                          }}
                          className={
                            pagination.currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {/* First Page */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                          isActive={pagination.currentPage === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>

                      {/* Show ellipsis if there are pages before current page */}
                      {pagination.currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Current page neighborhood */}
                      {pagination.currentPage > 2 &&
                        pagination.currentPage < pagination.totalPages && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pagination.currentPage);
                              }}
                              isActive={true}
                            >
                              {pagination.currentPage}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                      {/* Show ellipsis if there are more pages */}
                      {pagination.currentPage < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      {/* Last Page */}
                      {pagination.totalPages > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pagination.totalPages);
                            }}
                            isActive={pagination.currentPage === pagination.totalPages}
                          >
                            {pagination.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.currentPage < pagination.totalPages) {
                              handlePageChange(pagination.currentPage + 1);
                            }
                          }}
                          className={
                            pagination.currentPage === pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionViewModal
          open={isViewModalOpen}
          onClose={clearSelectedTransaction}
          transaction={selectedTransaction}
        />
      )}
      <EditTransactionModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        transaction={editTransaction}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default ProjectTransactions;