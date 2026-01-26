import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Globe, Settings, Bell, Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    languages: user?.languages || ['en']
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' }
  ]

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleLanguageToggle = (langCode) => {
    const updatedLanguages = formData.languages.includes(langCode)
      ? formData.languages.filter(lang => lang !== langCode)
      : [...formData.languages, langCode]
    
    setFormData({ ...formData, languages: updatedLanguages })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Account <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-xl text-slate-600">
            Manage your profile and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="card">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="btn-primary"
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
                      <p className="text-slate-600 capitalize">{user?.userType}</p>
                      <button className="text-sm text-primary-600 hover:text-primary-700 mt-1">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        <Globe className="inline w-4 h-4 mr-1" />
                        Languages
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {languages.map((lang) => (
                          <label
                            key={lang.code}
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                              formData.languages.includes(lang.code)
                                ? 'border-primary-300 bg-primary-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.languages.includes(lang.code)}
                              onChange={() => isEditing && handleLanguageToggle(lang.code)}
                              disabled={!isEditing}
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">{lang.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Translation Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Auto-translate messages</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Show original text</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Cultural context hints</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Negotiation Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">AI negotiation assistance</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Price suggestions</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Market insights</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Email Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">New messages</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Price alerts</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Trade completions</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Push Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Real-time messages</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-slate-700">Negotiation updates</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Password</h3>
                      <button className="btn-secondary">Change Password</button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Two-Factor Authentication</h3>
                      <p className="text-slate-600 mb-3">Add an extra layer of security to your account</p>
                      <button className="btn-primary">Enable 2FA</button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">Current Session</p>
                            <p className="text-sm text-slate-600">Chrome on macOS • New York, NY</p>
                          </div>
                          <span className="badge badge-success">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}