import React from 'react';
import { useForm } from '../context/FormContext';
const FormNavigation = () => {
    const {
        currentStep,
        prevStep,
        nextStep,
        validateCurrentStep,
        submitForm,
        resetForm,
        setView,
        formData,
        isSubmitted,
        loading
    } = useForm();
    const handleNext = () => {
        if (validateCurrentStep()) {
            nextStep();
        }
    };
    const handleSubmit = async () => {
        if (!formData.confirmation) {
            alert('Please confirm that all information is accurate before submitting.');
            return;
        }
        const success = await submitForm();
        if (!success) {
            alert('Please fix the errors before submitting.');
        }
    };
    // Remove the unused handleReset function or use it
    // Since resetForm is used in the success state, we'll keep it but remove the unused variable
    if (isSubmitted) {
        return (
            <div className="form-navigation">
                <button
                    type="button"
                    onClick={() => setView('dashboard')}
                    className="btn btn-secondary"
                >
                    ← Back to Dashboard
                </button>
                <button
                    type="button"
                    onClick={resetForm} // Using resetForm directly here
                    className="btn btn-primary"
                >
                    Create New Form
                </button>
            </div>
        );
    }
    if (loading) {
        return (
            <div className="form-navigation">
                <div className="loading-text">Saving to AWS DynamoDB...</div>
            </div>
        );
    }
    return (
        <div className="form-navigation">
            <div className="nav-left">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        ← Previous
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => setView('dashboard')}
                    className="btn btn-text"
                >
                    ← Dashboard
                </button>
            </div>
            <div className="nav-right">
                {currentStep < 4 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-success"
                        disabled={!formData.confirmation || loading}
                    >
                        {loading ? 'Submitting...' : 'Submit to DynamoDB'}
                    </button>
                )}
            </div>
        </div>
    );
};
export default FormNavigation;