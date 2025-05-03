"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useAdminGalleryStore } from "@/store/admin/adminGallery.store";
import type { Design } from "@/store/admin/adminGallery.store";
import { ImageGalleryDialog } from "@/components/gallery/ImageGalleryDialog";
import { AddDesignDialog } from "@/components/admin/gallery/AddDesignDialog";
import { UpdateDesignSheet } from "@/components/admin/gallery/UpdateDesignSheet";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
  designTitle: string;
}

function DeleteDialog({ open, onOpenChange, onConfirm, loading, designTitle }: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the design "{designTitle}" and all its images. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Design
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Designs() {
  const navigate = useNavigate();
  const { galleryId } = useParams<{ galleryId: string }>();
  const [selectedImages, setSelectedImages] = useState<{ images: { url: string }[]; title: string } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; designId: string; title: string } | null>(null);
  const [updateSheet, setUpdateSheet] = useState<{ open: boolean; design: Design | null }>({
    open: false,
    design: null
  });

  const {
    designs,
    loading,
    error,
    selectedGallery,
    fetchDesigns,
    addDesign,
    deleteDesign,
    updateDesign,
    setSelectedGallery,
    galleries
  } = useAdminGalleryStore();

  useEffect(() => {
    if (galleryId) {
      const gallery = galleries.find(g => g._id === galleryId);
      setSelectedGallery(gallery || null);
      fetchDesigns(galleryId);
    }
  }, [galleryId, galleries, fetchDesigns, setSelectedGallery]);

  const handleAddDesign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!galleryId) return;

    const formData = new FormData(e.currentTarget);
    const imageFiles = (e.currentTarget.elements.namedItem('images') as HTMLInputElement)?.files;
    
    formData.delete('images');
    
    if (imageFiles) {
      Array.from(imageFiles).forEach(file => {
        formData.append('images', file);
      });
    }
    
    try {
      await addDesign(galleryId, formData);
      setIsAddDialogOpen(false);
      e.currentTarget.reset(); // Reset form
    } catch (error) {
      console.error('Failed to add design:', error);
    }
  };

  const handleDeleteClick = (designId: string, title: string) => {
    setDeleteDialog({ open: true, designId, title });
  };

  const handleDeleteConfirm = async () => {
    if (!galleryId || !deleteDialog) return;
    
    try {
      await deleteDesign(galleryId, deleteDialog.designId);
      setDeleteDialog(null);
    } catch (error) {
      console.error('Failed to delete design:', error);
    }
  };

  const handleUpdateClick = (design: Design) => {
    setUpdateSheet({ open: true, design });
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (!galleryId || !updateSheet.design) return;
    
    try {
      await updateDesign(galleryId, updateSheet.design._id, formData);
      setUpdateSheet({ open: false, design: null });
    } catch (error) {
      console.error('Failed to update design:', error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button onClick={() => galleryId && fetchDesigns(galleryId)} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const galleryDesigns = designs[galleryId || ""] || [];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-2">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{selectedGallery?.title || 'Designs'}</h1>
          <p className="text-muted-foreground mt-1">
            {selectedGallery?.description || 'Manage designs for this gallery category'}
          </p>
        </div>
        <AddDesignDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddDesign}
          loading={loading}
        />
      </div>

      {loading && !galleryDesigns.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryDesigns.map((design) => (
            <Card key={design._id} className="group">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{design.title}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleUpdateClick(design)}
                      disabled={loading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(design._id, design.title)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-video relative rounded-md overflow-hidden mb-4 cursor-pointer"
                  onClick={() => setSelectedImages({ images: design.images, title: design.title })}
                >
                  <img
                    src={design.images[0]?.url}
                    alt={design.title}
                    className="object-cover w-full h-full"
                  />
                  {design.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                      +{design.images.length - 1} more
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {design.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {deleteDialog && (
        <DeleteDialog
          open={deleteDialog.open}
          onOpenChange={(open) => !open && setDeleteDialog(null)}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          designTitle={deleteDialog.title}
        />
      )}

      <UpdateDesignSheet
        open={updateSheet.open}
        onOpenChange={(open) => !open && setUpdateSheet({ open: false, design: null })}
        design={updateSheet.design}
        onSubmit={handleUpdateSubmit}
        loading={loading}
      />

      {selectedImages && (
        <ImageGalleryDialog
          images={selectedImages.images}
          title={selectedImages.title}
          open={true}
          onOpenChange={(open) => !open && setSelectedImages(null)}
        />
      )}
    </div>
  );
}
