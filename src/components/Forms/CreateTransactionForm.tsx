"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import debounce from "lodash/debounce"
import { projectApi } from "@/api/project.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateManualTransactionData } from "@/api/types"

interface Project {
  _id: string;
  title: string;
  location: string;
  status: string;
  startDate: string;
  estimatedEndDate: string;
  client?: {
    name: string;
    _id: string;
  };
  clientId?: {
    name: string;
    _id: string;
  };
}

interface CreateTransactionFormProps {
  preSelectedProjectId?: string;
  onSubmit: (data: CreateManualTransactionData) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export default function CreateTransactionForm({
  preSelectedProjectId,
  onSubmit,
  loading,
  onCancel
}: CreateTransactionFormProps) {
  // Project selection state
  const [projectSearchOpen, setProjectSearchOpen] = useState(false)
  const [projectSearchValue, setProjectSearchValue] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    paymentReference: "",
    notes: "",
    paidAt: new Date().toISOString().split('T')[0], // Today's date
  })

  // Handle pre-selected project ID (from URL params)
  useEffect(() => {
    if (preSelectedProjectId) {
      const fetchProject = async () => {
        try {
          setProjectLoading(true)
          const response = await projectApi.getProjectById(preSelectedProjectId)
          const projectData = response.data.data 
          console.log("Fetched project:", projectData)
          if (projectData) {
            setSelectedProject({
              _id: projectData._id,
              title: projectData.title,
              location: projectData.location,
              status: projectData.status,
              startDate: projectData.startDate,
              estimatedEndDate: projectData.estimatedEndDate,
              client: projectData.client || projectData.clientId,
            })
          }
        } catch (error) {
          console.error("Error fetching project:", error)
        } finally {
          setProjectLoading(false)
        }
      }
      fetchProject()
    }
  }, [preSelectedProjectId])

  // Search projects function
  const searchProjectsAPI = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProjects([])
      return
    }

    setProjectLoading(true)
    try {
      const response = await projectApi.searchProjects(query)
      console.log("Project search response:", response.data)
      
      let projectsData = []
      if (response.data.data) {
        projectsData = response.data.data
      } else if (Array.isArray(response.data)) {
        projectsData = response.data
      } else {
        projectsData = []
      }
      
      console.log("Parsed projects:", projectsData)
      setProjects(projectsData)
    } catch (error) {
      console.error("Error searching projects:", error)
      setProjects([])
    } finally {
      setProjectLoading(false)
    }
  }, [])

  // Debounced search function
  const debouncedSearchProjects = useMemo(
    () => debounce((query: string) => {
      searchProjectsAPI(query)
    }, 500),
    [searchProjectsAPI]
  )

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchProjects.cancel()
    }
  }, [debouncedSearchProjects])

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setProjectSearchOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProject) {
      alert("Please select a project")
      return
    }

    if (!formData.amount || !formData.method) {
      alert("Please fill in all required fields")
      return
    }

    const transactionData: CreateManualTransactionData = {
      projectId: selectedProject._id,
      amount: parseFloat(formData.amount),
      method: formData.method as "cash" | "cheque" | "upi" | "bank_transfer" | "other",
      paymentReference: formData.paymentReference || undefined,
      notes: formData.notes || undefined,
      paidAt: formData.paidAt || undefined,
    }
    
    await onSubmit(transactionData)
  }

  const isProjectSelectionDisabled = !!preSelectedProjectId

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Project Selection
          </CardTitle>
          <CardDescription>
            Search and select the project for this transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project *</Label>
            {isProjectSelectionDisabled ? (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium">{selectedProject?.title || "Loading..."}</div>
                {selectedProject && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Pre-selected project
                  </div>
                )}
              </div>
            ) : (
              <Popover open={projectSearchOpen} onOpenChange={setProjectSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={projectSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedProject ? selectedProject.title : "Search and select project..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search projects..."
                      value={projectSearchValue}
                      onValueChange={(value) => {
                        setProjectSearchValue(value)
                        debouncedSearchProjects(value)
                      }}
                    />
                    <CommandEmpty>
                      {projectLoading ? "Searching..." : projects.length === 0 ? "No projects found." : "Type to search projects"}
                    </CommandEmpty>
                    <CommandGroup>
                      {projects.map((project) => (
                        <CommandItem
                          key={project._id}
                          value={project.title}
                          onSelect={() => handleProjectSelect(project)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProject?._id === project._id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Client: {project.client?.name || project.clientId?.name || 'N/A'} • Status: {project.status} • Location: {project.location}
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

          {/* Selected Project Display */}
          {selectedProject && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Selected Project:</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Title:</strong> {selectedProject.title}</div>
                <div><strong>Client:</strong> {selectedProject.client?.name || selectedProject.clientId?.name || 'N/A'}</div>
                <div><strong>Location:</strong> {selectedProject.location}</div>
                <div><strong>Status:</strong> {selectedProject.status}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Enter the payment details for this transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => handleInputChange("method", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Payment Reference</Label>
              <Input
                id="paymentReference"
                placeholder="Reference number, cheque number, UPI ID, etc."
                value={formData.paymentReference}
                onChange={(e) => handleInputChange("paymentReference", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidAt">Payment Date</Label>
              <Input
                id="paidAt"
                type="date"
                value={formData.paidAt}
                onChange={(e) => handleInputChange("paidAt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this payment..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading || !selectedProject}
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Transaction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
