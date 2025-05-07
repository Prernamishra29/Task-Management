'use client';

import { formatDistanceToNow, format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

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

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  showBadge?: boolean;
};

export function TaskCard({ task, onClick, showBadge = false }: TaskCardProps) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 rounded-full bg-destructive" />;
      case 'medium':
        return <div className="w-2 h-2 rounded-full bg-orange-500" />;
      case 'low':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
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
    }
  };

  return (
    <Card 
      className={cn(
        "hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden",
        isOverdue && "border-destructive/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getPriorityIcon(task.priority)}
              <h3 className="font-medium">{task.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2 items-center text-xs mt-2">
              {getStatusBadge(task.status)}
              
              <div className={cn(
                "flex items-center gap-1",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                <Icons.calendar className="h-3 w-3" />
                <span>
                  {isOverdue
                    ? `Overdue by ${formatDistanceToNow(dueDate)}`
                    : format(dueDate, 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Icons.user className="h-3 w-3" />
                <span>Assigned to {task.assignedTo.name}</span>
              </div>
            </div>
          </div>
          {showBadge && isOverdue && (
            <div className="shrink-0">
              <Badge variant="destructive">Overdue</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}