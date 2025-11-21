import React from 'react';
import { useForm } from '../context/FormContext';
const ProgressBar = () => {
    const { currentStep, goToStep, formData } = useForm();
    const steps = [
        {
            number: 1, title: 'Personal', completed: currentStep > 1 || !!formData.firstName
        },
        {
            number: 2, title: 'Address', completed: currentStep > 2 || !!formData.street
        },
        { 
            number: 3, title: 'Preferences', completed: currentStep > 3 
        },
        { 
            number: 4, title: 'Review' 
        }
    ];
    const isStepAccessible = (stepNumber) => {
        // Allow going back to any completed step
        if (stepNumber < currentStep) return true;
        // For future steps, only allow if previous steps are completed
        switch (stepNumber) {
            case 2:
                return !!formData.firstName && !!formData.email;
            case 3:
                return !!formData.street && !!formData.city;
            case 4:
                return currentStep === 4; // Only allow if we're already on step 4
            default:
                return true;
        }
    };
    return (
        <div className="progress-bar">
            <div className="steps">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div
                            className={`step ${currentStep === step.number ? 'active' : ''} ${step.completed ? 'completed' : ''
                                } ${isStepAccessible(step.number) ? 'accessible' : 'locked'}`}
                            onClick={() => isStepAccessible(step.number) &&
                                goToStep(step.number)}
                        >
                            <div className="step-number">
                                {step.completed ? '✓' : step.number}
                            </div>
                            <div className="step-title">{step.title}</div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`connector ${step.completed ? 'completed' : ''}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="progress-text">
                Step {currentStep} of {steps.length}
            </div>
        </div>
    );
};
export default ProgressBar;