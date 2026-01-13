import { useState, useEffect } from "react";
import { useAdminUsersStore } from "../../../store/admin/adminUsers.store";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Trash2,
  UserCog,
  RefreshCw,
  UserPlus,
  Edit,
  Eye,
  KeyRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import ViewPasswordModal from "@/components/modals/ViewPasswordModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";

type RoleType = "client" | "admin";

const AdminUsersPage = () => {
  const {
    users = [],
    loading = false,
    error = null,
    pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 },
    fetchAllUsers,
    fetchUserById,
    deleteUser,
    createUser,
    updateUser,
    selectedUser = null,
  } = useAdminUsersStore();
  const { user } = useAuthStore();

  const [filterType, setFilterType] = useState("name");
  const [filterValue, setFilterValue] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewPasswordOpen, setViewPasswordOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedPasswordUser, setSelectedPasswordUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "client" as RoleType,
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "client" as RoleType,
  });

  useEffect(() => {
    if (users?.length === 0) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, users]);

  useEffect(() => {
    if (selectedUser && editDialogOpen) {
      setEditFormData({
        name: selectedUser?.name ?? "",
        email: selectedUser?.email ?? "",
        phone: selectedUser?.phone ?? "",
        address: selectedUser?.address ?? "",
        role: selectedUser?.role ?? "client",
      });
    }
  }, [selectedUser, editDialogOpen]);

  const handlePageChange = (page: number) => {
    const searchParams = buildSearchParams();
    fetchAllUsers(page, pagination?.limit ?? 10, searchParams);
  };

  const buildSearchParams = () => {
    const searchParams: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};

    if (filterValue) {
      searchParams[filterType as keyof typeof searchParams] = filterValue;
    }

    return searchParams;
  };

  const handleSearch = () => {
    const searchParams = buildSearchParams();
    fetchAllUsers(1, pagination?.limit ?? 10, searchParams);
  };

  const handleReset = () => {
    setFilterType("name");
    setFilterValue("");
    fetchAllUsers();
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.success("User deleted successfully");
    }
  };

  const handleEditClick = async (userId: string) => {
    await fetchUserById(userId);
    setEditDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setCreateDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "client",
      });
      toast.success("User created successfully");
      fetchAllUsers(1, pagination?.limit ?? 10);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(errorMessage);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser?._id) {
      try {
        await updateUser(selectedUser._id, editFormData);
        setEditDialogOpen(false);
        toast.success("User updated successfully");
        fetchAllUsers(pagination?.currentPage ?? 1, pagination?.limit ?? 10);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update user";
        toast.error(errorMessage);
      }
    }
  };

  const canDeleteUser = (targetUser: any) => {
    const currentUser = user;
    if (!targetUser || !currentUser) return false;
    if (targetUser?._id === currentUser?._id) return false;
    if (targetUser?.isOwner) return false;
    if (currentUser?.isOwner) return true;
    if (currentUser?.role === "admin") {
      return targetUser?.role === "user";
    }
    return false;
  };

  const renderPagination = () => {
    const currentPage = pagination?.currentPage ?? 1;
    const totalPages = pagination?.totalPages ?? 1;
    const pageItems = [];

    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis1">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= totalPages && i > 1) {
        pageItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis2">
          <span className="px-2">...</span>
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageItems;
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="py-2 text-xl">Users Management</CardTitle>
            <CardDescription>
              View, filter, and manage all users in the system
            </CardDescription>
          </div>
          <Button
            variant="default"
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-red-500"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={`Search by ${filterType}...`}
                  value={filterValue ?? ""}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <Button
                className="bg-red-500"
                onClick={handleSearch}
                variant="default"
              >
                Search
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No users found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user) => (
                      <TableRow key={user?._id ?? Math.random()}>
                        <TableCell className="font-medium">
                          {user?.name ?? "N/A"}
                        </TableCell>
                        <TableCell>{user?.email ?? "N/A"}</TableCell>
                        <TableCell>{user?.phone ?? "N/A"}</TableCell>
                        <TableCell>{user?.role ?? "N/A"}</TableCell>
                        <TableCell>
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                navigate(`/admin/users/${user?._id}`)
                              }
                              title="View User Details"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditClick(user?._id ?? "")}
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedPasswordUser({
                                  id: user?._id ?? "",
                                  name: user?.name ?? "",
                                });
                                setViewPasswordOpen(true);
                              }}
                              title="View Password"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedPasswordUser({
                                  id: user?._id ?? "",
                                  name: user?.name ?? "",
                                });
                                setChangePasswordOpen(true);
                              }}
                              title="Change Password"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>

                            {canDeleteUser(user) && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteClick(user?._id ?? "")
                                }
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && users?.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing{" "}
                {((pagination?.currentPage ?? 1) - 1) *
                  (pagination?.limit ?? 10) +
                  1}{" "}
                to{" "}
                {Math.min(
                  (pagination?.currentPage ?? 1) * (pagination?.limit ?? 10),
                  pagination?.totalRecords ?? 0
                )}{" "}
                of {pagination?.totalRecords ?? 0} users
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        (pagination?.currentPage ?? 1) > 1 &&
                        handlePageChange((pagination?.currentPage ?? 1) - 1)
                      }
                      className={
                        (pagination?.currentPage ?? 1) === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {renderPagination()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        (pagination?.currentPage ?? 1) <
                          (pagination?.totalPages ?? 1) &&
                        handlePageChange((pagination?.currentPage ?? 1) + 1)
                      }
                      className={
                        (pagination?.currentPage ?? 1) ===
                        (pagination?.totalPages ?? 1)
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as "client" | "admin",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              {/* Address */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      address: e.target.value,
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editFormData.role}
                    onValueChange={(value: RoleType) =>
                      setEditFormData({ ...editFormData, role: value })
                    }
                  >
                    <SelectTrigger id="edit-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Management Modals */}
      {selectedPasswordUser && (
        <>
          <ViewPasswordModal
            open={viewPasswordOpen}
            onClose={() => {
              setViewPasswordOpen(false);
              setSelectedPasswordUser(null);
            }}
            userId={selectedPasswordUser.id}
            userName={selectedPasswordUser.name}
          />
          <ChangePasswordModal
            open={changePasswordOpen}
            onClose={() => {
              setChangePasswordOpen(false);
              setSelectedPasswordUser(null);
            }}
            userId={selectedPasswordUser.id}
            userName={selectedPasswordUser.name}
          />
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;
