import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { Design } from "@/store/admin/adminGallery.store";
import { useState, useEffect } from "react";

interface UpdateDesignSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  design: Design | null;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}

export function UpdateDesignSheet({ open, onOpenChange, design, onSubmit, loading }: UpdateDesignSheetProps) {
  const [remainingImages, setRemainingImages] = useState<Design['images']>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<{ url: string; file: File }[]>([]);

  useEffect(() => {
    if (design) {
      setRemainingImages(design.images);
    }
  }, [design]);

  // Reset remaining images and new previews when sheet is closed
  useEffect(() => {
    if (!open && design) {
      setRemainingImages(design.images);
      // Cleanup new image preview URLs
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setNewImagePreviews([]);
    }
  }, [open, design]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);

  if (!design) return null;

  const handleRemoveImage = (urlToRemove: string) => {
    setRemainingImages(prev => prev.filter(image => image.url !== urlToRemove));
  };

  const handleRemoveNewImage = (urlToRemove: string) => {
    const previewToRemove = newImagePreviews.find(preview => preview.url === urlToRemove);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    setNewImagePreviews(prev => prev.filter(preview => preview.url !== urlToRemove));
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    // Create new previews
    const newPreviews = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Remove the file input data since we'll handle files manually
    formData.delete('images');

    // Add remaining existing image URLs
    remainingImages.forEach(image => {
      formData.append('existingImages', image.url);
    });

    // Add new image files
    newImagePreviews.forEach(preview => {
      formData.append('images', preview.file);
    });
    
    await onSubmit(formData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[600px] overflow-y-auto p-4">
        <SheetHeader className="mb-6">
          <SheetTitle>Update Design</SheetTitle>
          <SheetDescription>
            Make changes to the design. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={design.title}
              placeholder="e.g., Modern Minimalist Design"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={design.description}
              placeholder="Describe this design..."
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Images</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {remainingImages.map((image, index) => (
                <div key={image.url} className="relative aspect-square rounded-md overflow-hidden group">
                  <img
                    src={image.url}
                    alt={`Current image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {newImagePreviews.map((preview, index) => (
                <div key={preview.url} className="relative aspect-square rounded-md overflow-hidden group">
                  <img
                    src={preview.url}
                    alt={`New image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(preview.url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-0.5 px-1 text-center">
                    New
                  </div>
                </div>
              ))}
            </div>
            {remainingImages.length === 0 && newImagePreviews.length === 0 && (
              <p className="text-sm text-muted-foreground">No images selected</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="images">Add New Images</Label>
            <div className="flex items-center gap-4">
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="flex-1"
                onChange={handleNewImages}
              />
              <div className="flex-shrink-0">
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Select multiple files to add new images.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 