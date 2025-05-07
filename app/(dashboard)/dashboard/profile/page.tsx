'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  profilePicture: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      profilePicture: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/users/${user.id}`, {
        name: data.name,
        profilePicture: data.profilePicture,
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and edit your profile information
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback className="text-lg">{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input value={user?.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Your email address cannot be changed
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="ml-auto">
                {isLoading ? (
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
    </div>
  );
}