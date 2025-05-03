import { useEffect, useState } from "react";
import { useInquiryStore } from "../../../store/admin/adminInquiry.store";
import { Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerInquiry } from "../../../store/admin/adminInquiry.store";

type InquiryStatus = "new" | "contacted" | "converted" | "closed";

const Inquiries = () => {
  const navigate = useNavigate();
  const {
    inquiries,
    loading,
    error,
    pagination,
    fetchInquiries,
    updateInquiryStatus,
  } = useInquiryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"name" | "email" | "phone">("name");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all" | "">("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Single useEffect for handling both initial load and filter changes
  useEffect(() => {
    const filters: Record<string, string> = {};

    if (searchQuery && searchField) {
      filters[searchField] = searchQuery;
    }

    if (statusFilter) {
      filters.status = statusFilter;
    }

    if (isInitialLoad && inquiries.length === 0) {
      // Initial load - just do it once
      fetchInquiries(1, pagination.limit, filters);
      setIsInitialLoad(false);
    } else {
      // For filter changes, apply debounce
      const delayDebounceFn = setTimeout(() => {
          fetchInquiries(1, pagination.limit, filters);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, statusFilter, isInitialLoad]);

  const handlePageChange = (newPage: number) => {
    const filters: Record<string, string> = {};

    if (searchQuery && searchField) {
      filters[searchField] = searchQuery;
    }

    if (statusFilter) {
      filters.status = statusFilter;
    }

    fetchInquiries(newPage, pagination.limit, filters);
  };

  const handleRefresh = () => {
    const filters: Record<string, string> = {};

    if (searchQuery && searchField) {
      filters[searchField] = searchQuery;
    }

    if (statusFilter) {
      filters.status = statusFilter;
    }

    fetchInquiries(pagination.currentPage, pagination.limit, filters);
  };

  const handleStatusUpdate = async (
    inquiryId: string,
    status: InquiryStatus
  ) => {
    await updateInquiryStatus(inquiryId, status);
  };

  const handleViewDetails = (inquiry: CustomerInquiry) => {
    navigate(`/admin/inquiries/${inquiry._id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Customer Inquiries</h1>
          <div className="flex gap-4 flex-wrap">
            <Select
              value={searchField}
              onValueChange={(value) =>
                setSearchField(value as "name" | "email" | "phone")
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Search by ${searchField}...`}
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as InquiryStatus | "all" | "")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin w-6 h-6" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-10 space-y-2">
                    <div className="text-red-500">{error}</div>
                    <Button onClick={handleRefresh} size="sm">
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex justify-center items-center py-10 text-gray-500">
                    No inquiries found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{`${inquiry.countryCode} ${inquiry.phone}`}</TableCell>
                  <TableCell>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(inquiry._id, value as InquiryStatus)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inquiry)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {!loading && !error && inquiries.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalRecords
              )}{" "}
              of {pagination.totalRecords} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Inquiries;
