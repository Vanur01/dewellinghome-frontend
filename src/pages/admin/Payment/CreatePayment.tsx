import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdminPaymentStore } from "@/store/admin/adminPayment.store";
import { useProjectStore, Project } from "@/store/admin/adminProject.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import debounce from "lodash/debounce";

interface Milestone {
  timeline: string;
  percentage: number;
}

export default function CreatePayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createSchedule, loading } = useAdminPaymentStore();
  const {
    searchResults,
    searchProjects,
    loading: searchLoading,
    fetchProjectById,
  } = useProjectStore();

  const [projectId, setProjectId] = useState("");
  const [totalProjectValue, setTotalProjectValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { timeline: "During Order Booking", percentage: 15 },
    { timeline: "Before 3D Renders Sharing", percentage: 15 },
    { timeline: "Before material Acquisition", percentage: 60 },
    { timeline: "After completing 80% of work", percentage: 10 },
  ]);

  // Load project from URL params
  useEffect(() => {
    const urlProjectId = searchParams.get("projectId");
    if (urlProjectId) {
      loadProjectDetails(urlProjectId);
    }
  }, []);

  // Load project details
  const loadProjectDetails = async (id: string) => {
    try {
      const project = await fetchProjectById(id);
      if (project) {
        setProjectId(id);
        setSelectedProject(project);
        // If project has a budget, set it as total project value
        if (project.budget) {
          setTotalProjectValue(project.budget.toString());
        }
      }
    } catch (error) {
      toast.error("Failed to load project details");
      console.error("Error loading project:", error);
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        searchProjects(query);
      }
    }, 300),
    []
  );

  // Handle project search
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);

  // Validate milestone data
  const validateMilestones = () => {
    // Check if all milestones have timeline and percentage
    const hasEmptyFields = milestones.some(
      (m) => !m.timeline.trim() || !m.percentage
    );
    if (hasEmptyFields) {
      toast.error("All milestones must have a timeline and percentage");
      return false;
    }

    // Check if any percentage is negative
    const hasNegativePercentage = milestones.some((m) => m.percentage < 0);
    if (hasNegativePercentage) {
      toast.error("Milestone percentages cannot be negative");
      return false;
    }

    // Check if total percentage is exactly 100
    const totalPercentage = milestones.reduce(
      (sum, m) => sum + m.percentage,
      0
    );
    if (Math.abs(totalPercentage - 100) >= 0.01) {
      toast.error("Total milestone percentages must equal exactly 100%");
      return false;
    }

    return true;
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "₹ ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!projectId) {
        toast.error("Please select a project");
        return;
      }

      if (!totalProjectValue || parseFloat(totalProjectValue) <= 0) {
        toast.error("Please enter a valid project value");
        return;
      }

      // Validate milestones
      if (!validateMilestones()) {
        return;
      }

      // Prepare milestone data with proper rounding
      const formattedMilestones = milestones.map((milestone) => ({
        timeline: milestone.timeline.trim(),
        percentage: parseFloat(milestone.percentage.toString()),
      }));

      // Create payment schedule
      await createSchedule({
        projectId,
        totalProjectValue: parseFloat(totalProjectValue),
        milestones: formattedMilestones,
      });

      // Show success message and redirect
      toast.success("Payment schedule created successfully");
      navigate("/admin/payments");
    } catch (error) {
      console.error("Error creating payment schedule:", error);
      toast.error("Failed to create payment schedule. Please try again.");
    }
  };

  const handleAddMilestone = () => {
    if (milestones.length >= 10) {
      toast.error("Maximum 10 milestones allowed");
      return;
    }
    setMilestones([...milestones, { timeline: "", percentage: 0 }]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) {
      toast.error("At least one milestone is required");
      return;
    }
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string | number
  ) => {
    const newMilestones = [...milestones];

    if (field === "percentage") {
      // Ensure percentage is a valid number
      const numValue = parseFloat(value.toString());
      if (isNaN(numValue)) return;

      // Prevent negative values
      if (numValue < 0) return;

      // Prevent percentages over 100
      if (numValue > 100) return;

      newMilestones[index] = {
        ...newMilestones[index],
        percentage: numValue,
      };
    } else if (field === "timeline") {
      newMilestones[index] = {
        ...newMilestones[index],
        timeline: value.toString(),
      };
    }

    setMilestones(newMilestones);
  };

  // Debug log to check search results
  useEffect(() => {
    console.log("Search Results:", searchResults);
  }, [searchResults]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Button onClick={() => navigate(-1)} variant="link" className="hover:shadow-sm hover:border-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="ml-4">Create Payment Schedule</span>
          </CardTitle>
          <CardDescription>
            Set up a new payment schedule for a project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                {selectedProject ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 border rounded-md">
                      <div className="font-medium">{selectedProject.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Client: {selectedProject.clientId.name}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(null);
                        setProjectId("");
                        setTotalProjectValue("");
                        navigate("/admin/payments/new");
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        Select project...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search projects..."
                          value={searchQuery}
                          onValueChange={(value) => {
                            setSearchQuery(value);
                            if (value.trim()) {
                              searchProjects(value);
                            }
                          }}
                        />
                        <CommandEmpty>
                          {searchLoading ? (
                            <div className="flex items-center justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2">Searching...</span>
                            </div>
                          ) : searchQuery.trim() ? (
                            "No projects found"
                          ) : (
                            "Start typing to search projects..."
                          )}
                        </CommandEmpty>
                        <CommandGroup heading="Projects">
                          {Array.isArray(searchResults) &&
                            searchResults.map((project) => (
                              <CommandItem
                                key={project._id}
                                value={project.title}
                                onSelect={async () => {
                                  await loadProjectDetails(project._id);
                                  setOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      projectId === project._id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {project.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      Client: {project.client.name}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Total Project Value
                </label>
                <Input
                  type="number"
                  value={totalProjectValue}
                  onChange={(e) => setTotalProjectValue(e.target.value)}
                  placeholder="Enter total project value"
                />
              </div>
            </div>

            {/* Project Details Section */}
            {selectedProject && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Project Details</h3>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor:
                        selectedProject.status === "completed"
                          ? "rgb(187 247 208)"
                          : selectedProject.status === "in_progress"
                          ? "rgb(254 240 138)"
                          : selectedProject.status === "on_hold"
                          ? "rgb(254 202 202)"
                          : "rgb(226 232 240)",
                      color:
                        selectedProject.status === "completed"
                          ? "rgb(22 101 52)"
                          : selectedProject.status === "in_progress"
                          ? "rgb(133 77 14)"
                          : selectedProject.status === "on_hold"
                          ? "rgb(153 27 27)"
                          : "rgb(51 65 85)",
                    }}
                  >
                    {selectedProject.status.replace("_", " ").toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Location
                        </span>
                        <p className="font-medium">
                          {selectedProject.location}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Timeline
                        </span>
                        <p className="font-medium">
                          {formatDate(selectedProject.startDate)} -{" "}
                          {formatDate(selectedProject.estimatedEndDate)}
                        </p>
                      </div>
                      {selectedProject.notes && (
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Notes
                          </span>
                          <p className="font-medium">{selectedProject.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Client Details
                        </span>
                        <p className="font-medium">
                          {selectedProject.clientId.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProject.clientId.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedProject.clientId.phone}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Project Items
                        </span>
                        <p className="font-medium">
                          {selectedProject.items.length} items
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment Milestones</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMilestone}
                  disabled={milestones.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Percentage (%)</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestones.map((milestone, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={milestone.timeline}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "timeline",
                              e.target.value
                            )
                          }
                          placeholder="Enter milestone description"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={milestone.percentage}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "percentage",
                              e.target.value
                            )
                          }
                          className="w-24"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        {totalProjectValue
                          ? formatCurrency(
                              (parseFloat(totalProjectValue) *
                                milestone.percentage) /
                                100
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMilestone(index)}
                          disabled={milestones.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium">
                    <TableCell>Total</TableCell>
                    <TableCell>
                      <span
                        className={
                          Math.abs(totalPercentage - 100) < 0.01
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {totalPercentage.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {totalProjectValue
                        ? formatCurrency(parseFloat(totalProjectValue))
                        : "-"}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/payments")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || Math.abs(totalPercentage - 100) >= 0.01}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Payment Schedule"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
