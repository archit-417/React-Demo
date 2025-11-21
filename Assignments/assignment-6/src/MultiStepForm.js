import React from 'react';
import { useForm } from './context/FormContext';
import ProgressBar from './components/ProgressBar';
import Step1Personal from './components/Step1Personal';
import Step2Address from './components/Step2Address';
import Step3Preference from './components/Step3Preference';
import Step4Review from './components/Step4Review';
import FormNavigation from './components/FormNavigation';
import './styles/MultiStepForm.css';

const MultiStepForm = () => {
    const { currentStep, isSubmitted } = useForm();
    const renderCurrentStep = () => {
        if (isSubmitted) {
            return <Step4Review />;
        }
        switch (currentStep) {
            case 1:
                return <Step1Personal />;
            case 2:
                return <Step2Address />;
            case 3:
                return <Step3Preference />;
            case 4:
                return <Step4Review />;
            default:
                return <Step1Personal />;
        }
    };
    return (
        <div className="multi-step-form">
            <div className="form-container">
                <header className="form-header">
                    <h1>Multi-Step Registration</h1>
                    <p>Complete your registration in a few simple steps</p>
                </header>
                {!isSubmitted && <ProgressBar />}
                <div className="form-content">
                    {renderCurrentStep()}
                </div>
                {!isSubmitted && <FormNavigation />}
                <footer className="form-footer">
                    <p>
                        <strong>Auto-save enabled:</strong> 
                        Your progress is automatically saved.
                        You can return anytime to complete your registration.
                    </p>
                </footer>
            </div>
        </div>
    );
};
export default MultiStepForm;