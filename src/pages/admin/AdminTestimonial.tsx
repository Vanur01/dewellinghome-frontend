import { useEffect, useState } from "react";
import { useAdminTestimonialStore } from "../../store/admin/adminTestimonial.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Star, Trash2, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Testimonial } from "../../utils/api";
import { getImageUrl } from "@/utils/Image";

interface FormData {
  name: string;
  address: string;
  feedback: string;
  youtubeLink: string;
  rating: number;
  showOnWebsite: boolean;
  image?: File;
  currentImage?: string;
}

const initialFormData: FormData = {
  name: "",
  address: "",
  feedback: "",
  youtubeLink: "",
  rating: 5,
  showOnWebsite: true,
};

export default function AdminTestimonial() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    testimonials,
    loading,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useAdminTestimonialStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Cleanup image preview URL when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      showOnWebsite: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create preview URL for the new image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setImagePreview(null); // Clear the image preview
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await createTestimonial(formData);
      }
      setIsOpen(false);
      resetForm();
    } catch {
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial._id);
    setFormData({
      name: testimonial.name,
      address: testimonial.address || "",
      feedback: testimonial.feedback,
      youtubeLink: testimonial.youtubeLink || "",
      rating: testimonial.rating || 5,
      showOnWebsite: testimonial.showOnWebsite || false,
      currentImage: testimonial.image,
    });
    setImagePreview(testimonial.image || null);
    setIsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteTestimonial(deleteId);
        toast.success("Testimonial deleted successfully");
      } catch {
        toast.error("Failed to delete testimonial");
      }
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Testimonials Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit" : "Add"} Testimonial
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      minLength={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback *</label>
                    <Textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      minLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube Link</label>
                    <Input
                      name="youtubeLink"
                      type="url"
                      value={formData.youtubeLink}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input
                      name="rating"
                      type="number"
                      min={1}
                      max={5}
                      value={formData.rating}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Show on Website
                    </label>
                    <Switch
                      className="bg-red-500"
                      checked={formData.showOnWebsite}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {(imagePreview || formData.currentImage) && (
                      <div className="mt-2">
                        <img
                          src={editingId ? getImageUrl(imagePreview) : imagePreview || formData.currentImage}
                          alt="Testimonial"
                          className="w-full max-w-[200px] h-auto rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Save Testimonial"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial._id}>
                    <TableCell className="font-medium">
                      {testimonial.name}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {testimonial.feedback}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{testimonial.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {testimonial.showOnWebsite ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                          Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(testimonial)}
                          className="hover:bg-red-100 text-red-600 hover:text-red-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteId(testimonial._id!)}
                              className="hover:bg-red-100 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                testimonial and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel 
                                onClick={() => setDeleteId(null)}
                                className="border-red-100 text-red-600"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDeleteConfirm}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {testimonial.youtubeLink && (
                          <a
                            href={testimonial.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-100 text-red-600 hover:text-red-700"
                            >
                              <Youtube className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {testimonials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No testimonials found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
