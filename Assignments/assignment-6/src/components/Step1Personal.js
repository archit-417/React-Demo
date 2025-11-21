import React from 'react';
import { useForm } from '../context/FormContext';
const Step1Personal = () => {
    const { formData, updateFormData, errors } = useForm();
    const handleChange = (field, value) => {
        updateFormData({ [field]: value });
    };
    const handlePhoneChange = (value) => {
        // Auto-format phone number
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;
        if (numbers.length > 3 && numbers.length <= 6) {
            formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        } else if (numbers.length > 6) {
            formatted = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        }
        updateFormData({ phone: formatted });
    };
    return (
        <div className="form-step">
            <h2>Personal Information</h2>
            <p className="step-description">
                Please provide your basic personal details.
            </p>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                        id="firstName"
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={errors.firstName ? 'error' : ''}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                        id="lastName"
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={errors.lastName ? 'error' : ''}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={errors.phone ? 'error' : ''}
                    placeholder="(555) 123-4567"
                    maxLength="14"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>
        </div>
    );
};
export default Step1Personal;