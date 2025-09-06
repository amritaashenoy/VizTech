// src/services/projectService.js
import { supabase } from '../config/supabase';

// Create a new project
export const createProject = async (projectData) => {
  try {

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get user's projects
export const getUserProjects = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')

      .select('*')

      .contains('members', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

// Get project by ID
export const getProjectById = async (projectId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};


// Update project

export const updateProject = async (projectId, updates) => {
  try {

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (projectId) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }

};

// Add member to project
export const addProjectMember = async (projectId, userId) => {
  try {
    // First get current members
    const { data: project } = await getProjectById(projectId);
    const currentMembers = project.members || [];
    
    // Add new member if not already in array
    if (!currentMembers.includes(userId)) {
      const updatedMembers = [...currentMembers, userId];
      
      const { data, error } = await supabase
        .from('projects')
        .update({ members: updatedMembers })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    
    return project;
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
};
