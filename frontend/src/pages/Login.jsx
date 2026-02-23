import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, EyeOff, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate auth and navigate to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative">
            <div className="absolute top-6 left-6 flex items-center space-x-2">
                <div className="bg-primary-600 text-white p-1.5 rounded-md">
                    <Layers size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">Recruit-AI</span>
            </div>

            <Card className="w-full max-w-md shadow-xl border-slate-100">
                <CardContent className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <Input
                            label="Work Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail size={16} />}
                            required
                        />

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full border border-slate-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600">
                                    <EyeOff size={16} />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Log In
                        </Button>
                    </form>

                    <div className="mt-6 flex items-center before:flex-1 before:border-t before:border-slate-200 before:mr-4 after:flex-1 after:border-t after:border-slate-200 after:ml-4">
                        <span className="text-sm text-slate-400">Or</span>
                    </div>

                    <div className="mt-6">
                        <Button variant="secondary" className="w-full flex items-center justify-center space-x-2 py-2.5">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continue with Google</span>
                        </Button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account? <a href="#" className="font-medium text-primary-600 hover:text-primary-700">Start 14-day free trial</a>
                    </p>
                </CardContent>
            </Card>

            <div className="absolute bottom-6 w-full text-center space-y-1">
                <p className="text-xs text-slate-400">© 2024 Recruit-AI Inc. All rights reserved.</p>
                <div className="space-x-4">
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</a>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</a>
                </div>
            </div>
        </div>
    );
}
