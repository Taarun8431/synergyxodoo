import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Button } from './components/ui/button.jsx';
import { Input } from './components/ui/input.jsx';
import { Textarea } from './components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog.jsx';
import { Label } from './components/ui/label.jsx';
import { Plus, Users, Calendar } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    members: ''
  });
  
  const navigate = useNavigate();

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const projectData = {
        ...formData,
        members: formData.members.split(',').map(member => member.trim()).filter(member => member)
      };

      await axios.post('/api/projects', projectData);
      
      // Reset form and close modal
      setFormData({ title: '', description: '', members: '' });
      setIsCreateModalOpen(false);
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle project card click
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 slide-in-up">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Your Projects
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your projects and collaborate with your team in a beautiful, modern interface
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center slide-in-left">
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-sm font-medium text-gray-700">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary flex items-center gap-3 px-8 py-4 text-lg font-semibold">
              <Plus className="h-5 w-5" />
              Create New Project
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your tasks and collaborate with your team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="members">Team Members</Label>
                  <Input
                    id="members"
                    name="members"
                    value={formData.members}
                    onChange={handleInputChange}
                    placeholder="Enter emails or names (comma-separated)"
                  />
                  <p className="text-sm text-gray-500">
                    Separate multiple members with commas
                  </p>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm mb-4">{error}</div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {projects.length === 0 && !loading ? (
        <div className="text-center py-20 slide-in-up">
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-8 float">
            <Calendar className="h-16 w-16 text-blue-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No projects yet</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            Get started by creating your first project and begin organizing your work
          </p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg font-semibold mx-auto"
          >
            <Plus className="h-5 w-5" />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                className="glass-card card-hover cursor-pointer group"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2 text-gray-600">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{project.memberCount || project.members?.length || 0} team members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
