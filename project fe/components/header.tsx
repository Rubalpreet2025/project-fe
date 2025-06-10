import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${className}`}>
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 h-9 w-64 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center">
          <div className="mr-3 text-right">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
