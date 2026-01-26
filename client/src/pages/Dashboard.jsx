import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Globe,
  DollarSign,
  Clock,
  Star,
  Activity
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalTrades: 0,
    activeNegotiations: 0,
    averageRating: 0,
    totalEarnings: 0
  })

  const recentActivity = [
    {
      id: 1,
      type: 'negotiation_started',
      message: 'New negotiation started with Ahmed Hassan',
      time: '2 minutes ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'trade_completed',
      message: 'Trade completed: Organic Tomatoes - $45.50',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'rating_received',
      message: 'Received 5-star rating from Sarah Chen',
      time: '3 hours ago',
      icon: Star,
      color: 'text-yellow-600'
    }
  ]

  const quickActions = [
    {
      title: 'Start New Negotiation',
      description: 'Find vendors and begin trading',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      action: () => window.location.href = '/marketplace'
    },
    {
      title: 'View Analytics',
      description: 'Track your trading performance',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      action: () => {}
    },
    {
      title: 'Language Settings',
      description: 'Manage translation preferences',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      action: () => {}
    }
  ]

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalTrades: user?.userType === 'vendor' ? 127 : 43,
        activeNegotiations: 5,
        averageRating: 4.8,
        totalEarnings: user?.userType === 'vendor' ? 2450.75 : 890.25
      })
    }, 1000)
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-xl text-slate-600">
            {user?.userType === 'vendor' 
              ? 'Manage your store and connect with buyers worldwide'
              : 'Discover amazing products from local vendors'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Trades',
              value: stats.totalTrades,
              icon: TrendingUp,
              color: 'from-blue-500 to-cyan-500',
              change: '+12%'
            },
            {
              title: 'Active Chats',
              value: stats.activeNegotiations,
              icon: MessageSquare,
              color: 'from-green-500 to-emerald-500',
              change: '+3'
            },
            {
              title: 'Average Rating',
              value: stats.averageRating,
              icon: Star,
              color: 'from-yellow-500 to-orange-500',
              change: '+0.2'
            },
            {
              title: user?.userType === 'vendor' ? 'Total Earnings' : 'Total Spent',
              value: `$${stats.totalEarnings}`,
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500',
              change: '+8%'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.title}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="card text-left group hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="card">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ${activity.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">{activity.message}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All Activity
              </button>
            </div>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Trading Performance</h2>
              <select className="input w-32">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            <div className="h-64 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <p className="text-slate-600">Performance chart will be displayed here</p>
                <p className="text-sm text-slate-500">Integration with analytics service required</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}