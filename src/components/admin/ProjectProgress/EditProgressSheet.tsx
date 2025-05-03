import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProgressStore, ProgressEntry } from "@/store/admin/adminProgress.store";
import { Badge } from "@/components/ui/badge";

interface EditProgressSheetProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressToEdit: ProgressEntry | null;
}

export function EditProgressSheet({
  projectId,
  open,
  onOpenChange,
  progressToEdit,
}: EditProgressSheetProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProgress, loading } = useProgressStore();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when sheet opens/closes or when editing a different progress
  useEffect(() => {
    if (open && progressToEdit) {
      // Populate form with existing progress data
      setTitle(progressToEdit.title);
      setDescription(progressToEdit.description);
      setDate(new Date(progressToEdit.date));
      setCompletionPercentage(progressToEdit.completionPercentage);
      setExistingImages(progressToEdit.images || []);
      setImageUrls(progressToEdit.images || []);
      setNewImages([]); // Reset new images
    }
  }, [open, progressToEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...newFiles]);
      
      // Create URLs for preview
      newFiles.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    // If the image is from the existing images
    if (index < existingImages.length) {
      // Remove from existing images
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      // Remove from preview
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      // For new images
      const adjustedIndex = index - existingImages.length;
      setNewImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
      setImageUrls((prev) => {
        const newUrls = [...prev];
        URL.revokeObjectURL(newUrls[index]);
        return newUrls.filter((_, i) => i !== index);
      });
    }
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
    
    if (!validateForm() || !progressToEdit) {
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date!.toISOString());
      formData.append("completionPercentage", completionPercentage.toString());
      
      // Append existing images as JSON string - fix the issue with empty array
      formData.append("existingImages", JSON.stringify(existingImages.length > 0 ? existingImages : []));
      
      // Append each new image to the form data
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      // Update existing progress
      await updateProgress(progressToEdit._id, formData);
      toast.success("Progress update modified successfully");
      onOpenChange(false);
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error("Failed to update progress update");
    }
  };

  if (!progressToEdit) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-[480px] overflow-y-auto px-3">
        <SheetHeader>
          <SheetTitle>Edit Progress Update</SheetTitle>
          <SheetDescription>
            Modify the progress update for this project.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Images</label>
              <Badge variant="outline" className="text-xs">
                {existingImages.length} existing + {newImages.length} new
              </Badge>
            </div>
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
              Upload New Images
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
          
          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Progress"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
} 