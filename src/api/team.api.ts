import { api } from "../utils/axiosInstance";

export const teamApi = {
  // Public: Get the team (leadership and employees)
  getTeam: () => api.get('/team'),

  // Admin: Add a leadership member
  addLeadershipMember: (formData: FormData) =>
    api.post('/team/leadership', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Add an employee
  addEmployee: (formData: FormData) =>
    api.post('/team/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Update a leadership member by index
  updateLeadershipMember: (index: number, formData: FormData) =>
    api.put(`/team/leadership/${index}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Update an employee by index
  updateEmployee: (index: number, formData: FormData) =>
    api.put(`/team/employees/${index}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Delete a leadership member by index
  deleteLeadershipMember: (index: number) =>
    api.delete(`/team/leadership/${index}`),

  // Admin: Delete an employee by index
  deleteEmployee: (index: number) =>
    api.delete(`/team/employees/${index}`),
};
