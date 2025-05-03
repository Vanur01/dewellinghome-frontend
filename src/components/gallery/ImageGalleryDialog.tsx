import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryDialogProps {
  images: { url: string }[];
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageGalleryDialog({ images, title, open, onOpenChange }: ImageGalleryDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <div className="p-6 flex justify-between items-center border-b">
          <DialogTitle>{title}</DialogTitle>
        </div>
        <div className="flex-1 relative flex items-center justify-center bg-black/5 overflow-hidden">
          <img
            src={images[currentImageIndex]?.url}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 bg-white/10 hover:bg-white/20"
                onClick={previousImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 bg-white/10 hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="p-4 border-t">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2",
                    currentImageIndex === index ? "border-primary" : "border-transparent"
                  )}
                >
                  <img
                    src={image.url}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 