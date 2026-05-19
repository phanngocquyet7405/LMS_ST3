"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, BookOpen } from "lucide-react";
import { useApp } from "@/src/Context/AppContext";
import FormInput from "@/src/components/auth/FormInput";
import AuthButton from "@/src/components/auth/AuthButton";
import axios from "axios";

export default function RegisterPage() {
  const { register } = useApp();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!agreeToTerms) newErrors.terms = "You must agree to the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
    } catch (error) {
      let backendMessage = "Registration failed, email may already exist.";

      if (axios.isAxiosError(error)) {
        backendMessage = error.response?.data?.message || backendMessage;
      }

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
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M0 0h40v40H0z%27 fill=%27none%27/%3E%3Cpath d=%27M0 0v40M10 0v40M20 0v40M30 0v40M0 0h40M0 10h40M0 20h40M0 30h40%27 stroke=%27white%27 stroke-width=%270.5%27/%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-2xl font-bold">Librarian Pro</span>
          </div>
          <p className="text-blue-100 text-sm mt-4 max-w-sm">
            Join Librarian Pro to streamline circulation, manage extensive
            catalogs, and deliver exceptional service to your community with our
            modern administration tools.
          </p>
        </div>

        {/* Center Illustration Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-8">
          <div className="text-center">
            <BookOpen className="w-32 h-32 text-white/30 mx-auto mb-8" />
            <div className="space-y-2">
              <div className="text-white/40 text-lg">Empower Your Library</div>
              <div className="text-white/20 text-sm">Start Managing Today</div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 text-blue-100 text-xs">
          <p>🔒 Secure. Simple. Smart.</p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
              Create an Account
            </h1>
            <p className="text-gray-600">
              Get started with central library administration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.global && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {errors.global}
              </div>
            )}

            <FormInput
              label="FULL NAME"
              name="fullName"
              type="text"
              placeholder="Jane Doe"
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              disabled={loading}
            />

            <FormInput
              label="EMAIL ADDRESS"
              name="email"
              type="email"
              placeholder="jane.doe@library.org"
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

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-600 text-sm">{errors.terms}</p>
            )}

            <div className="pt-4">
              <AuthButton type="submit" loading={loading}>
                CREATE ACCOUNT
              </AuthButton>
            </div>
          </form>

          <div className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
