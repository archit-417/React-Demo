import React from 'react';
import { useForm } from '../context/FormContext';
const Step4Review = () => {
    const { formData, isSubmitted, updateFormData } = useForm(); // Added updateFormData here
    const formatPhone = (phone) => {
        if (!phone) return 'Not provided';
        return phone;
    };
    const formatDate = (date) => {
        if (!date) return 'Not provided';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const getYesNo = (value) => {
        return value ? 'Yes' : 'No';
    };
    if (isSubmitted) {
        return (
            <div className="form-step submitted">
                <div className="success-animation">✓</div>
                <h2>Thank You!</h2>
                <p className="success-message">
                    Your form has been submitted successfully. We've sent a confirmation
                    email to{' '}
                    <strong>{formData.email}</strong>.
                </p>
                <div className="next-steps">
                    <h3>What happens next?</h3>
                    <ul>
                        <li>You'll receive a welcome email within 24 hours</li>
                        <li>Our team will review your information</li>
                        <li>We'll contact you if we need any additional details</li>
                    </ul>
                </div>
            </div>
        );
    }
    return (
        <div className="form-step">
            <h2>Review Your Information</h2>
            <p className="step-description">
                Please review all the information you've provided before submitting.
            </p>
            <div className="review-sections">
                <div className="review-section">
                    <h3>Personal Information</h3>
                    <div className="review-grid">
                        <div className="review-item">
                            <span className="label">First Name:</span>
                            <span className="value">{formData.firstName || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Last Name:</span>
                            <span className="value">{formData.lastName || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Email:</span>
                            <span className="value">{formData.email || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Phone:</span>
                            <span className="value">{formatPhone(formData.phone)}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Date of Birth:</span>
                            <span className="value">{formatDate(formData.dateOfBirth)}</span>
                        </div>
                    </div>
                </div>
                <div className="review-section">
                    <h3>Address Information</h3>
                    <div className="review-grid">
                        <div className="review-item">
                            <span className="label">Street:</span>
                            <span className="value">{formData.street || 'Not provided'}</span>
                        </div>
                        {formData.apartment && (
                            <div className="review-item">
                                <span className="label">Apartment/Unit:</span>
                                <span className="value">{formData.apartment}</span>
                            </div>
                        )}
                        <div className="review-item">
                            <span className="label">City:</span>
                            <span className="value">{formData.city || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">State:</span>
                            <span className="value">{formData.state || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">ZIP Code:</span>
                            <span className="value">{formData.zipCode || 'Not provided'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Country:</span>
                            <span className="value">{formData.country || 'Not provided'}</span>
                        </div>
                    </div>
                </div>
                <div className="review-section">
                    <h3>Communication Preferences</h3>
                    <div className="review-grid">
                        <div className="review-item">
                            <span className="label">Newsletter:</span>
                            <span className="value">{getYesNo(formData.newsletter)}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Promotional Offers:</span>
                            <span className="value">{getYesNo(formData.promotional)}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Account Updates:</span>
                            <span className="value">{getYesNo(formData.accountUpdates)}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">SMS Notifications:</span>
                            <span
                                className="value">{getYesNo(formData.smsNotifications)}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Contact Frequency:</span>
                            <span className="value">{formData.contactFrequency ?
                                formData.contactFrequency.charAt(0).toUpperCase() +
                                formData.contactFrequency.slice(1) : 'Not specified'}</span>
                        </div>
                        <div className="review-item">
                            <span className="label">Preferred Contact:</span>
                            <span className="value">{formData.preferredContact ?
                                formData.preferredContact.charAt(0).toUpperCase() +
                                formData.preferredContact.slice(1) : 'Not specified'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="confirmation-checkbox">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={formData.confirmation || false}
                        onChange={(e) => updateFormData({ confirmation: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    I confirm that all the information provided is accurate and complete.
                </label>
            </div>
        </div>
    );
};
export default Step4Review;