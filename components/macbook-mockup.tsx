'use client';

import { motion } from 'motion/react';
import { Users, BarChart3, FileText, UtensilsCrossed } from 'lucide-react';

export function MacBookMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
            {/* Traffic lights (red, yellow, green) */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block px-3 py-0.5 bg-white rounded text-xs text-gray-500 font-medium">
                  dashboard.coachflow.com
                </div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-gray-50 h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden relative">
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
              <div className="relative h-full p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CF</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
                      <p className="text-xs text-gray-500">Welcome back!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        <span className="text-xs text-gray-500">{stat.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Clients Graph */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4" style={{ color: '#44B080' }} />
                      <h3 className="text-sm font-semibold text-gray-900">My Clients</h3>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1" style={{ color: '#44B080' }}>
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
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4" style={{ color: '#44B080' }} />
                      <h3 className="text-sm font-semibold text-gray-900">Analytics</h3>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full mb-1" style={{ width: `${60 + i * 10}%` }}></div>
                            <div className="h-1.5 bg-gray-100 rounded-full" style={{ width: `${40 + i * 5}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Client Cards Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-4"
                >
                  <div className="flex gap-3 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="min-w-[200px] bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-200"></div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded mb-1"></div>
                            <div className="h-1.5 bg-gray-100 rounded w-2/3"></div>
                          </div>
                        </div>
                        <div className="h-16 bg-gray-50 rounded"></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-500/20 to-transparent blur-3xl opacity-50"></div>
    </div>
  );
}

