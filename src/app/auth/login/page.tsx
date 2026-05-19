"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { Mail, Lock, BookOpen } from "lucide-react";
import { useApp } from "@/src/Context/AppContext";
import FormInput from "@/src/components/auth/FormInput";
import AuthButton from "@/src/components/auth/AuthButton";

export default function LoginPage() {
  const { login } = useApp();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    global?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email không được để trống";
    if (!formData.password) newErrors.password = "Mật khẩu không được để trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const backendMessage =
        axiosError.response?.data?.message ||
        "Email hoặc mật khẩu không chính xác.";
      setErrors({ global: backendMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Left Side - Brand & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-b from-blue-900 via-blue-800 to-blue-900 p-8 flex-col justify-between relative overflow-hidden">
        {/* Library Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2240%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h40v40H0z%27 fill=%27none%27/%3E%3Cpath d=%27M0 0v40M10 0v40M20 0v40M30 0v40M0 0h40M0 10h40M0 20h40M0 30h40%27 stroke=%27white%27 stroke-width=%270.5%27/%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-2xl font-bold">Librarian Pro</span>
          </div>
          <p className="text-blue-100 text-sm mt-4 max-w-sm">
            Empowering modern libraries with high-efficiency management tools.
            Streamline your catalog, members, and circulation from one
            intelligent dashboard.
          </p>
        </div>

        {/* Center Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-8">
          <div className="text-center">
            <BookOpen className="w-32 h-32 text-white/30 mx-auto mb-8" />
            <div className="space-y-2">
              <div className="text-white/40 text-lg">Welcome to</div>
              <div className="text-white/20 text-sm">
                Your Library Management System
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 text-blue-100 text-xs">
          <p>🔒 Secure. Simple. Smart.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-900 text-xl font-bold">
                Librarian Pro
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Please enter your credentials to access the admin dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.global && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {errors.global}
              </div>
            )}

            <FormInput
              label="EMAIL ADDRESS"
              name="email"
              type="email"
              placeholder="admin@library.org"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={loading}
            />

            <FormInput
              label="PASSWORD"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={loading}
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-4">
              <AuthButton type="submit" loading={loading}>
                Sign In
              </AuthButton>
            </div>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
