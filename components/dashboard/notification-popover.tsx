'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type TaskWithNotifications = {
  _id: string;
  title: string;
  notifications: {
    _id: string;
    message: string;
    createdAt: string;
    read: boolean;
  }[];
};

export function NotificationPopover() {
  const [notifications, setNotifications] = useState<TaskWithNotifications[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks?status=all`);
      const tasksWithNotifications = response.data.filter(
        (task: TaskWithNotifications) => task.notifications && task.notifications.length > 0
      );
      setNotifications(tasksWithNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (taskId: string, notificationId: string) => {
    try {
      await axios.patch(`${API_URL}/tasks/${taskId}/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(task => {
          if (task._id === taskId) {
            return {
              ...task,
              notifications: task.notifications.map(notification => {
                if (notification._id === notificationId) {
                  return { ...notification, read: true };
                }
                return notification;
              }),
            };
          }
          return task;
        })
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Calculate total unread notifications
  const unreadCount = notifications.reduce((count, task) => {
    return count + task.notifications.filter(n => !n.read).length;
  }, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icons.bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal">
            Mark all as read
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Icons.inbox className="mb-2 h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="grid gap-1 p-1">
              {notifications.map((task) =>
                task.notifications.map((notification) => (
                  <button
                    key={notification._id}
                    className={cn(
                      "flex flex-col gap-1 rounded-md p-3 text-left text-sm transition-colors hover:bg-muted",
                      !notification.read && "bg-muted/50"
                    )}
                    onClick={() => markAsRead(task._id, notification._id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium">{task.title}</span>
                      {!notification.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.message}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}