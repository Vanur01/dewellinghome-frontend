import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuthStore } from '../../store/auth.store';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const password = watch("password");

  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  useAuth(false);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('');
      await signup(data.email, data.password, data.fullName, data.address, data.phone);
      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-6 p-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Join us today and get started</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              placeholder="Full Name"
              className="pl-10"
            />
            {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
              type="email"
              placeholder="Email Address"
              className="pl-10"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
              type="tel"
              placeholder="Phone Number"
              className="pl-10"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Please enter a complete address"
                }
              })}
              placeholder="Address"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full text-sm focus:ring-red-500 focus:border-red-500"
              rows={3}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must contain uppercase, lowercase, number, and special character"
                }
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-red-500 hover:bg-red-700">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
