'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type User = {
  _id: string;
  name: string;
  email: string;
};

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
    email?: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email?: string;
  };
  notifications: {
    _id: string;
    message: string;
    createdAt: string;
    read: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
};

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority',
  }),
  status: z.enum(['todo', 'in-progress', 'completed'], {
    required_error: 'Please select a status',
  }),
  assignedTo: z.string({
    required_error: 'Please assign this task to someone',
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function TaskDetailsPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      assignedTo: '',
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks/${params.id}`);
        setTask(response.data);
        
        // Set form values
        form.setValue('title', response.data.title);
        form.setValue('description', response.data.description);
        form.setValue('status', response.data.status);
        form.setValue('priority', response.data.priority);
        form.setValue('dueDate', new Date(response.data.dueDate));
        form.setValue('assignedTo', response.data.assignedTo._id);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast({
          title: 'Error',
          description: 'Failed to load task details. Please try again.',
          variant: 'destructive',
        });
        router.push('/dashboard/tasks');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
    fetchUsers();
  }, [params.id, form, toast, router]);

  const onSubmit = async (data: TaskFormValues) => {
    setIsSaving(true);
    try {
      const response = await axios.put(`${API_URL}/tasks/${params.id}`, {
        ...data,
        dueDate: data.dueDate.toISOString(),
      });
      
      setTask(response.data);
      setIsEditMode(false);
      
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/tasks/${params.id}`);
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully!',
      });
      
      router.push('/dashboard/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-500 bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading || !task) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const isCreator = user?.id === task.createdBy._id;
  const isAssignee = user?.id === task.assignedTo._id;
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';

  return (
    <div className="max-w-3xl mx-auto">
      {isEditMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>
              Update the details of this task
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
              </div>
            </div>
            <div className="flex gap-2">
              {isCreator && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1 whitespace-pre-line">{task.description}</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                  <p className="mt-1">{task.createdBy.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                  <p className="mt-1">{task.assignedTo.name}</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                  <p className={cn("mt-1", isOverdue && "text-destructive")}>
                    {format(new Date(task.dueDate), 'PPP')}
                    {isOverdue && ` (Overdue by ${formatDistanceToNow(new Date(task.dueDate))})`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="mt-1">{format(new Date(task.createdAt), 'PPP')}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button variant="outline" onClick={() => router.push('/dashboard/tasks')}>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
            
            {isAssignee && task.status !== 'completed' && (
              <Button onClick={async () => {
                try {
                  const response = await axios.put(`${API_URL}/tasks/${params.id}`, {
                    status: 'completed',
                  });
                  setTask(response.data);
                  toast({
                    title: 'Success',
                    description: 'Task marked as completed!',
                  });
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to update task status.',
                    variant: 'destructive',
                  });
                }
              }}>
                <Icons.check className="mr-2 h-4 w-4" />
                Mark as Completed
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}