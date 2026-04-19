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
  Building2,
  AtSign,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { GitHubTokenSetup } from "./github-token-setup";

function displayOrDash(value: string | null | undefined) {
  const t = typeof value === "string" ? value.trim() : "";
  return t ? t : "—";
}

export function Profile() {
  const router = useRouter();
  const { user, isLoading, refreshUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(
    null,
  );
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    bio: "",
  });

  const syncFormFromUser = useCallback(() => {
    if (!user) return;
    setFormData({
      fullName: user.fullName ?? "",
      email: user.email,
      phone: user.phone ?? "",
      location: user.location ?? "",
      company: user.company ?? "",
      bio: user.bio ?? "",
    });
  }, [user]);

  useEffect(() => {
    if (!isEditing) {
      syncFormFromUser();
    }
  }, [user, isEditing, syncFormFromUser]);

  const displayName = user?.fullName?.trim() || user?.username || user?.email;

  const memberSince =
    user?.createdAt ?
      new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "—";

  const handleSave = async () => {
    if (!user) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: formData.fullName.trim() === "" ? null : formData.fullName,
          email: formData.email.trim(),
          phone: formData.phone.trim() === "" ? null : formData.phone,
          location: formData.location.trim() === "" ? null : formData.location,
          company: formData.company.trim() === "" ? null : formData.company,
          bio: formData.bio.trim() === "" ? null : formData.bio,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(
          typeof data.error === "string" ?
            data.error
          : "Could not save profile",
        );
        return;
      }
      await refreshUser();
      setIsEditing(false);
    } catch {
      setSaveError("Could not save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    syncFormFromUser();
    setSaveError(null);
    setIsEditing(false);
  };

  const patchNotifications = async (patch: {
    notifyPipelineFailures?: boolean;
    notifyDeploymentUpdates?: boolean;
    notifyWeeklyDigest?: boolean;
  }) => {
    setNotifError(null);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(patch),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotifError(
          typeof data.error === "string" ?
            data.error
          : "Could not update preferences",
        );
        return;
      }
      await refreshUser();
    } catch {
      setNotifError("Could not update preferences");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Delete your account and all connected repositories? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleteAccountError(null);
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteAccountError(
          typeof data.error === "string" ?
            data.error
          : "Could not delete account",
        );
        return;
      }
      await refreshUser();
      router.push("/");
    } catch {
      setDeleteAccountError("Could not delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-12 text-center text-gray-400">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Profile</h2>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              syncFormFromUser();
              setSaveError(null);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4 text-center">
            <div className="h-24 w-24 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 mx-auto flex items-center justify-center overflow-hidden">
              {user.profileImage ?
                <img
                  src={user.profileImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              : <User className="h-12 w-12 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{displayName}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">@{user.username}</p>
            </div>
            <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">
              <p className="text-gray-400">
                Member since <span className="text-white">{memberSince}</span>
              </p>
              <p className="text-gray-400">
                Account status:{" "}
                <span className="text-green-400 font-medium">Active</span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AtSign size={18} className="text-gray-400" />
                <span className="block text-sm font-medium text-gray-300">
                  Username
                </span>
              </div>
              <p className="px-4 py-2.5 text-gray-300">{user.username}</p>
            </div>

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
                  {displayOrDash(user.fullName)}
                </p>
              }
            </div>

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
              : <p className="px-4 py-2.5 text-gray-300">{user.email}</p>}
            </div>

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
              : <p className="px-4 py-2.5 text-gray-300">
                  {displayOrDash(user.phone)}
                </p>
              }
            </div>

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
                  {displayOrDash(user.location)}
                </p>
              }
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-gray-400" />
                <label className="block text-sm font-medium text-gray-300">
                  Company
                </label>
              </div>
              {isEditing ?
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              : <p className="px-4 py-2.5 text-gray-300">
                  {displayOrDash(user.company)}
                </p>
              }
            </div>

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
              : <p className="px-4 py-2.5 text-gray-300 whitespace-pre-wrap">
                  {displayOrDash(user.bio)}
                </p>
              }
            </div>
          </div>

          {saveError && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-400">
              {saveError}
            </div>
          )}

          {isEditing ?
            <div className="flex gap-3 pt-4 border-t border-zinc-700">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                <Check size={18} />
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-300 font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={22} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          {notifError && <p className="text-sm text-red-400">{notifError}</p>}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={user.notifyPipelineFailures ?? true}
                onChange={(e) =>
                  void patchNotifications({
                    notifyPipelineFailures: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Pipeline failures</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={user.notifyDeploymentUpdates ?? true}
                onChange={(e) =>
                  void patchNotifications({
                    notifyDeploymentUpdates: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Deployment updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={user.notifyWeeklyDigest ?? false}
                onChange={(e) =>
                  void patchNotifications({
                    notifyWeeklyDigest: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-700 bg-zinc-800 accent-cyan-500"
              />
              <span className="text-sm text-gray-300">Weekly digest</span>
            </label>
          </div>
        </div>

        <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={22} className="text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          <button
            type="button"
            disabled
            title="Not available yet"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-500 font-medium cursor-not-allowed text-left"
          >
            Change Password
          </button>
          <button
            type="button"
            disabled
            title="Not available yet"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-700 text-gray-500 font-medium cursor-not-allowed text-left"
          >
            Two-Factor Authentication
          </button>
        </div>
      </div>

      <GitHubTokenSetup onSuccess={() => void refreshUser()} />

      <div className="border border-red-500/50 rounded-lg bg-red-500/5 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-400">
          Irreversible actions that cannot be undone
        </p>
        {deleteAccountError && (
          <p className="text-sm text-red-400">{deleteAccountError}</p>
        )}
        <button
          type="button"
          onClick={() => void handleDeleteAccount()}
          disabled={isDeleting}
          className="px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting…" : "Delete Account"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={isSigningOut}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/50 text-red-400 font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <LogOut size={18} />
        {isSigningOut ? "Signing out…" : "Sign Out"}
      </button>
    </div>
  );
}
