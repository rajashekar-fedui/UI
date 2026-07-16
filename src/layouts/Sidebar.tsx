/**
 * Sidebar Component
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface SidebarProps {
  open: boolean;
  onToggle?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRoles?: UserRole[];
}

function Sidebar({ open }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
        </svg>
      ),
    },
    {
      label: 'Users',
      path: '/dashboard/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2H6v-2z" />
        </svg>
      ),
      requiredRoles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.requiredRoles || (user && item.requiredRoles.includes(user.role))
  );

  return (
    <aside
      className={`
        bg-gray-900 text-white transition-all duration-300
        ${open ? 'w-64' : 'w-20'}
      `}
    >
      <div className="p-4 border-b border-gray-800">
        <h1 className={`font-bold text-xl ${!open && 'hidden'}`}>SaaS App</h1>
        {!open && <span className="text-2xl">S</span>}
      </div>
      
      <nav className="p-4 space-y-2">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${location.pathname === item.path
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-gray-800'}
            `}
            title={!open ? item.label : undefined}
          >
            {item.icon}
            {open && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
