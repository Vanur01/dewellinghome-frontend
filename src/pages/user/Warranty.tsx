import React, { useState, useEffect } from "react";
import { useWarrantyStore, UserWarrantyClaim } from "../../store/user/WarrantyStore";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const WarrantyClaimPage = () => {
  const { claims, loading, error, submitting, createClaim, fetchUserClaims } = useWarrantyStore();
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchUserClaims();
  }, [fetchUserClaims]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const projectItems = {
    "Modular Kitchen": ["Cabinet Doors", "Hinges", "Drawers", "Countertop", "Shelves"],
    "Wardrobe": ["Sliding Doors", "Hinged Doors", "Drawers", "Handles", "Rails"],
    "False Ceiling": ["LED Lights", "POP Work", "Panels", "Spotlights"],
    "TV Unit": ["Wall Mount", "Storage Units", "Display Shelves", "Back Panel"],
    "Lighting": ["Ceiling Lights", "Wall Lights", "Strip Lights", "Spotlights"]
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          return false;
        }
        return true;
      });

      if (images.length + validFiles.length > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }

      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("project", selectedProject);
    formData.append("item", selectedItem);
    formData.append("description", description);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await createClaim(formData);
      toast.success("Warranty claim submitted successfully");
      // Reset form
      setSelectedProject("");
      setSelectedItem("");
      setImages([]);
      setDescription("");
    } catch {
      // Error is already handled in the store and shown via useEffect
    }
  };

  const getStatusBadgeVariant = (status: UserWarrantyClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Warranty Claim</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit a New Claim</CardTitle>
          <CardDescription>Fill out the form below to submit a new warranty claim.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Selector */}
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select
                value={selectedProject}
                onValueChange={(value) => {
                  setSelectedProject(value);
                  setSelectedItem("");
                }}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(projectItems).map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item Selector */}
            {selectedProject && (
              <div className="space-y-2">
                <Label htmlFor="item">Select Item from Your Project</Label>
                <Select
                  value={selectedItem}
                  onValueChange={setSelectedItem}
                >
                  <SelectTrigger id="item">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectItems[selectedProject].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Upload Photos of Affected Area</Label>
              <div className="mt-1">
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={submitting || images.length >= 5}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">Max 5 images, 5MB each</p>
              </div>
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                required
                disabled={submitting}
                className="min-h-[120px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Claim'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Claims Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Claims</h2>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim._id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                      <p className="text-lg font-semibold text-gray-900">{claim.ticketId}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(claim.status)}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Project</p>
                      <p className="text-gray-900">{claim.project}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Item</p>
                      <p className="text-gray-900">{claim.item}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{claim.description}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Images</p>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {claim.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Claim ${claim.ticketId} image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                  {claim.adminNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-500">Admin Notes</p>
                      <p className="text-gray-900">{claim.adminNotes}</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">You haven't submitted any warranty claims yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WarrantyClaimPage;
