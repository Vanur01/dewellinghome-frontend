import { useState, useRef } from "react";
import { format } from "date-fns";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProgressStore } from "@/store/admin/adminProgress.store";

interface AddProgressDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProgressDialog({
  projectId,
  open,
  onOpenChange,
}: AddProgressDialogProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createProgress, loading } = useProgressStore();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      
      // Create URLs for preview
      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    if (completionPercentage < 0 || completionPercentage > 100) {
      newErrors.completionPercentage = "Completion percentage must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date!.toISOString());
      formData.append("completionPercentage", completionPercentage.toString());
      
      // Append each image to the form data
      images.forEach((image) => {
        formData.append("images", image);
      });

      await createProgress(projectId, formData);
      toast.success("Progress update added successfully");
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDate(new Date());
      setCompletionPercentage(0);
      setImages([]);
      setImageUrls([]);
      setErrors({});
    } catch (err) {
      console.error("Error adding progress:", err);
      toast.error("Failed to add progress update");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Progress Update</DialogTitle>
          <DialogDescription>
            Add a new progress update for this project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter progress title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the progress made"
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <div className="flex">
              <Input
                id="date"
                type="date"
                value={date ? format(date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const newDate = e.target.value ? new Date(e.target.value) : null;
                  setDate(newDate);
                }}
                className={errors.date ? "border-red-500" : ""}
              />
            </div>
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="completionPercentage" className="text-sm font-medium">
              Completion Percentage
            </label>
            <Input
              id="completionPercentage"
              type="number"
              min="0"
              max="100"
              value={completionPercentage}
              onChange={(e) => setCompletionPercentage(Number(e.target.value))}
              placeholder="Enter completion percentage"
              className={errors.completionPercentage ? "border-red-500" : ""}
            />
            <p className="text-sm text-gray-500">
              Enter a value between 0 and 100
            </p>
            {errors.completionPercentage && (
              <p className="text-sm text-red-500">{errors.completionPercentage}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Adding..." : "Add Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 