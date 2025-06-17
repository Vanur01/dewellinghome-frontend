"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { useAdminGalleryStore } from "@/store/admin/adminGallery.store";
import { Loader2 } from "lucide-react";

export default function GalleryList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<null | { _id: string; title: string; category: string; description: string }>(null);
  const navigate = useNavigate();
  
  const { 
    galleries = [], 
    loading = false, 
    error = null,
    fetchGalleries, 
    createGallery, 
    deleteGallery,
    updateGallery 
  } = useAdminGalleryStore();

  useEffect(() => {
    if (galleries?.length === 0) {
      fetchGalleries();
    }
  }, [fetchGalleries, galleries]);

  const handleAddGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createGallery({
        title: formData.get("title") as string ?? '',
        category: formData.get("category") as string ?? '',
        description: formData.get("description") as string ?? '',
      });
      setIsAddDialogOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create gallery';
      console.error('Gallery creation failed:', errorMessage);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await deleteGallery(id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete gallery';
      console.error('Gallery deletion failed:', errorMessage);
    }
  };

  const handleEditGallery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGallery?._id) return;

    try {
      const formData = new FormData(e.currentTarget);
      await updateGallery(editingGallery._id, {
        title: formData.get("title") as string ?? '',
        category: formData.get("category") as string ?? '',
        description: formData.get("description") as string ?? '',
      });
      setIsEditDialogOpen(false);
      setEditingGallery(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery';
      console.error('Gallery update failed:', errorMessage);
    }
  };

  const openEditDialog = (gallery: typeof editingGallery) => {
    if (gallery) {
      setEditingGallery(gallery);
      setIsEditDialogOpen(true);
    }
  };

  const navigateToDesigns = (galleryId: string) => {
    if (galleryId) {
      navigate(`/admin/gallery/${galleryId}/designs`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button onClick={() => fetchGalleries()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gallery categories and their designs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600" size="lg" disabled={loading}>
              <Plus className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Gallery Category</DialogTitle>
              <DialogDescription>
                Create a new category section for your designs.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGallery}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Modern Bedrooms"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Bedroom"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe this gallery category..."
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Category</DialogTitle>
            <DialogDescription>
              Update the details of this gallery category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditGallery}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingGallery?.title ?? ''}
                  placeholder="e.g., Modern Bedrooms"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  name="category"
                  defaultValue={editingGallery?.category ?? ''}
                  placeholder="e.g., Bedroom"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingGallery?.description ?? ''}
                  placeholder="Describe this gallery category..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-red-500 hover:bg-red-600" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading && !galleries?.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries?.map((gallery) => (
            <Card key={gallery?._id ?? Math.random()} className="group">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{gallery?.title ?? 'Untitled'}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(gallery)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => gallery?._id && handleDeleteGallery(gallery._id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{gallery?.category ?? 'Uncategorized'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {gallery?.description ?? 'No description available'}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => gallery?._id && navigateToDesigns(gallery._id)}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Manage Designs
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
