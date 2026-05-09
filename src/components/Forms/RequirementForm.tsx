import { useState, useEffect } from "react";
import enquiryStore from "../../store/public/InquiryStore";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface Item {
  category: string;
  name: string;
  units: number;
  size: string;
  height?: string;
  width?: string;
}

interface RequirementFormProps {
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationErrors {
  homeType?: string;
  purpose?: string;
  category?: string;
  name?: string;
  units?: string;
  width?: string;
  height?: string;
  items?: string;
  general?: string;
}

export default function RequirementForm({
  onValidationChange,
}: RequirementFormProps) {
  const FullMenuItems = [
    { name: "Design Gallery", href: "design-gallary" },
    { name: "Modular Kitchen", href: "modular-kitchen" },
    { name: "Wardrobe", href: "wardrobe" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Living Room", href: "living-room" },
    { name: "Bathroom", href: "bathroom" },
    { name: "Space Saving Furniture", href: "space-saving-furniture" },
  ];

  const HomeTypes = ["1 BHK", "2 BHK", "3 BHK", "3+ BHK"];

  const Purposes = ["Move In", "Rent Out", "Renovate"];

  const CategoryItems = {
    "Modular Kitchen": [
      "Kitchen Cabinets",
      "Kitchen Island",
      "Countertop",
      "Pantry Unit",
      "Tall Unit",
      "Corner Unit",
      "Sink Unit",
      "Appliance Housing",
    ],
    Wardrobe: [
      "Walk-in Closet",
      "Sliding Door Wardrobe",
      "Hinged Door Wardrobe",
      "Corner Wardrobe",
      "Dresser Unit",
      "Shoe Cabinet",
    ],
    Bedroom: [
      "Bed Frame",
      "Side Tables",
      "Dressing Table",
      "TV Unit",
      "Study Table",
      "Storage Bench",
      "Wall Shelves",
    ],
    "Living Room": [
      "TV Console",
      "Entertainment Unit",
      "Display Cabinet",
      "Wall Unit",
      "Storage Cabinet",
      "Book Shelf",
      "Shoe Cabinet",
    ],
    Bathroom: [
      "Vanity Unit",
      "Mirror Cabinet",
      "Tall Storage Unit",
      "Wall Cabinet",
      "Linen Cabinet",
      "Under-sink Cabinet",
    ],
    "Space Saving Furniture": [
      "Murphy Bed",
      "Folding Table",
      "Nested Tables",
      "Storage Ottoman",
      "Wall-mounted Desk",
      "Expandable Dining Table",
    ],
    "Design Gallery": [
      "Custom Design",
      "Theme Package",
      "Color Scheme",
      "Material Selection",
      "Lighting Plan",
    ],
  };

  const [items, setItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState({
    category: "",
    name: "",
    units: 1,
    size: "",
    height: "",
    width: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const { setProjectDetails, projectDetails } = enquiryStore();

  useEffect(() => {
    if (projectDetails) {
      if (projectDetails.items?.length > 0) {
        const processedItems = projectDetails.items.map((item) => {
          if (item.size) {
            const [width, height] = item.size.split("x").map((s) => s.trim());
            return { ...item, height, width };
          }
          return item;
        });
        setItems(processedItems);
      }
      setProjectDetails({
        ...projectDetails,
        homeType: projectDetails.homeType || "",
        purpose: projectDetails.purpose || "",
      });
    }
  }, []);

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Validate project details
    if (!projectDetails?.homeType) {
      newErrors.homeType = "Home type is required";
    }

    if (!projectDetails?.purpose) {
      newErrors.purpose = "Purpose is required";
    }

    // Validate items
    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }

    return newErrors;
  };

  const validateCurrentItem = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!currentItem.category) {
      newErrors.category = "Category is required";
    }

    if (!currentItem.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (currentItem.units < 1) {
      newErrors.units = "Units must be at least 1";
    }

    // Validate dimensions if provided
    if (currentItem.width && isNaN(parseFloat(currentItem.width))) {
      newErrors.width = "Width must be a valid number";
    }

    if (currentItem.height && isNaN(parseFloat(currentItem.height))) {
      newErrors.height = "Height must be a valid number";
    }

    return newErrors;
  };

  useEffect(() => {
    const errors = validateForm();
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [projectDetails, items]);

  const handleAddItem = () => {
    const itemErrors = validateCurrentItem();

    if (Object.keys(itemErrors).length > 0) {
      setErrors({ ...errors, ...itemErrors });
      setShowErrors(true);
      return;
    }

    const size =
      currentItem.width && currentItem.height
        ? `${currentItem.width}x${currentItem.height}`
        : "";

    // Only include size/height/width if dimensions were actually provided
    const itemToAdd: Item = {
      category: currentItem.category,
      name: currentItem.name,
      units: currentItem.units,
      size,
      ...(currentItem.height ? { height: currentItem.height } : {}),
      ...(currentItem.width ? { width: currentItem.width } : {}),
    };

    const newItems = [...items, itemToAdd];
    setItems(newItems);
    setProjectDetails({ ...projectDetails, items: newItems });
    setCurrentItem({
      category: currentItem.category,
      name: "",
      units: 1,
      size: "",
      height: "",
      width: "",
    });

    // Clear item-specific errors
    const { category, name, units, width, height, ...remainingErrors } = errors;
    setErrors(remainingErrors);
    setShowErrors(false);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setProjectDetails({ ...projectDetails, items: updatedItems });
  };

  const resetForm = () => {
    setItems([]);
    setCurrentItem({
      category: "",
      name: "",
      units: 1,
      size: "",
      height: "",
      width: "",
    });
    setProjectDetails({ ...projectDetails, items: [] });
    setErrors({});
    setShowErrors(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    // Clear specific field error when user starts typing/selecting
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    if (field === "homeType" || field === "purpose") {
      setProjectDetails({ ...projectDetails, [field]: value });
    } else {
      setCurrentItem({ ...currentItem, [field]: value });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl mb-6 font-semibold">
          Interior Design Requirements
        </h2>

        {/* General Form Errors */}
        {(errors.general || errors.items) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {errors.general || errors.items}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Project Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label className={errors.homeType ? "text-red-600" : ""}>
                    Home Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={projectDetails?.homeType || ""}
                    onValueChange={(value) =>
                      handleFieldChange("homeType", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.homeType
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select home type" />
                    </SelectTrigger>
                    <SelectContent>
                      {HomeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.homeType && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.homeType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className={errors.purpose ? "text-red-600" : ""}>
                    Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={projectDetails?.purpose || ""}
                    onValueChange={(value) =>
                      handleFieldChange("purpose", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.purpose
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {Purposes.map((purpose) => (
                        <SelectItem key={purpose} value={purpose}>
                          {purpose}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.purpose && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.purpose}
                    </p>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-medium mb-4">
                Add Items to Your Requirements{" "}
                <span className="text-red-500">*</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className={errors.category ? "text-red-600" : ""}>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentItem.category}
                    onValueChange={(value) => {
                      handleFieldChange("category", value);
                      setCurrentItem((prev) => ({
                        ...prev,
                        category: value,
                        name: "",
                      }));
                    }}
                  >
                    <SelectTrigger
                      className={
                        errors.category
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {FullMenuItems.map((item) => (
                        <SelectItem key={item.href} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className={errors.name ? "text-red-600" : ""}>
                    Item Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentItem.name}
                    onValueChange={(value) => handleFieldChange("name", value)}
                    disabled={!currentItem.category}
                  >
                    <SelectTrigger
                      className={
                        errors.name ? "border-red-500 focus:border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentItem.category &&
                        CategoryItems[currentItem.category]?.map(
                          (item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className={errors.units ? "text-red-600" : ""}>
                    Units <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentItem.units}
                    onChange={(e) =>
                      handleFieldChange("units", parseInt(e.target.value) || 1)
                    }
                    className={
                      errors.units ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
                  {errors.units && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.units}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Dimensions (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="text"
                        value={currentItem.width}
                        onChange={(e) =>
                          handleFieldChange("width", e.target.value)
                        }
                        placeholder="Width (ft)"
                        className={
                          errors.width
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {errors.width && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.width}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={currentItem.height}
                        onChange={(e) =>
                          handleFieldChange("height", e.target.value)
                        }
                        placeholder="Height (ft)"
                        className={
                          errors.height
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                      />
                      {errors.height && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.height}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Dimensions (W×H)
                      </TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {item.size || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="w-[120px]"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
