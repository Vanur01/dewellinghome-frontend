import { useState, useEffect } from 'react';
import enquiryStore from '../../store/InquiryStore';
import { Plus, Trash2 } from 'lucide-react';
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

export default function RequirementForm({ onValidationChange }: RequirementFormProps) {
  const FullMenuItems = [
    { name: "Design Gallery", href: "design-gallary" },
    { name: "Modular Kitchen", href: "modular-kitchen" },
    { name: "Wardrobe", href: "wardrobe" },
    { name: "Bedroom", href: "bedroom" },
    { name: "Living Room", href: "living-room" },
    { name: "Bathroom", href: "bathroom" },
    { name: "Space Saving Furniture", href: "space-saving-furniture" },
  ];

  const HomeTypes = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "3+ BHK"
  ];

  const Purposes = [
    "Move In",
    "Rent Out",
    "Renovate"
  ];

  const CategoryItems = {
    "Modular Kitchen": [
      "Kitchen Cabinets",
      "Kitchen Island",
      "Countertop",
      "Pantry Unit",
      "Tall Unit",
      "Corner Unit",
      "Sink Unit",
      "Appliance Housing"
    ],
    "Wardrobe": [
      "Walk-in Closet",
      "Sliding Door Wardrobe",
      "Hinged Door Wardrobe",
      "Corner Wardrobe",
      "Dresser Unit",
      "Shoe Cabinet"
    ],
    "Bedroom": [
      "Bed Frame",
      "Side Tables",
      "Dressing Table",
      "TV Unit",
      "Study Table",
      "Storage Bench",
      "Wall Shelves"
    ],
    "Living Room": [
      "TV Console",
      "Entertainment Unit",
      "Display Cabinet",
      "Wall Unit",
      "Storage Cabinet",
      "Book Shelf",
      "Shoe Cabinet"
    ],
    "Bathroom": [
      "Vanity Unit",
      "Mirror Cabinet",
      "Tall Storage Unit",
      "Wall Cabinet",
      "Linen Cabinet",
      "Under-sink Cabinet"
    ],
    "Space Saving Furniture": [
      "Murphy Bed",
      "Folding Table",
      "Nested Tables",
      "Storage Ottoman",
      "Wall-mounted Desk",
      "Expandable Dining Table"
    ],
    "Design Gallery": [
      "Custom Design",
      "Theme Package",
      "Color Scheme",
      "Material Selection",
      "Lighting Plan"
    ]
  };

  const [items, setItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState({
    category: "",
    name: "",
    units: 1,
    size: "",
    height: "",
    width: ""
  });
  const { setProjectDetails, projectDetails } = enquiryStore();

  useEffect(() => {
    if (projectDetails) {
      if (projectDetails.items?.length > 0) {
        const processedItems = projectDetails.items.map(item => {
          if (item.size) {
            const [width, height] = item.size.split('x').map(s => s.trim());
            return { ...item, height, width };
          }
          return item;
        });
        setItems(processedItems);
      }
      setProjectDetails({
        ...projectDetails,
        homeType: projectDetails.homeType || '',
        purpose: projectDetails.purpose || ''
      });
    }
  }, []);

  useEffect(() => {
    const isValid = 
      items.length > 0 && 
      Boolean(projectDetails?.homeType) && 
      Boolean(projectDetails?.purpose);
    
    onValidationChange(isValid);
  }, [items, projectDetails?.homeType, projectDetails?.purpose, onValidationChange]);

  const handleAddItem = () => {
    if (!currentItem.category || !currentItem.name.trim()) {
      alert("Please select a category and an item");
      return;
    }

    const size = currentItem.width && currentItem.height 
      ? `${currentItem.width}x${currentItem.height}`
      : "";

    const itemToAdd = {
      ...currentItem,
      size
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
      width: ""
    });
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
      width: ""
    });
    setProjectDetails({ ...projectDetails, items: [] });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl mb-6 font-semibold">Interior Design Requirements</h2>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Project Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Home Type</Label>
                  <Select
                    value={projectDetails?.homeType || ''}
                    onValueChange={(value) => setProjectDetails({ ...projectDetails, homeType: value })}
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Select
                    value={projectDetails?.purpose || ''}
                    onValueChange={(value) => setProjectDetails({ ...projectDetails, purpose: value })}
                  >
                    <SelectTrigger>
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
                </div>
              </div>

              <h2 className="text-lg font-medium mb-4">Add Items to Your Requirements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={currentItem.category}
                    onValueChange={(value) => setCurrentItem({
                      ...currentItem,
                      category: value,
                      name: "" 
                    })}
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Select
                    value={currentItem.name}
                    onValueChange={(value) => setCurrentItem({...currentItem, name: value})}
                    disabled={!currentItem.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentItem.category && CategoryItems[currentItem.category]?.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentItem.units}
                    onChange={(e) => setCurrentItem({...currentItem, units: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="text"
                        value={currentItem.width}
                        onChange={(e) => setCurrentItem({...currentItem, width: e.target.value})}
                        placeholder="Width (ft)"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={currentItem.height}
                        onChange={(e) => setCurrentItem({...currentItem, height: e.target.value})}
                        placeholder="Height (ft)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!currentItem.category || !currentItem.name.trim()}
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
                      <TableHead className="hidden sm:table-cell">Dimensions (W×H)</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell className="hidden sm:table-cell">{item.size || '-'}</TableCell>
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