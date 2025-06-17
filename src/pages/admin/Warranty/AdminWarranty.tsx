import { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Loader2, Filter, Eye } from 'lucide-react';
import { useAdminWarrantyStore, WarrantyClaim } from '../../../store/admin/adminWarranty.store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Input } from '../../../components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import ViewWarrantyClaim from './ViewWarrantyClaim';

const AdminWarranty = () => {
  const { claims = [], loading = false, error = null, filters = {}, fetchClaims, updateClaimStatus, deleteClaim, setFilters } = useAdminWarrantyStore();
  const [searchField, setSearchField] = useState<'name' | 'ticketId'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<WarrantyClaim['status']>('pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if(claims.length === 0){
    fetchClaims();
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ 
      [searchField]: value || undefined,
      [searchField === 'name' ? 'ticketId' : 'name']: undefined // Clear other search field
    });
  };

  const handleSearchFieldChange = (value: 'name' | 'ticketId') => {
    setSearchField(value);
    setSearchQuery(''); // Clear search when switching fields
    setFilters({ 
      name: undefined,
      ticketId: undefined
    });
  };

  const handleStatusFilter = (status: WarrantyClaim['status'] | 'all') => {
    setFilters({ status });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ status: 'all', ticketId: undefined, name: undefined });
  };

  const handleUpdateStatus = async () => {
    if (!selectedClaim) return;
    
    await updateClaimStatus(selectedClaim._id, newStatus, adminNotes);
    setIsUpdateDialogOpen(false);
    setSelectedClaim(null);
    setAdminNotes('');
    toast.success('Warranty claim status updated successfully');
  };

  const handleDelete = async () => {
    if (!selectedClaim) return;
    
    await deleteClaim(selectedClaim._id);
    setIsDeleteDialogOpen(false);
    setSelectedClaim(null);
    toast.success('Warranty claim deleted successfully');
  };

  const getStatusBadgeVariant = (status: WarrantyClaim['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'resolved':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold">Warranty Claims Management</CardTitle>
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Clear Filters
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex gap-2">
              <Select value={searchField} onValueChange={handleSearchFieldChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Customer Name</SelectItem>
                  <SelectItem value="ticketId">Ticket ID</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchQuery ?? ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={`Search by ${searchField === 'name' ? 'customer name' : 'ticket ID'}...`}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <Select value={filters?.status ?? 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : claims?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No warranty claims found.
                    </TableCell>
                  </TableRow>
                ) : (
                  claims?.map((claim) => (
                    <TableRow key={claim?._id ?? Math.random()}>
                      <TableCell className="font-medium">{claim?.ticketId ?? 'N/A'}</TableCell>
                      <TableCell>{claim?.user?.name ?? 'N/A'}</TableCell>
                      <TableCell>{claim?.project ?? 'N/A'}</TableCell>
                      <TableCell>{claim?.item ?? 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(claim?.status ?? 'pending')}>
                          {(claim?.status?.charAt(0)?.toUpperCase() ?? '') + (claim?.status?.slice(1) ?? '')}
                        </Badge>
                      </TableCell>
                      <TableCell>{claim?.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedClaim(claim ?? null);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedClaim(claim ?? null);
                              setNewStatus(claim?.status ?? 'pending');
                              setAdminNotes(claim?.adminNotes ?? '');
                              setIsUpdateDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setSelectedClaim(claim ?? null);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Warranty Claim Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={(value: WarrantyClaim['status']) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes</label>
              <Textarea
                value={adminNotes ?? ''}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about the status change..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Warranty Claim</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this warranty claim? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Warranty Claim Dialog */}
      <ViewWarrantyClaim
        claim={selectedClaim}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
};

export default AdminWarranty;