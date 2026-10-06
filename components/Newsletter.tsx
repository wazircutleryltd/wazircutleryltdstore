'use client';
import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({ 
        loading: false, 
        success: false, 
        error: null 
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe');
            }

            setStatus({ loading: false, success: true, error: null });
            setEmail('');
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
        } catch (error: any) {
            setStatus({ loading: false, success: false, error: error?.message || 'Failed to subscribe' });
        }
    };

    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <div className="newsletter-container newsletter-outfit-font">
                    {/* Left Content */}
                    <div className="newsletter-left-content">
                        <h2 className="newsletter-heading">Ready to Get Our New Stuff Update?</h2>
                    </div>

                    {/* Right Content - Email Input */}
                    <div className="newsletter-right-content">
                        <p className="newsletter-content-text">
                            Be the first to discover newly forged swords, knives, axes, and more — crafted with precision, strength, and legacy for true warriors and collectors.
                        </p>
                        <form onSubmit={handleSubmit} className="newsletter-input-container">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Your Email..."
                                className="newsletter-email-input newsletter-outfit-font"
                                required
                                disabled={status.loading}
                            />
                            <button
                                type="submit"
                                className={`newsletter-submit-btn newsletter-outfit-font ${status.loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={status.loading}
                            >
                                <span className="newsletter-btn-text">
                                    {status.loading ? 'Subscribing...' : 'Subscribe Now'}
                                </span>
                            </button>
                        </form>
                        {status.error && (
                            <p className="mt-2 text-red-500 text-sm">{status.error}</p>
                        )}
                        {status.success && (
                            <p className="mt-2 text-green-500 text-sm">Successfully subscribed to newsletter!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
