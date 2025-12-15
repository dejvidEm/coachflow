'use client';

import { motion } from 'motion/react';
import { Users, BarChart3, FileText, UtensilsCrossed } from 'lucide-react';

export function DashboardPreview() {
  return (
    <div className="bg-gray-50 h-full overflow-hidden relative">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #44B080 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #3a9a6d 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, #44B080 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #44B080 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Dashboard Content */}
      <div className="relative h-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">CF</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Dashboard</h2>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {[
            { icon: Users, label: 'Clients', value: '24', color: '#44B080' },
            { icon: FileText, label: 'Plans', value: '48', color: '#3a9a6d' },
            { icon: UtensilsCrossed, label: 'Meals', value: '156', color: '#44B080' },
            { icon: BarChart3, label: 'Growth', value: '+12%', color: '#3a9a6d' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-lg p-2 sm:p-3 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Clients Graph */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3 h-3" style={{ color: '#44B080' }} />
              <h3 className="text-xs font-semibold text-gray-900">My Clients</h3>
            </div>
            <div className="h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: '#44B080' }}>
                  24
                </div>
                <div className="text-xs text-gray-500">Total Clients</div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-3 h-3" style={{ color: '#44B080' }} />
              <h3 className="text-xs font-semibold text-gray-900">Analytics</h3>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-200 rounded-full mb-1" style={{ width: `${60 + i * 10}%` }}></div>
                    <div className="h-1 bg-gray-100 rounded-full" style={{ width: `${40 + i * 5}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
