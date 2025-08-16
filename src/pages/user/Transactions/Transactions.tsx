import { useEffect, useState } from "react";
import { useUserTransactionStore } from "../../../store/user/TransactionStore";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Loader2, Eye } from "lucide-react";
import { ViewTransaction } from './ViewTransaction';

export default function Transactions() {
  const { transactions, isLoading, total, page, limit, getUserTransactions } = useUserTransactionStore();
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = (pageNum = page ?? 1) => {
    getUserTransactions({
      page: pageNum,
      limit: limit ?? 10,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Paid On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading transactions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions?.length ? (
                  transactions?.map((transaction) => (
                    <TableRow 
                      key={transaction?._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell>{transaction?.transactionId}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(transaction?.amount ?? 0)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            {
                              'success': 'bg-green-100 text-green-800',
                              'processing': 'bg-yellow-100 text-yellow-800',
                              'failed': 'bg-red-100 text-red-800'
                            }[transaction?.status?.toLowerCase() ?? 'processing']
                          }`}
                        >
                          {(transaction?.status?.charAt(0)?.toUpperCase() ?? '') +
                            (transaction?.status?.slice(1) ?? '')}
                        </span>
                      </TableCell>
                      <TableCell>{transaction?.method}</TableCell>
                      <TableCell>
                        {format(new Date(transaction?.paidAt ?? ''), "PPP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedTransactionId(transaction?._id ?? null)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <span className="text-sm text-muted-foreground">
              Page {page ?? 1} of {Math.ceil((total ?? 0) / (limit ?? 10))}
            </span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTransactions((page ?? 1) - 1)}
                disabled={(page ?? 1) === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTransactions((page ?? 1) + 1)}
                disabled={((page ?? 1) * (limit ?? 10)) >= (total ?? 0) || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTransactionId && (
        <ViewTransaction
          isOpen={!!selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
          transactionId={selectedTransactionId}
        />
      )}
    </div>
  );
}
