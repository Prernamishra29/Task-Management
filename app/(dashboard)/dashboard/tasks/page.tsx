'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { TaskCard } from '@/components/dashboard/task-card';
import { useAuth } from '@/hooks/use-auth';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdBy: {
    _id: string;
    name: string;
  };
  assignedTo: {
    _id: string;
    name: string;
  };
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data);
        setFilteredTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = tasks;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply assignment filter
    if (assignmentFilter === 'assigned') {
      result = result.filter(task => task.assignedTo._id === user?.id);
    } else if (assignmentFilter === 'created') {
      result = result.filter(task => task.createdBy._id === user?.id);
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, priorityFilter, assignmentFilter, tasks, user]);

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground">
            View, filter, and manage all your tasks in one place.
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/tasks/create')}>
          <Icons.add className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by assignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="assigned">Assigned to Me</SelectItem>
            <SelectItem value="created">Created by Me</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Icons.inbox className="mb-4 h-10 w-10 text-muted-foreground/60" />
            <h3 className="font-semibold">No tasks found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {tasks.length === 0
                ? "You don't have any tasks yet. Create your first task to get started."
                : "No tasks match your current filters. Try adjusting your search criteria."}
            </p>
            {tasks.length === 0 && (
              <Button className="mt-4" onClick={() => router.push('/dashboard/tasks/create')}>
                Create Task
              </Button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => router.push(`/dashboard/tasks/${task._id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}