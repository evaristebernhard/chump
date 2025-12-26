import { Student } from '../types';
import { INITIAL_STUDENTS } from '../constants';
import { supabase } from './supabase';

const TABLE_NAME = 'students';

export const getStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('createdAt', { ascending: false }); // Sort by newest first

    if (error) {
      console.error('Supabase error fetching students:', error);
      // Fallback: If table doesn't exist or error, return empty array to prevent app crash
      return []; 
    }
    
    // Map database columns to CamelCase if necessary, 
    // but assuming we save them exactly as the interface defines.
    return data as Student[];
  } catch (e) {
    console.error('Failed to load students', e);
    return [];
  }
};

export const saveStudent = async (student: Student): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert([student]);

    if (error) {
      console.error('Error saving student:', error);
      alert('保存失败 (Save failed): ' + error.message);
    }
  } catch (e) {
    console.error('Exception saving student:', e);
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      alert('删除失败 (Delete failed): ' + error.message);
    }
  } catch (e) {
    console.error('Exception deleting student:', e);
  }
};

// Reset functionality: Deletes all records and re-inserts seed data
// Warning: This affects the shared database!
export const resetStudents = async (): Promise<void> => {
  try {
    // 1. Delete all rows
    const { error: deleteError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .neq('id', '0'); // Hack to delete all rows since we need a where clause usually

    if (deleteError) {
      console.error('Error clearing table:', deleteError);
      return;
    }

    // 2. Insert seed data
    const { error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert(INITIAL_STUDENTS);

    if (insertError) {
      console.error('Error inserting seed data:', insertError);
    }
  } catch (e) {
    console.error('Exception resetting data:', e);
  }
};
