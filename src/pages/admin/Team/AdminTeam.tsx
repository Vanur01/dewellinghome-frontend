import React, { useEffect, useState } from 'react';
import { useAdminTeamStore, LeadershipMember, Employee } from '../../../store/admin/adminTeam.store';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { AddTeamModal } from './AddTeamModal';
import { EditTeamModal } from './editTeamModal';
import { Pencil, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const emptyLeadership: LeadershipMember = {
  name: '',
  position: '',
  image: '',
  bio: '',
  social: { linkedin: '', twitter: '', instagram: '' },
};

const emptyEmployee: Employee = {
  name: '',
  position: '',
  image: '',
};

export default function AdminTeam() {
  const {
    team,
    loading,
    error,
    fetchTeam,
    addLeadershipMember,
    addEmployee,
    updateLeadershipMember,
    updateEmployee,
    deleteLeadershipMember,
    deleteEmployee,
  } = useAdminTeamStore();

  // Add modals
  const [showAddLeadership, setShowAddLeadership] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  // Edit modals
  const [editLeadershipIdx, setEditLeadershipIdx] = useState<number | null>(null);
  const [editEmployeeIdx, setEditEmployeeIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line
  }, []);

  // Add handlers
  const handleAddLeadership = async (form: LeadershipMember, image: File | null) => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('bio', form.bio);
    formData.append('social', JSON.stringify(form.social));
    if (image) formData.append('image', image);
    await addLeadershipMember(formData);
    setShowAddLeadership(false);
  };
  const handleAddEmployee = async (form: Employee, image: File | null) => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    if (image) formData.append('image', image);
    await addEmployee(formData);
    setShowAddEmployee(false);
  };

  // Edit handlers
  const handleEditLeadership = (idx: number) => setEditLeadershipIdx(idx);
  const handleEditEmployee = (idx: number) => setEditEmployeeIdx(idx);
  const handleSaveLeadership = async (form: LeadershipMember, image: File | null) => {
    if (editLeadershipIdx === null) return;
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    formData.append('bio', form.bio);
    formData.append('social', JSON.stringify(form.social));
    if (image) formData.append('image', image);
    await updateLeadershipMember(editLeadershipIdx, formData);
    setEditLeadershipIdx(null);
  };
  const handleSaveEmployee = async (form: Employee, image: File | null) => {
    if (editEmployeeIdx === null) return;
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('position', form.position);
    if (image) formData.append('image', image);
    await updateEmployee(editEmployeeIdx, formData);
    setEditEmployeeIdx(null);
  };

  // Delete handlers
  const handleDeleteLeadership = async (idx: number) => {
    await deleteLeadershipMember(idx);
  };
  const handleDeleteEmployee = async (idx: number) => {
    await deleteEmployee(idx);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-medium mb-8 text-center tracking-tight">Team Management</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium tracking-tight">Leadership</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md px-6 py-2 rounded-lg transition-all duration-150" onClick={() => setShowAddLeadership(true)}>+ Add Leadership</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(team?.leadership ?? []).length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">No leadership members present.</div>
          ) : (
            (team?.leadership ?? []).map((member, idx) => (
              <Card key={idx} className="p-6 flex flex-col gap-3 min-h-[180px] shadow rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                  <img src={member.image || '/default-avatar.png'} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-red-200 shadow-sm bg-gray-100" />
                  <div>
                    <div className="font-bold text-lg">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.position}</div>
                  </div>
                </div>
                <div className="text-sm mt-2 text-gray-700 line-clamp-3">{member.bio}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="icon" variant="outline" className="hover:bg-red-50" onClick={() => handleEditLeadership(idx)} aria-label="Edit Leadership Member">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="hover:bg-red-100"
                        aria-label="Delete Leadership Member"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                          onClick={() => handleDeleteLeadership(idx)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium tracking-tight">Employees</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md px-6 py-2 rounded-lg transition-all duration-150" onClick={() => setShowAddEmployee(true)}>+ Add Employee</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(team?.employees ?? []).length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">No employees present.</div>
          ) : (
            (team?.employees ?? []).map((emp, idx) => (
              <Card key={idx} className="p-6 flex flex-col gap-3 min-h-[140px] shadow rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                  <img src={emp.image || '/default-avatar.png'} alt={emp.name} className="w-20 h-20 rounded-full object-cover border-2 border-red-200 shadow-sm bg-gray-100" />
                  <div>
                    <div className="font-bold text-lg">{emp.name}</div>
                    <div className="text-sm text-gray-600">{emp.position}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="icon" variant="outline" className="hover:bg-red-50" onClick={() => handleEditEmployee(idx)} aria-label="Edit Employee">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="hover:bg-red-100"
                        aria-label="Delete Employee"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                          onClick={() => handleDeleteEmployee(idx)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add Leadership Modal */}
      <AddTeamModal
        open={showAddLeadership}
        onOpenChange={setShowAddLeadership}
        onSubmit={handleAddLeadership}
        loading={loading}
        isLeadership={true}
        initialValues={emptyLeadership}
      />
      {/* Add Employee Modal */}
      <AddTeamModal
        open={showAddEmployee}
        onOpenChange={setShowAddEmployee}
        onSubmit={handleAddEmployee}
        loading={loading}
        isLeadership={false}
        initialValues={emptyEmployee}
      />
      {/* Edit Leadership Modal */}
      <EditTeamModal
        open={editLeadershipIdx !== null}
        onOpenChange={() => setEditLeadershipIdx(null)}
        onSubmit={handleSaveLeadership}
        loading={loading}
        isLeadership={true}
        initialValues={editLeadershipIdx !== null && team ? team.leadership[editLeadershipIdx] : emptyLeadership}
      />
      {/* Edit Employee Modal */}
      <EditTeamModal
        open={editEmployeeIdx !== null}
        onOpenChange={() => setEditEmployeeIdx(null)}
        onSubmit={handleSaveEmployee}
        loading={loading}
        isLeadership={false}
        initialValues={editEmployeeIdx !== null && team ? team.employees[editEmployeeIdx] : emptyEmployee}
      />
    </div>
  );
}
