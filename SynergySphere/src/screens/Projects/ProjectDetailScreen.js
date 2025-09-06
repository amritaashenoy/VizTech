// src/screens/Projects/ProjectDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getProjectById } from '../../services/projectService';
import { Ionicons } from '@expo/vector-icons';

const ProjectDetailScreen = ({ route, navigation }) => {
  const { projectId, projectName } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    loadProject();
    
    // Update header title with project name
    if (projectName) {
      navigation.setOptions({ title: projectName });
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      
      // Update header title if we have the project data
      if (projectData.name) {
        navigation.setOptions({ title: projectData.name });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load project details');
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centerContainer}>
        <Text>Project not found</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {project.description || 'No description provided'}
            </Text>
            
            <Text style={styles.sectionTitle}>Project Info</Text>
            <View style={styles.infoItem}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.infoText}>Created by: You</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.infoText}>
                {project.members?.length || 1} team members
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.infoText}>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        );
      
      case 'tasks':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Tasks</Text>
            <View style={styles.placeholder}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>Tasks feature coming soon</Text>
            </View>
          </View>
        );
      
      case 'discussion':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Discussion</Text>
            <View style={styles.placeholder}>
              <Ionicons name="chatbubbles-outline" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>Discussion feature coming soon</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>

            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discussion' && styles.activeTab]}
          onPress={() => setActiveTab('discussion')}
        >
          <Text style={[styles.tabText, activeTab === 'discussion' && styles.activeTabText]}>
            Discussion

          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  tabBar: {
    flexDirection: 'row',

    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,

    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    backgroundColor: 'white',

    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {

    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',

  },

  placeholder: {
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    marginTop: 10,

    color: '#999',
    textAlign: 'center',
  },
});

export default ProjectDetailScreen;
