import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, X, ImagePlus, Trash2 } from "lucide-react";
import { useProjectStore } from "@/store/admin/adminProject.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusOptions = [
  { value: "planning", label: "Planning" },
  { value: "designing", label: "Designing" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
] as const;

type ProjectStatus = typeof statusOptions[number]["value"];

interface ProjectItem {
  _id?: string;
  category: string;
  name: string;
  units: number;
  size: string;
  materials: string;
  notes?: string;
}

interface FormData {
  title: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  estimatedEndDate: string;
  budget: string;
  notes: string;
  items: ProjectItem[];
  gallery: string[];
}

const EditProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, loading, error, fetchProjectById, updateProject } = useProjectStore();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    location: "",
    status: "planning",
    startDate: "",
    estimatedEndDate: "",
    budget: "",
    notes: "",
    items: [],
    gallery: []
  });

  // New item form state
  const [newItem, setNewItem] = useState<Omit<ProjectItem, '_id'>>({
    category: '',
    name: '',
    units: 0,
    size: '',
    materials: '',
    notes: ''
  });

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load project data
  useEffect(() => {
    if (id) {
      fetchProjectById(id);
    }
  }, [id, fetchProjectById]);

  // Update form data when project is loaded
  useEffect(() => {
    if (currentProject) {
      setFormData({
        title: currentProject.title,
        location: currentProject.location,
        status: currentProject.status as ProjectStatus,
        startDate: new Date(currentProject.startDate).toISOString().split("T")[0],
        estimatedEndDate: new Date(currentProject.estimatedEndDate).toISOString().split("T")[0],
        budget: currentProject.budget.toString(),
        notes: currentProject.notes || "",
        items: currentProject.items || [],
        gallery: currentProject.gallery || []
      });
    }
  }, [currentProject]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Project title is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      errors.budget = "Valid budget amount is required";
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.estimatedEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate <= startDate) {
      errors.estimatedEndDate = "End date must be after start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    if (!newItem.category || !newItem.name || !newItem.size || !newItem.materials) {
      toast.error('Please fill in all required fields for the item');
      return;
    }

    setFormData(prev => ({
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

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (newFiles.length + selectedFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(url => url !== imageUrl)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    try {
      setIsSubmitting(true);

      // Create FormData instance
      const formDataToSend = new FormData();

      // Add project details
      formDataToSend.append('title', formData.title);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('startDate', new Date(formData.startDate).toISOString());
      formDataToSend.append('estimatedEndDate', new Date(formData.estimatedEndDate).toISOString());
      formDataToSend.append('notes', formData.notes);

      // Convert arrays to JSON strings and add special flag for backend processing
      formDataToSend.append('_items', JSON.stringify(formData.items));
      formDataToSend.append('_existingImages', JSON.stringify(formData.gallery));

      // Add new images
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Send single update request
      await updateProject(id, formDataToSend);

      toast.success("Project updated successfully");
      navigate(`/admin/projects/${id}`);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
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
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!currentProject) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link to={`/admin/projects/${id}`} className="rounded-md hover:bg-white">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle>Edit Project</CardTitle>
              <CardDescription>
                Update the project details and information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`mt-1.5 ${formErrors.title ? "border-red-500" : ""}`}
                  />
                  {formErrors.title && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className={`mt-1.5 ${
                      formErrors.location ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.location && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Project Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: ProjectStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger
                      className={`mt-1.5 ${
                        formErrors.status ? "border-red-500" : ""
                      }`}
                    >
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
                  {formErrors.status && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.status}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    min="0"
                    step="1000"
                    className={`mt-1.5 ${formErrors.budget ? "border-red-500" : ""}`}
                  />
                  {formErrors.budget && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.budget}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className={`mt-1.5 ${
                      formErrors.startDate ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={formData.estimatedEndDate}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedEndDate: e.target.value })
                    }
                    className={`mt-1.5 ${
                      formErrors.estimatedEndDate ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.estimatedEndDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.estimatedEndDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Items</h3>
              
              {/* Add New Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New Item</CardTitle>
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
                    className="mt-4 bg-red-500 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Materials</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item, index) => (
                        <TableRow key={item._id || index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.units}</TableCell>
                          <TableCell>{item.materials}</TableCell>
                          <TableCell>{item.notes}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Gallery</h3>
              
              {/* Upload New Images */}
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

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New upload ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Images */}
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.gallery.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any additional notes about the project..."
                  className="mt-1.5 h-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/projects/${id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button className='bg-red-500 hover:bg-red-700' onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Project"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditProject;
