import React, { useEffect, useState, useCallback, useMemo } from 'react';
import usePartnerStore from '@/store/admin/adminPartner.store';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'sonner';
import { Partner } from '@/utils/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface PartnerFormData {
  name: string;
  logo: File | null;
  isActive: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 2;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

// Utility functions
const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be less than 5MB';
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, SVG, WebP)';
  }
  return null;
};

const sanitizeName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9\s\-&.,]/g, '').trim();
};

// Partner Item Component
interface PartnerItemProps {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (partner: Partner) => void;
  isUpdating?: boolean;
}

const PartnerItem: React.FC<PartnerItemProps> = React.memo(({
  partner,
  onEdit,
  onDelete,
  onToggleStatus,
  isUpdating = false,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
      <CardContent className="p-0">
        <div className="relative">
          {/* Partner Logo */}
          <div className="aspect-video w-full relative overflow-hidden">
            {!imageError ? (
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <span className="text-sm">Image not available</span>
              </div>
            )}
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(partner)}
                disabled={isUpdating}
                className="text-white hover:text-white hover:bg-white/20 transition-all duration-200"
                aria-label={`Edit ${partner.name}`}
              >
                <FiEdit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isUpdating}
                className="text-white hover:text-white hover:bg-white/20 transition-all duration-200"
                aria-label={`Delete ${partner.name}`}
              >
                <FiTrash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus(partner)}
                disabled={isUpdating}
                className="text-white hover:text-white hover:bg-white/20 transition-all duration-200"
                aria-label={`${partner.isActive ? 'Deactivate' : 'Activate'} ${partner.name}`}
              >
                {partner.isActive ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Partner Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 truncate" title={partner.name}>
              {partner.name}
            </h3>
            <div className="flex items-center justify-between">
              <Badge 
                variant={partner.isActive ? "default" : "secondary"}
                className={`transition-colors duration-200 ${
                  partner.isActive
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {partner.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-xs text-gray-500">
                ID: {partner._id.slice(-6)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{partner.name}"? This action cannot be undone and will remove all data associated with this partner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(partner._id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
});

PartnerItem.displayName = 'PartnerItem';

const AdminPartners: React.FC = () => {
  const { 
    partners = [], 
    loading = false, 
    error = null,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    selectedPartner = null,
    setSelectedPartner
  } = usePartnerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    logo: null,
    isActive: true
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Memoized filtered partners
  const filteredPartners = useMemo(() => {
    return partners?.filter(partner => {
      const matchesSearch = partner?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? '');
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'active' && partner?.isActive) ||
        (filterStatus === 'inactive' && !partner?.isActive);
      
      return matchesSearch && matchesFilter;
    }) ?? [];
  }, [partners, searchTerm, filterStatus]);

  // Stats
  const stats = useMemo(() => ({
    active: partners?.filter(p => p?.isActive)?.length ?? 0,
    inactive: partners?.filter(p => !p?.isActive)?.length ?? 0,
    total: partners?.length ?? 0
  }), [partners]);

  useEffect(() => {
    if (partners?.length === 0) {
      fetchPartners();
    }
  }, [fetchPartners, partners]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'name') {
      const sanitizedValue = sanitizeName(value ?? '');
      if (sanitizedValue.length > MAX_NAME_LENGTH) {
        toast.error(`Partner name cannot exceed ${MAX_NAME_LENGTH} characters`);
        return;
      }
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Cleanup previous preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData(prev => ({ ...prev, logo: file }));
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const validateForm = (): boolean => {
    const trimmedName = formData?.name?.trim() ?? '';
    
    if (!trimmedName) {
      toast.error('Partner name is required');
      return false;
    }

    if (trimmedName.length < MIN_NAME_LENGTH) {
      toast.error(`Partner name must be at least ${MIN_NAME_LENGTH} characters long`);
      return false;
    }

    if (!selectedPartner && !formData?.logo) {
      toast.error('Partner logo is required');
      return false;
    }

    // Check for duplicate names (excluding current partner when editing)
    const isDuplicate = partners?.some(partner => 
      partner?.name?.toLowerCase() === trimmedName.toLowerCase() &&
      partner?._id !== selectedPartner?._id
    );

    if (isDuplicate) {
      toast.error('A partner with this name already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData?.name?.trim() ?? '');
    if (formData?.logo) {
      submitData.append('logo', formData.logo);
    }
    submitData.append('isActive', String(formData?.isActive ?? true));

    try {
      if (selectedPartner?._id) {
        await updatePartner(selectedPartner._id, submitData);
        toast.success('Partner updated successfully');
      } else {
        await createPartner(submitData);
        toast.success('Partner created successfully');
      }
      handleCloseModal();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message ?? 'An unexpected error occurred';
      toast.error(selectedPartner ? `Failed to update partner: ${errorMessage}` : `Failed to create partner: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setFormData({
      name: partner?.name ?? '',
      logo: null,
      isActive: partner?.isActive ?? true
    });
    setPreviewUrl(partner?.logo ?? '');
    setIsModalOpen(true);
  }, [setSelectedPartner]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deletePartner(id);
      toast.success('Partner deleted successfully');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message ?? 'An unexpected error occurred';
      toast.error(`Failed to delete partner: ${errorMessage}`);
    }
  }, [deletePartner]);

  const handleToggleStatus = useCallback(async (partner: Partner) => {
    try {
      const formData = new FormData();
      formData.append('name', partner?.name ?? '');
      formData.append('isActive', String(!partner?.isActive));
      
      await updatePartner(partner?._id ?? '', formData);
      toast.success(`Partner ${!partner?.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError?.response?.data?.message ?? 'An unexpected error occurred';
      toast.error(`Failed to update partner status: ${errorMessage}`);
    }
  }, [updatePartner]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPartner(null);
    setFormData({ name: '', logo: null, isActive: true });
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setIsSubmitting(false);
  }, [previewUrl, setSelectedPartner]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <Button 
              onClick={fetchPartners}
              variant="destructive"
              className="transition-all duration-200 hover:scale-105"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trusted Partners</h1>
          <p className="text-gray-600 mt-1">
            Manage your trusted partners ({stats?.total ?? 0} total)
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105"
            >
              <FiPlus className="mr-2 h-4 w-4" /> Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedPartner ? 'Edit Partner' : 'Add New Partner'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData?.name ?? ''}
                  onChange={handleInputChange}
                  placeholder="Enter partner name"
                  required
                  disabled={isSubmitting}
                  className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-500">
                  {(formData?.name?.length ?? 0)}/{MAX_NAME_LENGTH} characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">
                  Partner Logo {!selectedPartner && '*'}
                </Label>
                <Input
                  id="logo"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleFileChange}
                  required={!selectedPartner}
                  disabled={isSubmitting}
                  className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-500">
                  Max file size: 5MB. Supported formats: JPEG, PNG, SVG, WebP
                </p>
                {previewUrl && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-24 object-contain mx-auto border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData?.isActive ?? true}
                  disabled={isSubmitting}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive">Active (visible to users)</Label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="transition-all duration-200 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? 
                    (selectedPartner ? 'Updating...' : 'Creating...') : 
                    (selectedPartner ? 'Update Partner' : 'Create Partner')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search partners..."
            value={searchTerm ?? ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <FiFilter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <CardTitle className="text-sm font-medium text-blue-800 mb-2">
              Total Partners
            </CardTitle>
            <p className="text-2xl font-bold text-blue-900">
              {stats?.total ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <CardTitle className="text-sm font-medium text-green-800 mb-2">
              Active Partners
            </CardTitle>
            <p className="text-2xl font-bold text-green-900">
              {stats?.active ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <CardTitle className="text-sm font-medium text-red-800 mb-2">
              Inactive Partners
            </CardTitle>
            <p className="text-2xl font-bold text-red-900">
              {stats?.inactive ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partners Grid */}
      {filteredPartners?.length === 0 ? (
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-12 text-center">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <FiFilter className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No partners found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  variant="outline"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <FiPlus className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No partners yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first trusted partner</p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105"
                >
                  Add First Partner
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners?.map((partner) => (
            <PartnerItem
              key={partner?._id ?? Math.random()}
              partner={partner}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              isUpdating={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPartners;