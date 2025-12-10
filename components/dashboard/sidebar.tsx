'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  Menu, 
  UtensilsCrossed, 
  ChevronDown, 
  LayoutDashboard, 
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Pill,
  FileText
} from 'lucide-react';
import useSWR from 'swr';
import { TeamDataWithMembers } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export function Sidebar({ isMobileOpen, onMobileToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Save collapsed state to localStorage
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  // Check if user has a paid subscription
  const hasPaidPlan = teamData?.subscriptionStatus === 'active' || teamData?.subscriptionStatus === 'trialing';

  // Settings pages
  const settingsPages = [
    { href: '/dashboard/settings/team', icon: Users, label: 'Profile' },
    { href: '/dashboard/settings/general', icon: Settings, label: 'General' },
    { href: '/dashboard/settings/pdf', icon: FileText, label: 'PDF Settings' },
    { href: '/dashboard/settings/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/settings/security', icon: Shield, label: 'Security' }
  ];

  // Check if current pathname is one of the settings pages
  const isSettingsPageActive = settingsPages.some(page => pathname === page.href);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-56';
  const sidebarClasses = `
    ${sidebarWidth}
    bg-white lg:bg-gray-50 
    border-r border-gray-200 
    lg:block 
    ${isMobileOpen ? 'block' : 'hidden'}
    lg:relative 
    absolute inset-y-0 left-0 z-40 
    transform transition-all duration-300 ease-in-out 
    lg:translate-x-0 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    flex flex-col
  `;

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', show: hasPaidPlan },
    { href: '/dashboard/meals', icon: UtensilsCrossed, label: 'Meals', show: hasPaidPlan },
    { href: '/dashboard/exercises', icon: Dumbbell, label: 'Exercises', show: hasPaidPlan },
    { href: '/dashboard/supplements', icon: Pill, label: 'Supplements', show: hasPaidPlan },
    { href: '/dashboard/clients', icon: Users, label: 'Clients', show: hasPaidPlan },
  ];

  return (
    <aside className={sidebarClasses}>
      {/* Collapse button - only show on desktop */}
      <div className="hidden lg:flex items-center justify-end p-2 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="h-8 w-8 p-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Navigation items */}
        {navItems.map((item) => {
          if (!item.show) return null;
          
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={`shadow-none my-1 w-full ${
                  isCollapsed ? 'justify-center px-0' : 'justify-start'
                } ${isActive ? 'bg-gray-100' : ''}`}
                onClick={onMobileToggle}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}

        {/* Settings dropdown */}
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSettingsPageActive ? 'secondary' : 'ghost'}
                className={`shadow-none my-1 w-full justify-between ${
                  isSettingsPageActive ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {settingsPages.map((page) => (
                <DropdownMenuItem
                  key={page.href}
                  className="cursor-pointer"
                  asChild
                >
                  <Link
                    href={page.href}
                    className="flex items-center w-full"
                    onClick={onMobileToggle}
                  >
                    <page.icon className="h-4 w-4 mr-2" />
                    {page.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSettingsPageActive ? 'secondary' : 'ghost'}
                className={`shadow-none my-1 w-full justify-center px-0 ${
                  isSettingsPageActive ? 'bg-gray-100' : ''
                }`}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 ml-2">
              {settingsPages.map((page) => (
                <DropdownMenuItem
                  key={page.href}
                  className="cursor-pointer"
                  asChild
                >
                  <Link
                    href={page.href}
                    className="flex items-center w-full"
                    onClick={onMobileToggle}
                  >
                    <page.icon className="h-4 w-4 mr-2" />
                    {page.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </aside>
  );
}

