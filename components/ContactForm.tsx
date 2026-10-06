'use client';
import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        whatsapp_number: '',
        company_name: '',
        company_email: '',
        country: '',
        location: '',
        city: '',
        product_quantity: '',
        shipment_address: '',
        emergency_contact: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<any>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        if (!recaptchaToken) {
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, recaptchaToken }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error submitting form:', errorData);
                throw new Error(errorData.message || 'Failed to submit form');
            }
            
            setSubmitStatus('success');
            setFormData({
                full_name: '',
                email: '',
                phone_number: '',
                whatsapp_number: '',
                company_name: '',
                company_email: '',
                country: '',
                location: '',
                city: '',
                product_quantity: '',
                shipment_address: '',
                emergency_contact: '',
                message: ''
            });
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setRecaptchaToken(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <div className="form-container">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-[#0E0E0E] mb-2">Thank You!</h2>
                            <p className="text-[#2C2C2C] mb-6">
                                Your order request has been submitted successfully. We&apos;ll get back to you soon!
                            </p>
                            <button
                                onClick={() => setSubmitStatus(null)}
                                className="bg-[#F27F0C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C49F5A] transition-colors duration-200"
                            >
                                Submit Another Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <div className="form-container">
                    <h2 className="form-title">Let&apos;s Talk</h2>

                    {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            There was an error submitting your form. Please complete the reCAPTCHA and try again.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="full_name" className="form-label">Full Name</label>
                                <input 
                                    type="text" 
                                    id="full_name"
                                    name="full_name"
                                    className="form-input" 
                                    placeholder="Full Name" 
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    className="form-input" 
                                    placeholder="Email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                <input 
                                    type="tel" 
                                    id="phone_number"
                                    name="phone_number"
                                    className="form-input" 
                                    placeholder="+92 Phone Number" 
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="whatsapp_number" className="form-label">Whatsapp Number</label>
                                <input 
                                    type="tel" 
                                    id="whatsapp_number"
                                    name="whatsapp_number"
                                    className="form-input" 
                                    placeholder="+92 Phone Number" 
                                    value={formData.whatsapp_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="company_name" className="form-label">Company Name (Optional)</label>
                                <input 
                                    type="text" 
                                    id="company_name" 
                                    name="company_name" 
                                    className="form-input" 
                                    placeholder="Company Name (Optional)" 
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="company_email" className="form-label">Company Email (Optional)</label>
                                <input 
                                    type="email" 
                                    id="company_email" 
                                    name="company_email" 
                                    className="form-input" 
                                    placeholder="Company Email (Optional)" 
                                    value={formData.company_email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input 
                                    type="text" 
                                    id="country" 
                                    name="country" 
                                    className="form-input" 
                                    placeholder="Country" 
                                    value={formData.country}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location" className="form-label">Location</label>
                                <input 
                                    type="text" 
                                    id="location" 
                                    name="location" 
                                    className="form-input" 
                                    placeholder="Location" 
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">City</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city" 
                                    className="form-input" 
                                    placeholder="City" 
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="product_quantity" className="form-label">Product Quantity</label>
                                <input 
                                    type="number" 
                                    id="product_quantity"
                                    name="product_quantity"
                                    className="form-input" 
                                    placeholder="Product Quantity" 
                                    value={formData.product_quantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="shipment_address" className="form-label">Shipment Address</label>
                                <input 
                                    type="text" 
                                    id="shipment_address"
                                    name="shipment_address"
                                    className="form-input" 
                                    placeholder="Enter full shipment address..." 
                                    value={formData.shipment_address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="emergency_contact" className="form-label">Emergency Contact Number</label>
                                <input 
                                    type="tel" 
                                    id="emergency_contact"
                                    name="emergency_contact"
                                    className="form-input" 
                                    placeholder="Enter emergency contact number" 
                                    value={formData.emergency_contact}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                className="form-textarea" 
                                placeholder="Write Message..."
                                value={formData.message}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                onChange={(token: string | null) => setRecaptchaToken(token)}
                                onExpired={() => setRecaptchaToken(null)}
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
