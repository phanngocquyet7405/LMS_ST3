"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/Context/AppContext";
import profileService from "../../service/ProfileService";
import AuthService from "../../service/AuthService";
import type { User } from "@/lib/index";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Save,
  AlertCircle,
  Check,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user: contextUser } = useApp();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const loadProfile = async () => {
      try {
        // Use profile from context
        if (contextUser) {
          if (!isMounted) return;
          setProfile(contextUser);
          setFormData(contextUser);
          setLoading(false);
        }
      } catch (err) {
        console.error("[v0] Error loading profile:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [contextUser, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.email || !formData.fullName) {
      setMessage({
        type: "error",
        text: "Please fill in required fields",
      });
      return;
    }

    try {
      setLoading(true);
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      setEditMode(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("[v0] Error updating profile:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setMessage({
        type: "error",
        text: "Please fill in all password fields",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      await profileService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      setShowPasswordForm(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({
        type: "success",
        text: "Password changed successfully",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("[v0] Error changing password:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to change password. Please check your current password.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#424754] text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-[#191c1e]">
            Failed to load profile
          </h1>
          <p className="text-[#424754] mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-[32px] font-bold leading-10 text-[#191c1e]"
          style={{ fontFamily: "Hanken Grotesk, sans-serif" }}
        >
          My Profile
        </h2>
        <p className="text-[14px] text-[#424754] mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <Check
              size={20}
              className="text-emerald-600 flex-shrink-0 mt-0.5"
            />
          ) : (
            <AlertCircle
              size={20}
              className="text-red-600 flex-shrink-0 mt-0.5"
            />
          )}
          <div>
            <p
              className={`text-sm font-medium ${
                message.type === "success"
                  ? "text-emerald-900"
                  : "text-red-900"
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2170e4] to-[#0058be] flex items-center justify-center text-white text-4xl font-bold">
              {(profile.fullName || "U").charAt(0).toUpperCase()}
            </div>
            <p className="text-[12px] text-[#727785] mt-4">
              {profile.role || "USER"}
            </p>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {/* Name */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                />
              ) : (
                <p className="text-[14px] text-[#191c1e] font-medium mt-1">
                  {profile.fullName || "—"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Email Address
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                />
              ) : (
                <div className="flex items-center gap-2 text-[14px] text-[#191c1e] mt-1">
                  <Mail size={14} className="text-[#727785]" />
                  {profile.email || "—"}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                />
              ) : (
                <div className="flex items-center gap-2 text-[14px] text-[#191c1e] mt-1">
                  <Phone size={14} className="text-[#727785]" />
                  {profile.phone || "—"}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Address
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                />
              ) : (
                <div className="flex items-center gap-2 text-[14px] text-[#191c1e] mt-1">
                  <MapPin size={14} className="text-[#727785]" />
                  {profile.address || "—"}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Member Since
                </label>
                <div className="flex items-center gap-2 text-[14px] text-[#191c1e] mt-1">
                  <Calendar size={14} className="text-[#727785]" />
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Last Updated
                </label>
                <div className="flex items-center gap-2 text-[14px] text-[#191c1e] mt-1">
                  <Calendar size={14} className="text-[#727785]" />
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-[#c2c6d6]">
          {editMode ? (
            <>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-[#0058be] text-white text-[12px] font-semibold rounded-lg hover:bg-[#005ac2] disabled:opacity-50 transition-colors"
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(profile);
                }}
                disabled={loading}
                className="px-6 py-2 bg-[#f7f9fb] text-[#191c1e] text-[12px] font-semibold border border-[#c2c6d6] rounded-lg hover:bg-[#e0e3e5] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-[#0058be] text-white text-[12px] font-semibold rounded-lg hover:bg-[#005ac2] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#191c1e]">
              Change Password
            </h3>
            <p className="text-[14px] text-[#424754]">
              Update your password to keep your account secure
            </p>
          </div>
          <Lock size={24} className="text-[#727785]" />
        </div>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="px-6 py-2 bg-[#0058be] text-white text-[12px] font-semibold rounded-lg hover:bg-[#005ac2] transition-colors"
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-[#0058be] text-white text-[12px] font-semibold rounded-lg hover:bg-[#005ac2] disabled:opacity-50 transition-colors"
              >
                <Save size={16} /> Update Password
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-6 py-2 bg-[#f7f9fb] text-[#191c1e] text-[12px] font-semibold border border-[#c2c6d6] rounded-lg hover:bg-[#e0e3e5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
