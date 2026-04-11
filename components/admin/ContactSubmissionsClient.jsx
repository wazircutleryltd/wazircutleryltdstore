'use client';
import { useState, useEffect } from 'react';
import { Eye, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAllContactSubmissions, useUpdateContactSubmissionStatus } from '../../lib/supabase-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingState, ErrorState, NoDataState } from '../common/StateComponents';

const ContactSubmissionsClient = () => {
    const { data: submissions, isLoading: loading, error } = useAllContactSubmissions();
    const [localSubmissions, setLocalSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { updateContactSubmissionStatus, isLoading: isUpdating } = useUpdateContactSubmissionStatus();

    useEffect(() => {
        if (submissions) {
            const sortedSubmissions = [...submissions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setLocalSubmissions(sortedSubmissions);
        }
    }, [submissions]);

    const handleUpdateStatus = async (submissionId, newStatus) => {
        const updatedSubmission = await updateContactSubmissionStatus(submissionId, newStatus);
        if (updatedSubmission) {
            setLocalSubmissions(prevSubmissions =>
                prevSubmissions.map(submission =>
                    submission.id === submissionId ? { ...submission, status: newStatus } : submission
                )
            );
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'in_progress':
                return <Eye className="w-4 h-4 text-blue-500" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Mail className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const viewSubmissionDetails = (submission) => {
        setSelectedSubmission(submission);
        setShowModal(true);
        if (submission.status === 'new') {
            handleUpdateStatus(submission.id, 'in_progress');
        }
    };

    if (loading) {
        return <LoadingState message="Fetching inquiries..." minHeight="h-[60vh]" />;
    }

    if (error) {
        return <ErrorState message="Could not load contact submissions." minHeight="h-[60vh]" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
                <div className="text-sm text-gray-500">
                    Total Submissions: {localSubmissions.length}
                </div>
            </div>

            {localSubmissions.length === 0 ? (
                <NoDataState 
                    message="No submissions yet" 
                    description="User inquiries will appear here once customers contact you." 
                    minHeight="h-[40vh]" 
                />
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {localSubmissions.map((submission) => (
                            <li key={submission.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {getStatusIcon(submission.status)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {submission.message?.substring(0, 40)}{submission.message?.length > 40 ? '...' : ''}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                                <p>{submission.full_name}</p>
                                                <p>{submission.email}</p>
                                                <p>{new Date(submission.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => viewSubmissionDetails(submission)}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6AF66]"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <AnimatePresence>
                {showModal && selectedSubmission && (
                    <SubmissionDetailsModal
                        submission={selectedSubmission}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const SubmissionDetailsModal = ({ submission, onClose }) => {
    return (
        <motion.div 
            key="submission-modal-container"
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
        >
            <motion.div 
                key="submission-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
            ></motion.div>
            <motion.div 
                key="submission-modal-content"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative mx-auto p-6 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white overflow-hidden z-50"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Submission Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium">{new Date(submission.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <p className="font-medium capitalize">{submission.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Submitter Information</h4>
                        <div className="text-sm space-y-1">
                            <p><span className="text-gray-500">Name:</span> {submission.full_name}</p>
                            <p><span className="text-gray-500">Email:</span> {submission.email}</p>
                            {submission.phone_number && <p><span className="text-gray-500">Phone:</span> {submission.phone_number}</p>}
                            {submission.whatsapp_number && <p><span className="text-gray-500">WhatsApp:</span> {submission.whatsapp_number}</p>}
                            {submission.company_name && <p><span className="text-gray-500">Company:</span> {submission.company_name}</p>}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                        <div className="text-sm">
                            <p className="text-gray-600 whitespace-pre-wrap">{submission.message}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#D6AF66] text-white font-medium rounded-lg hover:bg-[#C19A5A] focus:outline-none focus:ring-4 focus:ring-[#D6AF66]/20 transition-all active:scale-95 shadow-lg shadow-[#D6AF66]/20"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactSubmissionsClient;