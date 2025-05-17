import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle, Phone, Mail, Calendar as CalendarIcon, ImagePlus, X } from 'lucide-react';
import { useProjectStore } from '@/store/admin/adminProject.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { userApi } from '@/utils/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface User {
  _id: string;
  name:string;
  email: string;
  phone: string;
}

interface SearchPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'designing', label: 'Designing' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const DEBOUNCE_DELAY = 300;

interface ProjectFormData {
  title: string;
  location: string;
  status: 'planning' | 'designing' | 'in_progress' | 'completed' | 'on_hold';
  startDate: Date | null;
  estimatedEndDate: Date | null;
  budget: string;
  notes: string;
  items: {
    category: string;
    name: string;
    units: number;
    size: string;
    materials: string;
    notes?: string;
  }[];
  gallery: File[];
}

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();

  // Phase states
  const [currentPhase, setCurrentPhase] = useState<'select-client' | 'project-details'>('select-client');
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Client search states
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPagination, setSearchPagination] = useState<SearchPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Project details state with validation
  const [projectDetails, setProjectDetails] = useState<ProjectFormData>({
    title: '',
    location: '',
    status: 'planning',
    startDate: new Date(),
    estimatedEndDate: new Date(),
    budget: '',
    notes: '',
    items: [],
    gallery: []
  });

  // Preview URLs for uploaded images
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Add new state for managing new item form
  const [newItem, setNewItem] = useState({
    category: '',
    name: '',
    units: 0,
    size: '',
    materials: '',
    notes: ''
  });

  // Form validation states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial user list
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (name: string, phone: string, page = 1) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (name || phone) {
            handleSearch(name, phone, page);
          } else {
            fetchUsers(page);
          }
        }, DEBOUNCE_DELAY);
      };
    })(),
    []
  );

  // Effect to trigger search when inputs change
  useEffect(() => {
    debouncedSearch(searchName, searchPhone, 1);
  }, [searchName, searchPhone, debouncedSearch]);

  const fetchUsers = async (page: number) => {
    try {
      setSearching(true);
      setSearchError(null);
      const response = await userApi.getAllUsers({
        page,
        limit: 10,
        name: '',
        email: '',
        phone: ''
      });
      setSearchResults(response.data.data.users);
      setSearchPagination(response.data.data.pagination);
    } catch (err) {
      console.error('Fetch users error:', err);
      setSearchError('Failed to fetch users. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (name: string, phone: string, page = 1) => {
    try {
      setSearching(true);
      setSearchError(null);

      // If both name and phone are provided, use the search endpoint
      if (name && phone) {
        const response = await userApi.searchUser({
          page,
          limit: 10,
          name,
          phone,
        });
        setSearchResults(response.data.data.users);
        setSearchPagination(response.data.data.pagination);
      } 
      // If only one field is provided, use getAllUsers with filter
      else {
        const response = await userApi.getAllUsers({
          page,
          limit: 10,
          name: name || '',
          email: '',
          phone: phone || ''
        });
        setSearchResults(response.data.data.users);
        setSearchPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Failed to search users. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Function to add new item
  const handleAddItem = () => {
    if (!newItem.category || !newItem.name || !newItem.size || !newItem.materials) {
      toast.error('Please fill in all required fields for the item');
      return;
    }

    setProjectDetails(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem }]
    }));

    // Reset new item form
    setNewItem({
      category: '',
      name: '',
      units: 0,
      size: '',
      materials: '',
      notes: ''
    });
  };

  // Function to remove item
  const handleRemoveItem = (index: number) => {
    setProjectDetails(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert FileList to Array and filter for images
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (newFiles.length + projectDetails.gallery.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // Create preview URLs for new files
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setProjectDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...newFiles]
    }));
    
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Remove image from gallery
  const handleRemoveImage = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setProjectDetails(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateProjectDetails = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!projectDetails.title.trim()) {
      errors.title = 'Project title is required';
    }
    
    if (!projectDetails.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!projectDetails.budget || Number(projectDetails.budget) <= 0) {
      errors.budget = 'Valid budget amount is required';
    }

    if (!projectDetails.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!projectDetails.estimatedEndDate) {
      errors.estimatedEndDate = 'End date is required';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (projectDetails.startDate && projectDetails.startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }

    if (projectDetails.startDate && projectDetails.estimatedEndDate && 
        projectDetails.estimatedEndDate <= projectDetails.startDate) {
      errors.estimatedEndDate = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProject = async () => {
    if (!selectedClient || !projectDetails.startDate || !projectDetails.estimatedEndDate) return;

    try {
      setIsSubmitting(true);

      // Create FormData instance
      const formData = new FormData();

      // Add project details
      formData.append('clientId', selectedClient._id);
      formData.append('title', projectDetails.title);
      formData.append('location', projectDetails.location);
      formData.append('status', projectDetails.status);
      formData.append('budget', projectDetails.budget.toString());
      formData.append('startDate', projectDetails.startDate.toISOString());
      formData.append('estimatedEndDate', projectDetails.estimatedEndDate.toISOString());
      formData.append('notes', projectDetails.notes);
      formData.append('items', JSON.stringify(projectDetails.items));

      // Add images if any
      projectDetails.gallery.forEach((file) => {
        formData.append('images', file);
      });

      
      // Cleanup preview URLs
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      
      toast.success('Project created successfully');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Create project error:', err);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleProjectSubmit = () => {
    if (validateProjectDetails()) {
      setShowConfirmDialog(true);
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  // Helper function to format dates
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select a date';
    return format(date, "PPP");
  };

  if (currentPhase === 'select-client') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/projects')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>
                  Search for a client by name or phone number to create a project
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Search by phone number..."
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                </div>
              </div>

              {searchError && (
                <p className="text-sm text-red-500 mt-2">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  {searchError}
                </p>
              )}

              {searching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              )}

              {!searching && searchResults.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  No clients found{searchName || searchPhone ? ' matching your search criteria' : ''}.
                </p>
              )}

              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {searchName || searchPhone ? 'Search Results' : 'All Clients'}
                  </h3>
                  <div className="space-y-4">
                    {searchResults.map((client) => (
                      <Card 
                        key={client._id} 
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                        onClick={() => {
                          setSelectedClient(client);
                          setCurrentPhase('project-details');
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-gray-500">{client.email}</p>
                              <p className="text-sm text-gray-500">{client.phone}</p>
                            </div>
                            <Button variant="outline">Select</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {searchPagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        disabled={searchPagination.currentPage === 1 || searching}
                        onClick={() => {
                          if (searchName || searchPhone) {
                            handleSearch(searchName, searchPhone, searchPagination.currentPage - 1);
                          } else {
                            fetchUsers(searchPagination.currentPage - 1);
                          }
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={searchPagination.currentPage >= searchPagination.totalPages || searching}
                        onClick={() => {
                          if (searchName || searchPhone) {
                            handleSearch(searchName, searchPhone, searchPagination.currentPage + 1);
                          } else {
                            fetchUsers(searchPagination.currentPage + 1);
                          }
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPhase('select-client')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Create New Project</CardTitle>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <h3 className="font-medium text-sm text-gray-600">Selected Client</h3>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium">{selectedClient?.name}</p>
              <div className="space-y-0.5 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {selectedClient?.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {selectedClient?.email}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Basic Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={projectDetails.title}
                    onChange={(e) => setProjectDetails({ ...projectDetails, title: e.target.value })}
                    required
                    className={`mt-1.5 ${formErrors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter project title"
                  />
                  {formErrors.title && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={projectDetails.location}
                    onChange={(e) => setProjectDetails({ ...projectDetails, location: e.target.value })}
                    required
                    className={`mt-1.5 ${formErrors.location ? 'border-red-500' : ''}`}
                    placeholder="Enter project location"
                  />
                  {formErrors.location && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Timeline and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline & Status</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Project Status</Label>
                  <Select
                    value={projectDetails.status}
                    onValueChange={(value: typeof projectDetails.status) => 
                      setProjectDetails({ ...projectDetails, status: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={projectDetails.budget}
                    onChange={(e) => setProjectDetails({ ...projectDetails, budget: e.target.value })}
                    required
                    min="0"
                    step="1000"
                    className={`mt-1.5 ${formErrors.budget ? 'border-red-500' : ''}`}
                    placeholder="Enter project budget"
                  />
                  {formErrors.budget && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.budget}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !projectDetails.startDate && "text-muted-foreground",
                          formErrors.startDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(projectDetails.startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={projectDetails.startDate || undefined}
                        onSelect={(date) =>
                          setProjectDetails({ ...projectDetails, startDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500">{formErrors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Estimated End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !projectDetails.estimatedEndDate && "text-muted-foreground",
                          formErrors.estimatedEndDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(projectDetails.estimatedEndDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={projectDetails.estimatedEndDate || undefined}
                        onSelect={(date) =>
                          setProjectDetails({ ...projectDetails, estimatedEndDate: date })
                        }
                        initialFocus
                        disabled={(date) =>
                          !date ||
                          (projectDetails.startDate ? date < projectDetails.startDate : false) ||
                          date < new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {formErrors.estimatedEndDate && (
                    <p className="text-sm text-red-500">{formErrors.estimatedEndDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={projectDetails.notes}
                  onChange={(e) => setProjectDetails({ ...projectDetails, notes: e.target.value })}
                  placeholder="Add any additional notes about the project..."
                  className="mt-1.5 h-32"
                />
              </div>
            </div>

            {/* Project Items Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Items</h3>
              
              {/* Add New Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder="Enter category"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Enter item name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="units">Units</Label>
                      <Input
                        id="units"
                        type="number"
                        value={newItem.units}
                        onChange={(e) => setNewItem({ ...newItem, units: Number(e.target.value) })}
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        value={newItem.size}
                        onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                        placeholder="Enter size"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="materials">Materials</Label>
                      <Input
                        id="materials"
                        value={newItem.materials}
                        onChange={(e) => setNewItem({ ...newItem, materials: e.target.value })}
                        placeholder="Enter materials"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="itemNotes">Notes</Label>
                      <Input
                        id="itemNotes"
                        value={newItem.notes}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                        placeholder="Enter notes (optional)"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddItem}
                    className="mt-4"
                  >
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              {projectDetails.items.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Added Items</h4>
                  {projectDetails.items.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Category: {item.category}</p>
                            <p className="text-sm text-gray-500">Units: {item.units}</p>
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                            <p className="text-sm text-gray-500">Materials: {item.materials}</p>
                            {item.notes && <p className="text-sm text-gray-500">Notes: {item.notes}</p>}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Gallery</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="gallery" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-sm">
                      <ImagePlus className="h-4 w-4" />
                      <span>Add Images</span>
                    </div>
                  </Label>
                  <Input
                    id="gallery"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <p className="text-sm text-gray-500">
                    Maximum 10 images allowed
                  </p>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentPhase('select-client')}
            disabled={isSubmitting}
          >
            Back to Client Selection
          </Button>
          <Button className='bg-red-500 hover:bg-red-700'
            onClick={handleProjectSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Project Creation</DialogTitle>
            <DialogDescription>
              Please review the project details before creating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Client Details */}
            <div>
              <h4 className="font-semibold mb-2">Client Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedClient?.name}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedClient?.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedClient?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Project Details */}
            <div>
              <h4 className="font-semibold mb-2">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-500">Project Title</p>
                  <p>{projectDetails.title}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500">Location</p>
                  <p>{projectDetails.location}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500">Status</p>
                  <p>{statusOptions.find(s => s.value === projectDetails.status)?.label}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500">Budget</p>
                  <p>₹{Number(projectDetails.budget).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold mb-2">Timeline</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-500">Start Date</p>
                  <p>{formatDate(projectDetails.startDate)}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500">Estimated End Date</p>
                  <p>{formatDate(projectDetails.estimatedEndDate)}</p>
                </div>
              </div>
            </div>

            {/* Project Items */}
            {projectDetails.items.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Project Items ({projectDetails.items.length})</h4>
                <div className="space-y-3">
                  {projectDetails.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500">
                            <p>Category: {item.category}</p>
                            <p>Units: {item.units}</p>
                            <p>Size: {item.size}</p>
                            <p>Materials: {item.materials}</p>
                            {item.notes && (
                              <p className="col-span-2">Notes: {item.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Preview */}
            {projectDetails.gallery.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Gallery Images ({projectDetails.gallery.length})</h4>
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Gallery preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {projectDetails.notes && (
              <div>
                <h4 className="font-semibold mb-2">Additional Notes</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{projectDetails.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Confirm & Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProject;
