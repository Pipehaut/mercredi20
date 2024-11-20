import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Cigarette, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Cigarette className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold">QuitCoach</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/dashboard' ? 'bg-primary/10' : ''
                    }`}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/sessions"
                      className={`text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                        isAdminPage ? 'bg-primary/10' : ''
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Gérer les séances
                    </Link>
                  )}
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button>Connexion</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}