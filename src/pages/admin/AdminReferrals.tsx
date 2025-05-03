import { useEffect, useState, useCallback } from "react";
import { useAdminReferralsStore } from "../../store/admin/adminReferrals.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Loader2,
  Gift,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Status type definition
const STATUS_TYPES = {
  pending: {
    icon: <Clock className="h-4 w-4 text-yellow-600" />,
    class: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  processing: {
    icon: <Loader2 className="h-4 w-4 text-blue-600" />,
    class: "bg-blue-100 text-blue-800 border-blue-200"
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    class: "bg-green-100 text-green-800 border-green-200"
  },
  rejected: {
    icon: <XCircle className="h-4 w-4 text-red-600" />,
    class: "bg-red-100 text-red-800 border-red-200"
  }
};

// Filter options
const FILTER_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "phone", label: "Phone" },
  { value: "refId", label: "Ref ID" }
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" }
];

const AdminReferrals = () => {
  const {
    referrals,
    error,
    loading,
    pagination,
    fetchReferrals,
    updateReferralStatus,
    updateRewardMessage,
  } = useAdminReferralsStore();
  
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filterType, setFilterType] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");
  const [rewardDialog, setRewardDialog] = useState({
    open: false,
    referralId: "",
    currentMessage: "",
  });

  // Fetch referrals on initial load
  useEffect(() => {
    if(referrals.length === 0){
    fetchReferrals();
    }
  }, []);

  // Debounced search handling
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filters = {};

      if (searchQuery) {
        filters[filterType] = searchQuery;
      }
      if (statusFilter) {
        filters['status'] = statusFilter;
      }
        fetchReferrals(1, filters);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter]);

  // Status update handler with memoization
  const handleStatusUpdate = useCallback(async (referralId, newStatus) => {
    setUpdatingId(referralId);
    try {
      await updateReferralStatus(referralId, newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }, [updateReferralStatus]);

  // Reward message handler
  const handleRewardMessageUpdate = useCallback(async () => {
    setUpdatingId(rewardDialog.referralId);
    try {
      await updateRewardMessage(
        rewardDialog.referralId,
        rewardDialog.currentMessage
      );
      toast.success("Reward message updated successfully");
      setRewardDialog({ open: false, referralId: "", currentMessage: "" });
    } catch (error) {
      toast.error("Failed to update reward message");
    } finally {
      setUpdatingId(null);
    }
  }, [rewardDialog, updateRewardMessage]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    fetchReferrals(1, {});
  }, [fetchReferrals]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    const filters = {};
    if (searchQuery) filters[filterType] = searchQuery;
    if (statusFilter) filters.status = statusFilter;
    
    fetchReferrals(newPage, filters);
  }, [fetchReferrals, searchQuery, filterType, statusFilter]);

  // Open reward dialog
  const openRewardDialog = useCallback((referralId, currentMessage) => {
    setRewardDialog({
      open: true,
      referralId,
      currentMessage: currentMessage || ""
    });
  }, []);

  // Format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Referrals Dashboard
        </CardTitle>
        <CardDescription>
          Manage and track all referrals in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={`Search by ${filterType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={loading}
              className="whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Filter className="h-4 w-4 mr-2" />
              )}
              Reset
            </Button>
          </div>
        </div>

        {/* Table content */}
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Ref ID</TableHead>
                <TableHead className="font-semibold">Referred By</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="py-8 flex flex-col items-center gap-3 text-center text-gray-500">
                      <XCircle className="h-8 w-8 text-red-400" />
                      <p>{error}</p>
                      <Button onClick={() => fetchReferrals()}>
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="py-12 flex flex-col items-center gap-3 text-center text-gray-500">
                      <XCircle className="h-10 w-10 text-gray-300" />
                      <p className="text-lg">
                        {searchQuery || statusFilter
                          ? "No referrals found matching your search."
                          : "No referrals available yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((ref) => (
                  <TableRow
                    key={ref._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {ref.referralName}
                    </TableCell>
                    <TableCell>{ref.referralEmail}</TableCell>
                    <TableCell>{ref.referralPhone}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-gray-600">
                        {ref.refId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="cursor-pointer hover:underline">
                            {ref.referredBy.name}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold">
                              {ref.referredBy.name}
                            </h4>
                            <div className="text-sm space-y-1">
                              <p>Email: {ref.referredBy.email}</p>
                              <p>Phone: {ref.referredBy.phone}</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {STATUS_TYPES[ref.status]?.icon}
                        <Badge variant="outline" className={STATUS_TYPES[ref.status]?.class}>
                          {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(ref.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={updatingId === ref._id}
                          >
                            {updatingId === ref._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(ref._id, "pending")}
                            className="flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(ref._id, "processing")}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="h-4 w-4" />
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(ref._id, "completed")}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(ref._id, "rejected")}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openRewardDialog(ref._id, ref.rewardMessage)}
                            className="flex items-center gap-2"
                          >
                            <Gift className="h-4 w-4" />
                            Set Reward Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && !error && referrals.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">
              Showing {referrals.length} of {pagination.totalRecords} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Reward Message Dialog */}
      <Dialog
        open={rewardDialog.open}
        onOpenChange={(open) => !open && setRewardDialog({ open: false, referralId: "", currentMessage: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Reward Message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reward message..."
              value={rewardDialog.currentMessage}
              onChange={(e) => setRewardDialog({
                ...rewardDialog,
                currentMessage: e.target.value,
              })}
              className="min-h-[120px]"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRewardDialog({ open: false, referralId: "", currentMessage: "" })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRewardMessageUpdate}
              disabled={!rewardDialog.currentMessage.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminReferrals;