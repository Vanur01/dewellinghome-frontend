import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface AddDesignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}

interface ImagePreview {
  file: File;
  preview: string;
}

export function AddDesignDialog({ open, onOpenChange, onSubmit, loading }: AddDesignDialogProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Create new image previews
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Remove the existing files from the form data
    formData.delete('images');
    // Append only the files we have in our state
    images.forEach(image => {
      formData.append('images', image.file);
    });
    await onSubmit(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600" size="lg" disabled={loading}>
          <Plus className="mr-2 h-5 w-5" />
          Add Design
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Design</DialogTitle>
          <DialogDescription>
            Create a new design for this gallery category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Modern Minimalist Design"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe this design..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="flex-1"
                  onChange={handleImageChange}
                  required={images.length === 0}
                />
                <div className="flex-shrink-0">
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You can select multiple images. Recommended size: 800x600px
              </p>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={image.preview} className="relative aspect-[4/3] group overflow-hidden">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-5 w-5 rounded-full duration-200 hover:scale-110"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <span className="absolute bottom-2 left-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Image {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-red-500 hover:bg-red-600" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Design
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 