import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Home, 
  LineChart, 
  Zap, 
  Lightbulb, 
  Settings, 
  Calendar, 
  BatteryMedium,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={cn(
      'flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 transition-all duration-300 ease-in-out relative',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 shadow-sm"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={cn("flex items-center mb-8 px-2", collapsed && "justify-center")}>
        <BatteryMedium size={24} className="text-green-600 mr-2" />
        {!collapsed && <h1 className="text-xl font-bold text-green-700">Energy Dashboard</h1>}
      </div>
      
      <nav className="space-y-1 flex-1">
        <NavItem href="/" icon={<Home size={20} />} text="Dashboard" collapsed={collapsed} />
        <NavItem href="/appliances" icon={<Zap size={20} />} text="Appliances" collapsed={collapsed} />
        <NavItem href="/usage" icon={<LineChart size={20} />} text="Energy Usage" collapsed={collapsed} />
        <NavItem href="/recommendations" icon={<Lightbulb size={20} />} text="Recommendations" collapsed={collapsed} />
        <NavItem href="/settings" icon={<Settings size={20} />} text="Settings" collapsed={collapsed} />
      </nav>
      
      {!collapsed && (
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Energy Tip</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Turn off appliances at night to reduce phantom energy consumption.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, collapsed }) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center py-2 px-3 rounded-md text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors",
        collapsed && "justify-center"
      )}
      title={collapsed ? text : undefined}
    >
      <span className={cn("text-slate-500", collapsed ? "mr-0" : "mr-3")}>{icon}</span>
      {!collapsed && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
