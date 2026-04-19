"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  LogOut,
  Edit2,
  Check,
} from "lucide-react";
import { useState } from "react";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    company: "Tech Solutions Inc",
    bio: "DevOps Engineer passionate about CI/CD automation",
  });

  const [formData, setFormData] = useState(profileData);

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Profile</h2>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Avatar Section */}
        <div className="lg:col-span-1">
          <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4 text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {profileData.fullName}
              </h3>
              <p className="text-sm text-gray-400">{profileData.email}</p>
            </div>
            <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">
              <p className="text-gray-400">
                Member since <span className="text-white">March 2024</span>
              </p>
              <p className="text-gray-400">
                Account Status:{" "}
                <span className="text-green-400 font-medium">Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Profile Info */}
        <div className="lg:col-span-2 border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              {isEditing ?
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              : <p className="px-4 py-2.5 text-gray-300">
                  {profileData.fullName}
                </p>
              }
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-gray-400" />
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
              </div>
              {isEditing ?
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              : <p className="px-4 py-2.5 text-gray-300">{profileData.email}</p>
              }
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-gray-400" />
                <label className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
              </div>
              {isEditing ?
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              : <p className="px-4 py-2.5 text-gray-300">{profileData.phone}</p>
              }
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" />
                <label className="block text-sm font-medium text-gray-300">
                  Location
                </label>
              </div>
              {isEditing ?
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              : <p className="px-4 py-2.5 text-gray-300">
                  {profileData.location}
                </p>
              }
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Bio
              </label>
              {isEditing ?
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                />
              : <p className="px-4 py-2.5 text-gray-300">{profileData.bio}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing ?
            <div className="flex gap-3 pt-4 border-t border-zinc-700">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                <Check size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          : null}
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={22} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Pipeline failures</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Deployment updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Weekly digest</span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={22} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <button className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition-colors text-left">
            Change Password
          </button>
          <button className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition-colors text-left">
            Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/50 rounded-lg bg-red-500/5 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-400">
          Irreversible actions that cannot be undone
        </p>
        <button className="px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-medium hover:bg-red-500/30 transition-colors">
          Delete Account
        </button>
      </div>

      {/* Sign Out */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/50 text-red-400 font-medium hover:bg-red-500/10 transition-colors">
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
