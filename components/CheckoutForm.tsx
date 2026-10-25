'use client';
import { useState } from 'react';

const CheckoutForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-borders p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-semibold text-black mb-6">Shipping Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your street address"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your city"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons ${
                                errors.country ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your country"
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-main-primary-buttons"
                        placeholder="Enter your postal code"
                    />
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;
