import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminPaymentStore } from '@/store/admin/adminPayment.store';
import type { PaymentSchedule } from '@/store/admin/adminPayment.store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { format } from 'date-fns';

export default function AdminPayment() {
  const navigate = useNavigate();
  const {
    paymentSchedules,
    loading,
    error,
    fetchAllSchedules,
  } = useAdminPaymentStore();

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const getPaymentStatus = (schedule: PaymentSchedule) => {
    if (schedule.totalRemaining === 0) return 'completed';
    if (schedule.totalPaid > 0) return 'partial';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className='text-xl mb-3'>Payment Management</CardTitle>
              <CardDescription>
                Manage and track all project payments
              </CardDescription>
            </div>
            <Button className='bg-red-500 hover:bg-red-600' onClick={() => navigate('/admin/payments/new')}>
              <Plus className="h-4 w-4 mr-2" />
              New Payment Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentSchedules.map((schedule) => (
                <TableRow key={schedule._id}>
                  <TableCell className="font-medium">
                    {schedule.projectId.title}
                  </TableCell>
                  <TableCell>
                    {schedule.projectId.clientId.name}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(schedule.totalProjectValue)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(schedule.totalPaid)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(schedule.totalRemaining)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(schedule.lastUpdated), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(getPaymentStatus(schedule)) + ' text-white'}
                    >
                      {getPaymentStatus(schedule)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/payments/${schedule._id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paymentSchedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No payment schedules found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
