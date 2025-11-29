
import React, { useState } from 'react';
import Icon from '../shared/Icon';

interface LoginScreenProps {
    onLogin: (rememberMe: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('elena.popescu@email.com');
    const [code, setCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setStep(2);
            setIsProcessing(false);
        }, 1000);
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(code.length > 3) { // Simple validation
            setIsProcessing(true);
            onLogin(rememberMe);
        }
    };
    
    return (
        <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <img src="https://picsum.photos/seed/floresti-logo/80/80" alt="City Logo" className="mx-auto rounded-full mb-4"/>
                    <h2 className="mt-6 text-3xl font-bold text-brand-dark">Florești Civic Portal</h2>
                    <p className="mt-2 text-gray-600">Your city services, simplified.</p>
                </div>
                {step === 1 ? (
                    <form className="space-y-6" onSubmit={handleEmailSubmit}>
                         <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 transition-colors"
                        >
                            {isProcessing ? 'Sending code...' : 'Create Account / Sign In'}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleCodeSubmit}>
                        <div>
                            <p className="text-center text-gray-600">A one-time code was sent to <span className="font-semibold">{email}</span>.</p>
                             <label htmlFor="code" className="mt-4 text-sm font-medium text-gray-700">Verification Code</label>
                             <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                placeholder="Enter your code"
                            />
                        </div>
                         <button
                            type="submit"
                            disabled={isProcessing || code.length <= 3}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 transition-colors"
                        >
                             {isProcessing ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                    </form>
                )}
            </div>
             <p className="mt-8 text-center text-sm text-gray-500">
                Welcome, Elena! Manage your taxes, transport, and benefits here.
            </p>
        </div>
    );
};

export default LoginScreen;