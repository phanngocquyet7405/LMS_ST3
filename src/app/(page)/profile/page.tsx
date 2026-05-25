"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/src/Context/AppContext";
import profileService from "../../service/ProfileService";
import userService from "../../service/UserService";
import type { User } from "@/lib/index";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Upload,
  Save,
  AlertCircle,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        // Try to load from profile endpoint, fallback to user context
        if (contextUser) {
          if (!isMounted) return;
          setProfile(contextUser);
          setFormData(contextUser);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [contextUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      let updatedProfile = { ...formData };

      // Upload avatar if changed
      if (avatarFile) {
        try {
          const result = await profileService.uploadAvatar(avatarFile);
          updatedProfile.imageUrl = result.imageUrl;
        } catch (err) {
          console.error("Error uploading avatar:", err);
          setMessage({
            type: "error",
            text: "Failed to upload avatar",
          });
          setLoading(false);
          return;
        }
      }

      // Update profile
      const updated = await profileService.updateProfile(updatedProfile);
      setProfile(updated);
      setFormData(updated);
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview("");
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({
        type: "error",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      await profileService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      setMessage({
        type: "success",
        text: "Password changed successfully",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage({
        type: "error",
        text: "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0058be] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 text-center">
        <AlertCircle size={32} className="mx-auto text-amber-600 mb-2" />
        <p className="text-[#424754]">Failed to load profile information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {message && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-rose-50 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <Check size={20} className="text-emerald-600" />
          ) : (
            <AlertCircle size={20} className="text-rose-600" />
          )}
          <p
            className={
              message.type === "success"
                ? "text-emerald-700"
                : "text-rose-700"
            }
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-bold text-[#191c1e]">My Profile</h1>
          <p className="text-sm text-[#424754] mt-1">
            Manage your account information and security settings
          </p>
        </div>
        <button
          onClick={() =>
            editMode ? setEditMode(false) : setEditMode(true)
          }
          className="bg-[#0058be] text-white text-[12px] font-semibold tracking-[0.05em] uppercase px-6 py-3 rounded-lg hover:bg-[#005ac2] transition-colors shadow-sm"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Avatar & Basic Info */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2170e4] to-[#0058be] flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {avatarPreview || profile.imageUrl ? (
                  <Image
                    src={avatarPreview || profile.imageUrl || ""}
                    alt={profile.fullName || "Avatar"}
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <span>
                    {(profile.fullName || "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-[#0058be] text-white p-2 rounded-full cursor-pointer hover:bg-[#005ac2] transition-colors">
                  <Upload size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-[#727785] mt-2">
              {editMode ? "Click icon to upload avatar" : ""}
            </p>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Full Name
                </label>
                <div className="mt-1">
                  {editMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#191c1e] font-medium">
                      {profile.fullName || profile.name || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Email
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Mail size={14} className="text-[#727785]" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#191c1e]">
                      {profile.email || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Phone Number
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <Phone size={14} className="text-[#727785]" />
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#191c1e]">
                      {profile.phone || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Address
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin size={14} className="text-[#727785]" />
                  {editMode ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                    />
                  ) : (
                    <p className="text-[14px] text-[#191c1e]">
                      {formData.address || "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Role
                </label>
                <p className="text-[14px] text-[#191c1e] font-medium mt-1">
                  {profile.role || "USER"}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                  Account Status
                </label>
                <p className="text-[14px] text-[#191c1e] font-medium mt-1">
                  {profile.active !== false ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
                Bio
              </label>
              {editMode ? (
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full mt-1 px-4 py-2 bg-[#f7f9fb] border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                />
              ) : (
                <p className="text-[14px] text-[#424754] mt-1">
                  {formData.bio || "No bio added yet"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="mt-6 border-t border-[#eceef0] pt-6 flex gap-3 justify-end">
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(profile);
                setAvatarPreview("");
              }}
              className="px-6 py-2 border border-[#c2c6d6] text-[#191c1e] rounded-lg hover:bg-[#f2f4f6] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-6 py-2 bg-[#0058be] text-white rounded-lg hover:bg-[#005ac2] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#191c1e] mb-4">
          Account Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
              Member Since
            </p>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#727785]" />
              <p className="text-[14px] text-[#191c1e]">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[12px] font-semibold tracking-[0.05em] text-[#424754] uppercase">
              Last Updated
            </p>
            <p className="text-[14px] text-[#191c1e]">
              {profile.updatedAt
                ? new Date(profile.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#191c1e]">
            Security Settings
          </h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="text-[#0058be] text-[12px] font-semibold hover:underline"
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-4 bg-[#f7f9fb] p-4 rounded-lg">
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
                className="w-full mt-1 px-4 py-2 bg-white border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                placeholder="Enter your current password"
              />
            </div>

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
                className="w-full mt-1 px-4 py-2 bg-white border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                placeholder="Enter your new password"
              />
            </div>

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
                className="w-full mt-1 px-4 py-2 bg-white border border-[#c2c6d6] rounded-lg text-[14px] text-[#191c1e] focus:outline-none focus:border-[#0058be]"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#c2c6d6]">
              <button
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 border border-[#c2c6d6] text-[#191c1e] rounded-lg hover:bg-[#f2f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 bg-[#0058be] text-white rounded-lg hover:bg-[#005ac2] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Lock size={16} /> Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
