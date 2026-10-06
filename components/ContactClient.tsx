'use client';

import React from "react";
import ConditionalLayout from "@/components/ConditionalLayout";
import ContactForm from "@/components/ContactForm";

const ContactClient = () => {
    return (
        <ConditionalLayout>
            <ContactContent />
        </ConditionalLayout>
    );
};

const ContactContent = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="container mx-auto relative z-10 py-16 px-4">
                <div className="text-center mt-24 mb-12">
                    <h1 className="mb-8">Contact Us</h1>
                </div>
                <ContactForm />
            </div>
        </div>
    );
};

export default ContactClient;
