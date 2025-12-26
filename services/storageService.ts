import { Student } from '../types';
import { INITIAL_STUDENTS } from '../constants';

const STORAGE_KEY = 'grad_map_data_v1';

export const getStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with seed data if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load students', e);
    // If JSON parse fails, reset to initial
    return INITIAL_STUDENTS;
  }
};

export const saveStudent = (student: Student): Student[] => {
  const current = getStudents();
  const updated = [student, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateStudent = (updatedStudent: Student): Student[] => {
  const current = getStudents();
  const index = current.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    current[index] = updatedStudent;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  return current;
};

export const deleteStudent = (id: string): Student[] => {
  const current = getStudents();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Force reset local storage to seed data (useful for debugging or clearing bad data)
export const resetStudents = (): Student[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
};
