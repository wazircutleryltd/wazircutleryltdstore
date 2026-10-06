'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useVerifyAdminLogin } from '@/lib/hooks';
import { setAdminSession, getClientIP, getUserAgent } from '@/lib/utils';
import ConditionalLayout from '@/components/ConditionalLayout';

export default function LoginClient() {
    return (
        <ConditionalLayout>
            <LoginContent />
        </ConditionalLayout>
    );
}

function LoginContent() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { verifyAdminLogin, isLoading: isVerifyingAdmin } = useVerifyAdminLogin();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const ipAddress = await getClientIP();
            const userAgent = getUserAgent();

            const result = await verifyAdminLogin(
                formData.email,
                formData.password,
                ipAddress,
                userAgent
            );

            if (result?.success) {
                const sessionData = {
                    username: formData.email,
                    loginTime: Date.now(),
                    ipAddress,
                    userAgent
                };
                setAdminSession(sessionData);
                toast.success('Admin login successful!');
                window.location.href = '/admin';
            } else {
                toast.error(result?.message || 'Admin login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Admin login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Logo and Welcome */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#F27F0C] to-[#C49F5A] items-center justify-center">
                <div className="text-center text-white px-8">
                    <div className="mb-8">
                        <Image
                            src="/white-logo.svg"
                            alt="Wazir Cutlery"
                            width={120}
                            height={120}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-xl opacity-90">
                        Admin access only
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo Section (Mobile) */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                            <Image 
                                src="/logo.svg" 
                                alt="Wazir Cutlery" 
                                width={48} 
                                height={48}
                                className="w-12 h-12"
                            />
                        </div>
                        <h1 className="font-quattrocento text-3xl font-bold text-[#0E0E0E] mb-2">
                            Admin Login
                        </h1>
                        <p className="text-[#2C2C2C] text-lg">
                            Sign in with your admin credentials
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-[#2C2C2C] placeholder-gray-400"
                                        placeholder="Enter Email"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F27F0C] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-[#2C2C2C] placeholder-gray-400 pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#F27F0C] transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#F27F0C] text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-[#C49F5A] focus:ring-2 focus:ring-[#F27F0C] focus:ring-offset-2 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            {/* Forgot Password hidden for admin-only */}
                            <div className="text-center mt-6">
                                <p className="text-sm text-[#2C2C2C]">
                                    Admin access only
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer Text */}
                    <div className="text-center mt-8">
                        <p className="text-sm text-[#2C2C2C] opacity-75">
                            By signing in, you agree to our{' '}
                            <Link href="/terms" className="text-[#F27F0C] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-[#F27F0C] hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
