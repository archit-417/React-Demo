import React from 'react';
import { useForm } from '../context/FormContext';
const Step2Address = () => {
    const { formData, updateFormData, errors } = useForm();
    const handleChange = (field, value) => {
        updateFormData({ [field]: value });
    };
    const handleZipCodeChange = (value) => {
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;
        if (numbers.length > 5) {
            formatted = `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`;
        }
        updateFormData({ zipCode: formatted });
    };
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
        "Chandigarh", "Dadra and Nagar Haveli", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    return (
        <div className="form-step">
            <h2>Address Information</h2>
            <p className="step-description">
                Please provide your current mailing address.
            </p>
            <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                    id="street"
                    type="text"
                    value={formData.street || ''}
                    onChange={(e) => handleChange('street', e.target.value)}
                    className={errors.street ? 'error' : ''}
                    placeholder="123 Main Street"
                />
                {errors.street && <span className="error-text">{errors.street}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="apartment">Apartment/Unit (Optional)</label>
                <input
                    id="apartment"
                    type="text"
                    value={formData.apartment || ''}
                    onChange={(e) => handleChange('apartment', e.target.value)}
                    placeholder="Apt 4B"
                />
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                        id="city"
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className={errors.city ? 'error' : ''}
                        placeholder="New York"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <select
                        id="state"
                        value={formData.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className={errors.state ? 'error' : ''}
                    >
                        <option value="">Select a state</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode || ''}
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                    className={errors.zipCode ? 'error' : ''}
                    placeholder="12345 or 12345-6789"
                    maxLength="10"
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    type="text"
                    value={formData.country || 'United States'}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="India"
                />
            </div>
        </div>
    );
};
export default Step2Address;