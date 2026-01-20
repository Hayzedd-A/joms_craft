'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Package, DollarSign, Tag, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalFavourites: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalCategories: 0,
    totalFavourites: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, categoriesRes, insightsRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/categories'),
          fetch('/api/admin/insights'),
        ]);

        const itemsData = itemsRes.ok ? await itemsRes.json() : { items: [] };
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
        const insightsData = insightsRes.ok ? await insightsRes.json() : { totalFavourites: 0 };

        const totalRevenue = itemsData.items.reduce(
          (sum: number, item: { price: number }) => sum + (item.price || 0),
          0
        );

        setStats({
          totalItems: itemsData.items.length,
          totalCategories: categoriesData.categories.length,
          totalFavourites: insightsData.totalFavourites || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-green-500',
    },
    {
      title: 'Total Favourites',
      value: stats.totalFavourites,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Price Range',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/admin/items"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                Manage Items
              </span>
            </a>
            <a
              href="/admin/insights"
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                View Insights
              </span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

