import React, { useState } from "react";
import { Settings, User, Shield, Bell, Palette, Save, RefreshCw, AlertCircle, Moon, Sun, Eye, EyeOff, Mail, Smartphone, Monitor, Database, Plus, Edit3, Trash2 } from "lucide-react";
import { useSettingsContext } from "./SettingsContext";
import { useAuth } from "../../contexts/AuthContext";

// Simple local editor for dropdown tables (mock UI, no backend)
const DropdownTableEditor: React.FC = () => {
  const [items, setItems] = useState<Array<{ id: number; key: string; value: string }>>([
    { id: 1, key: 'priority', value: 'High' },
    { id: 2, key: 'priority', value: 'Medium' },
    { id: 3, key: 'priority', value: 'Low' },
  ]);
  const [newValue, setNewValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newValue.trim()) return;
    const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id, key: 'priority', value: newValue.trim() }]);
    setNewValue('');
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSaveEdit = (id: number, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, value } : i)));
    setEditingId(null);
  };

  return (
    <div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="text-sm font-medium text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.key}</div>
            </div>
            <div className="flex items-center gap-2">
              {editingId === item.id ? (
                <>
                  <input defaultValue={item.value} className="px-2 py-1 border rounded" onBlur={(e) => handleSaveEdit(item.id, e.target.value)} />
                  <button className="text-xs px-2 py-1 border rounded bg-gray-100" onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="text-xs px-2 py-1 border rounded bg-white" onClick={() => setEditingId(item.id)}><Edit3 className="h-3 w-3 inline" /> Edit</button>
                  <button className="text-xs px-2 py-1 border rounded bg-red-50 text-red-700" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3 inline" /> Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="New value" className="flex-1 px-3 py-2 border rounded" />
        <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={handleAdd}><Plus className="h-4 w-4 inline" /> Add</button>
      </div>
    </div>
  );
};

// Simple mock editor to manage user roles (admin/staff only)
const UserRolesEditor: React.FC = () => {
  const [roles, setRoles] = useState<Array<{ id: number; name: string; permissions: string[] }>>([
    { id: 1, name: 'Administrator', permissions: ['all'] },
    { id: 2, name: 'Manager', permissions: ['edit', 'view'] },
    { id: 3, name: 'Operator', permissions: ['view'] },
  ]);
  const [newRole, setNewRole] = useState('');

  const addRole = () => {
    if (!newRole.trim()) return;
    const id = roles.length ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    setRoles([...roles, { id, name: newRole.trim(), permissions: ['view'] }]);
    setNewRole('');
  };

  const deleteRole = (id: number) => setRoles(roles.filter(r => r.id !== id));

  return (
    <div>
      <div className="grid gap-2">
        {roles.map(r => (
          <div key={r.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium text-gray-800">{r.name}</div>
              <div className="text-xs text-gray-500">Permissions: {r.permissions.join(', ')}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-2 py-1 border rounded bg-white text-gray-700">Edit</button>
              <button className="text-xs px-2 py-1 border rounded bg-red-50 text-red-700" onClick={() => deleteRole(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="New role name" className="flex-1 px-3 py-2 border rounded" />
        <button className="px-4 py-2 bg-emerald-600 text-white rounded" onClick={addRole}>Add Role</button>
      </div>
    </div>
  );
};

const SettingsRightCard: React.FC = () => {
  const { selectedSection } = useSettingsContext();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    sms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const renderSettingsContent = (section: string) => {
    const settingsContent: Record<string, React.JSX.Element> = {
      general: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              General Settings
            </h2>
            <p className="text-gray-600">
              Configure basic application preferences
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Application Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto-save changes
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically save settings when changed
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Session timeout warning
                  </label>
                  <p className="text-xs text-gray-500">
                    Show warning before session expires
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default page load timeout
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="5">5 seconds</option>
                  <option value="10" selected>
                    10 seconds
                  </option>
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ),

      account: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Account & Profile
            </h2>
            <p className="text-gray-600">
              Manage your personal information and profile settings
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue="john.doe@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Production</option>
                  <option>Quality Control</option>
                  <option>Engineering</option>
                  <option>Management</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>Operator</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      ),

      security: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Security & Privacy
            </h2>
            <p className="text-gray-600">
              Manage your security settings and privacy controls
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Password & Authentication
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter current password"
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Enable 2FA</p>
                <p className="text-xs text-gray-500">
                  Add extra security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Two-factor authentication is currently disabled
                </p>
              </div>
            </div>
          </div>
        </div>
      ),

      database: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
              <Database className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Database</h2>
            <p className="text-gray-600">Manage tables, dropdown data and user roles (admin/staff)</p>
          </div>

          {/* Tables list */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Tables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example table card */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-800">Dropdown Options</p>
                    <p className="text-xs text-gray-500">Data shown in dropdown menus across the app</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm px-3 py-1 border rounded bg-blue-50 text-blue-700">View</button>
                    <button className="text-sm px-3 py-1 border rounded bg-emerald-50 text-emerald-700">Manage</button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">Example entries: Priority (High, Medium, Low), Status (Open, Closed)</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">User Roles</p>
                    <p className="text-xs text-gray-500">Configure roles and default permissions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm px-3 py-1 border rounded bg-blue-50 text-blue-700">View</button>
                    <button className="text-sm px-3 py-1 border rounded bg-emerald-50 text-emerald-700">Manage</button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">Administrator, Manager, Operator, Viewer</div>
              </div>
            </div>
          </div>

          {/* Management panel - simplified local UI for add/modify */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Dropdown Data</h3>
            <p className="text-sm text-gray-600 mb-4">Admins and staff can add or modify data used in dropdown menus.</p>

            {user?.is_staff || user?.is_superuser ? (
              <DropdownTableEditor />
            ) : (
              <div className="text-sm text-gray-600">You do not have permissions to manage dropdown data.</div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Roles</h3>
            <p className="text-sm text-gray-600 mb-4">Configure roles and default permissions for users.</p>
            {user?.is_staff || user?.is_superuser ? <UserRolesEditor /> : <div className="text-sm text-gray-600">You do not have permissions to manage roles.</div>}
          </div>
        </div>
      ),

      notifications: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Notifications
            </h2>
            <p className="text-gray-600">
              Configure how you receive notifications
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </p>
                    <p className="text-xs text-gray-500">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Push Notifications
                    </p>
                    <p className="text-xs text-gray-500">
                      Browser push notifications
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        push: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Desktop Notifications
                    </p>
                    <p className="text-xs text-gray-500">
                      System notifications on desktop
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.desktop}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        desktop: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      SMS Notifications
                    </p>
                    <p className="text-xs text-gray-500">Text message alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        sms: e.target.checked,
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      ),

      appearance: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
              <Palette className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Appearance & Theme
            </h2>
            <p className="text-gray-600">
              Customize the look and feel of your interface
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Theme Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Sun className="h-5 w-5 text-indigo-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Dark Mode
                    </p>
                    <p className="text-xs text-gray-500">
                      Use dark theme for better night viewing
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interface Scale
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="small">Small (90%)</option>
                  <option value="normal" selected>
                    Normal (100%)
                  </option>
                  <option value="large">Large (110%)</option>
                  <option value="extra-large">Extra Large (125%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Accent
                </label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-600 cursor-pointer"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-transparent cursor-pointer hover:border-green-600"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-transparent cursor-pointer hover:border-purple-600"></div>
                  <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-transparent cursor-pointer hover:border-red-600"></div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-transparent cursor-pointer hover:border-orange-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return settingsContent[section] || settingsContent["general"];
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {renderSettingsContent(selectedSection)}
      </div>
    </div>
  );
};

export default SettingsRightCard;
