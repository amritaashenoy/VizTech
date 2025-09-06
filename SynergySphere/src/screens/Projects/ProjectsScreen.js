// src/screens/Projects/ProjectsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProjects, createProject } from '../../services/projectService';
import { Ionicons } from '@expo/vector-icons';

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await getUserProjects(user.id);
      setProjects(userProjects);

    } catch (error) {
      Alert.alert('Error', 'Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    Alert.prompt(
      'Create New Project',

      'Enter project name:',
      [
        {

          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: async (name) => {
            if (name && name.trim()) {
              try {
                const newProject = await createProject({

                  name: name.trim(),
                  description: '',

                  created_by: user.id,
                  members: [user.id],
                });
                
                setProjects(prev => [newProject, ...prev]);
                
                // Navigate to the new project
                navigation.navigate('ProjectDetail', { 
                  projectId: newProject.id,
                  projectName: newProject.name
                });
              } catch (error) {

                Alert.alert('Error', 'Failed to create project');
                console.error('Error creating project:', error);
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderProject = ({ item }) => (

    <TouchableOpacity 
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { 
        projectId: item.id,
        projectName: item.name
      })}
    >
      <View style={styles.projectIcon}>
        <Ionicons name="folder" size={24} color="#007AFF" />
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectDescription} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        <Text style={styles.memberCount}>
          {item.members?.length || 1} members

        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Projects</Text>
      
      {projects.length === 0 ? (

        <View style={styles.emptyState}>
          <Ionicons name="folder-open" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No projects yet</Text>

          <Text style={styles.emptyStateSubtext}>
            Create your first project to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}

          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadProjects}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleCreateProject}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  title: {

    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  projectCard: {
    flexDirection: 'row',

    alignItems: 'center',
    backgroundColor: 'white',

    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  projectIcon: {
    marginRight: 15,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,

    color: '#333',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  memberCount: {
    color: '#888',
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,

  },
});

export default ProjectsScreen;
