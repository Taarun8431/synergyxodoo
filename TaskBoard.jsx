import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Calendar, User, AlertCircle } from 'lucide-react';

const TaskBoard = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // Handle drag start
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      // Optimistically update the UI
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);

      // Update task status on server
      await axios.patch(`/api/tasks/${draggedTask.id}`, {
        status: newStatus
      });

      // Refresh tasks to ensure consistency
      await fetchTasks();
    } catch (err) {
      // Revert optimistic update on error
      await fetchTasks();
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setDraggedTask(null);
    }
  };

  // Group tasks by status
  const tasksByStatus = {
    'To-Do': tasks.filter(task => task.status === 'To-Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done')
  };

  // Check if deadline is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && new Date(deadline).toDateString() !== new Date().toDateString();
  };

  // Format deadline for display
  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={fetchTasks}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statusColumns = [
    { key: 'To-Do', title: 'To-Do', color: 'bg-gray-100' },
    { key: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
    { key: 'Done', title: 'Done', color: 'bg-green-100' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {statusColumns.map((column, columnIndex) => (
        <div key={column.key} className="space-y-6 slide-in-up" style={{ animationDelay: `${columnIndex * 0.2}s` }}>
          {/* Column Header */}
          <div className="flex items-center justify-between p-4 glass-card rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                column.key === 'To-Do' ? 'bg-gray-400' :
                column.key === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
              <h3 className="font-bold text-lg text-gray-900">{column.title}</h3>
            </div>
            <Badge className="bg-white/80 text-gray-700 font-semibold px-3 py-1 rounded-full shadow-sm">
              {tasksByStatus[column.key].length}
            </Badge>
          </div>
          
          {/* Task Column */}
          <div
            className="status-column drop-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className="space-y-4">
              {tasksByStatus[column.key].map((task, taskIndex) => (
                <Card
                  key={task.id}
                  className="task-card group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  style={{ animationDelay: `${taskIndex * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {task.title}
                      </CardTitle>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                        column.key === 'To-Do' ? 'bg-gray-400' :
                        column.key === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                    {task.description && (
                      <CardDescription className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {task.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {task.assignee && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <span className="truncate font-medium">{task.assignee}</span>
                        </div>
                      )}
                      {task.deadline && (
                        <div className={`flex items-center gap-2 text-sm ${
                          isOverdue(task.deadline) ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isOverdue(task.deadline) ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            <Calendar className={`h-3 w-3 ${
                              isOverdue(task.deadline) ? 'text-red-500' : 'text-gray-500'
                            }`} />
                          </div>
                          <span className="font-medium">{formatDeadline(task.deadline)}</span>
                          {isOverdue(task.deadline) && (
                            <span className="text-red-500 font-semibold text-xs">(Overdue)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {tasksByStatus[column.key].length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">
                    No tasks in {column.title.toLowerCase()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Drag tasks here or create new ones
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
