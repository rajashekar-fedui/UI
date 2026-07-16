/**
 * Dashboard Page
 */

import { useAuth } from '@/hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '1,234' },
          { label: 'Active Users', value: '856' },
          { label: 'Revenue', value: '$12,500' },
          { label: 'Growth', value: '+12%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600">
          This is your dashboard. You can add more features and widgets here.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
