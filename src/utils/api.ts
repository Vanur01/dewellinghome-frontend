// Re-export all APIs from the new organized structure in /api folder
export * from '../api';

// For backward compatibility, export the api instance
export { api } from './axiosInstance';
