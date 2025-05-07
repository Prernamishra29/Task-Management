import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <Icons.logo className="h-6 w-6 mr-2" />
          <span className="font-bold">TaskFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sign In
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Manage Tasks, Boost Productivity
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our intuitive task management system helps teams collaborate, organize, and track
                    work efficiently. Stay on top of deadlines and achieve your goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px] bg-muted/40 rounded-lg overflow-hidden shadow-lg p-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30"></div>
                  <div className="relative z-10 grid gap-4">
                    <div className="bg-card rounded-md p-4 shadow-sm border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm font-medium">High Priority</span>
                      </div>
                      <h3 className="font-semibold">Complete project proposal</h3>
                      <p className="text-sm text-muted-foreground mt-1">Due in 2 days</p>
                    </div>
                    <div className="bg-card rounded-md p-4 shadow-sm border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Medium Priority</span>
                      </div>
                      <h3 className="font-semibold">Review marketing materials</h3>
                      <p className="text-sm text-muted-foreground mt-1">Due next week</p>
                    </div>
                    <div className="bg-card rounded-md p-4 shadow-sm border opacity-75">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Low Priority</span>
                      </div>
                      <h3 className="font-semibold">Schedule team meeting</h3>
                      <p className="text-sm text-muted-foreground mt-1">Due in 2 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything you need to manage tasks
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our platform provides all the tools you need to create, assign, and manage tasks efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.tasks className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-muted-foreground">
                  Create, update, and organize tasks with ease. Set priorities and deadlines.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Team Collaboration</h3>
                <p className="text-center text-muted-foreground">
                  Assign tasks to team members and collaborate in real-time with notifications.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.dashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dashboard View</h3>
                <p className="text-center text-muted-foreground">
                  Get a quick overview of your tasks, upcoming deadlines, and team workload.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Search</h3>
                <p className="text-center text-muted-foreground">
                  Quickly find tasks with powerful search and filtering options.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Notifications</h3>
                <p className="text-center text-muted-foreground">
                  Stay updated with real-time notifications about task assignments and updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full p-2 bg-primary/10">
                  <Icons.mobile className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Responsive Design</h3>
                <p className="text-center text-muted-foreground">
                  Access your tasks from any device with our fully responsive design.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}