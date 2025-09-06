import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Button } from './components/ui/button.jsx';
import { Input } from './components/ui/input.jsx';
import { Textarea } from './components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog.jsx';
import { Label } from './components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select.jsx';
import { ArrowLeft, Users, Plus, Calendar, User } from 'lucide-react';
import TaskBoard from './TaskBoard.jsx';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'To-Do',
    deadline: '',
    assignee: ''
  });
  const [taskBoardKey, setTaskBoardKey] = useState(0);

  // Fetch project details from API
  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details. Please try again.');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  // Handle task form input changes
  const handleTaskInputChange = (name, value) => {
    setTaskFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle task form submission
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskFormData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const taskData = {
        ...taskFormData,
        deadline: taskFormData.deadline ? new Date(taskFormData.deadline).toISOString() : null
      };

      await axios.post(`/api/projects/${id}/tasks`, taskData);
      
      // Reset form and close modal
      setTaskFormData({
        title: '',
        description: '',
        status: 'To-Do',
        deadline: '',
        assignee: ''
      });
      setIsCreateTaskModalOpen(false);
      
      // Refresh task board
      setTaskBoardKey(prev => prev + 1);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={fetchProject}>
              Try Again
            </Button>
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="slide-in-up">
        <div className="flex items-center gap-6 mb-8">
          <button 
            onClick={handleBackClick}
            className="btn-secondary flex items-center gap-3 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>
        </div>
        
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {project.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {project.description}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-center slide-in-left">
        <Dialog open={isCreateTaskModalOpen} onOpenChange={setIsCreateTaskModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-primary flex items-center gap-3 px-8 py-4 text-lg font-semibold">
              <Plus className="h-5 w-5" />
              Create New Task
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to this project.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTaskSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input
                    id="task-title"
                    value={taskFormData.title}
                    onChange={(e) => handleTaskInputChange('title', e.target.value)}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={taskFormData.description}
                    onChange={(e) => handleTaskInputChange('description', e.target.value)}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    value={taskFormData.status}
                    onValueChange={(value) => handleTaskInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To-Do">To-Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-deadline">Deadline</Label>
                  <Input
                    id="task-deadline"
                    type="date"
                    value={taskFormData.deadline}
                    onChange={(e) => handleTaskInputChange('deadline', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-assignee">Assignee</Label>
                  <Input
                    id="task-assignee"
                    value={taskFormData.assignee}
                    onChange={(e) => handleTaskInputChange('assignee', e.target.value)}
                    placeholder="Enter assignee name or email"
                  />
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm mb-4">{error}</div>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 slide-in-up">
        <Card className="glass-card card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.members && project.members.length > 0 ? (
              <div className="space-y-3">
                {project.members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{member}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No team members added yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Project Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Created:</span>
                <span className="text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {project.updatedAt && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Updated:</span>
                  <span className="text-gray-900">{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Total Tasks:</span>
                <span className="text-gray-900 font-semibold">{project.taskCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Team Size:</span>
                <span className="text-gray-900 font-semibold">{project.members?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Board */}
      <div className="slide-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Task Board
          </h2>
          <p className="text-gray-600">Drag and drop tasks to manage your workflow</p>
        </div>
        <TaskBoard key={taskBoardKey} projectId={id} />
      </div>
    </div>
  );
};

export default ProjectDetail;
