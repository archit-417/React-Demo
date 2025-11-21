import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import dynamoDBService from '../services/dynamodbService';
const FormContext = createContext();
export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useForm must be used within a FormProvider');
    }
    return context;
};
const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_STEP':
            return {
                ...state,
                currentStep: action.payload,
                errors: {}
            };
        case 'UPDATE_FORM_DATA':
            return {
                ...state,
                formData: { ...state.formData, ...action.payload },
                errors: Object.keys(action.payload).reduce((acc, field) => {
                    const { [field]: removed, ...rest } = state.errors;
                    return rest;
                }, state.errors)
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: { ...state.errors, ...action.payload }
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                errors: {}
            };
        case 'SET_SUBMITTED':
            return {
                ...state,
                isSubmitted: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_FORM_ID':
            return {
                ...state,
                formId: action.payload
            };
        case 'SET_FORM_TITLE':
            return {
                ...state,
                formTitle: action.payload
            };
        case 'SET_FORM_STATUS':
            return {
                ...state,
                formStatus: action.payload
            };
        case 'SET_FORM_LIST':
            return {
                ...state,
                formList: action.payload
            };
        case 'SET_VIEW':
            return {
                ...state,
                currentView: action.payload
            };
        case 'RESET_CURRENT_FORM':
            return {
                ...state,
                currentStep: 1,
                formData: {},
                errors: {},
                isSubmitted: false,
                formId: null,
                formTitle: 'Untitled Form',
                formStatus: 'draft'
            };
        default:
            return state;
    }
};
const initialState = {
    currentStep: 1,
    formData: {},
    errors: {},
    isSubmitted: false,
    loading: false,
    formId: null,
    formTitle: 'Untitled Form',
    formStatus: 'draft',
    formList: [],
    currentView: 'dashboard'
};
export const FormProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);
    // CRUD Operations
    // CREATE - Create new form
    const createNewForm = async (title = 'Untitled Form') => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const newForm = await dynamoDBService.createForm({
                formData: {},
                currentStep: 1,
                title,
                status: 'draft'
            });
            dispatch({ type: 'SET_FORM_ID', payload: newForm.formId });
            dispatch({ type: 'SET_FORM_TITLE', payload: newForm.title });
            dispatch({ type: 'SET_FORM_STATUS', payload: newForm.status });
            dispatch({ type: 'SET_VIEW', payload: 'form' });
            await loadFormList();
            return newForm;
        } catch (error) {
            console.error('Error creating new form:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    // READ - Load specific form
    const loadForm = async (formId) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const formData = await dynamoDBService.getForm(formId);
            if (formData) {
                dispatch({ type: 'UPDATE_FORM_DATA', payload: formData.formData });
                dispatch({ type: 'SET_STEP', payload: formData.currentStep });
                dispatch({ type: 'SET_FORM_ID', payload: formId });
                dispatch({ type: 'SET_FORM_TITLE', payload: formData.title });
                dispatch({ type: 'SET_FORM_STATUS', payload: formData.status });
                dispatch({ type: 'SET_SUBMITTED', payload: false });
                dispatch({ type: 'SET_VIEW', payload: 'form' });
                console.log('Form loaded from DynamoDB:', formId);
                return formData;
            }
            return null;
        } catch (error) {
            console.error('Error loading form:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    // READ - Load all forms
    const loadFormList = async () => {
        try {
            const result = await dynamoDBService.getAllForms();
            dispatch({ type: 'SET_FORM_LIST', payload: result.forms });
            return result;
        } catch (error) {
            console.error('Error loading form list:', error);
            throw error;
        }
    };
    // SEARCH - Search forms
    const searchForms = async (searchTerm, status = null) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const results = await dynamoDBService.searchForms(searchTerm, status);
            dispatch({ type: 'SET_FORM_LIST', payload: results });
            return results;
        } catch (error) {
            console.error('Error searching forms:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    // UPDATE - Save form data
    const saveForm = useCallback(async (updates = {}) => {
        if (!state.formId) return;
        try {
            const updateData = {
                formData: updates.formData || state.formData,
                currentStep: updates.currentStep || state.currentStep,
                title: updates.title || state.formTitle,
                status: updates.status || state.formStatus,
            };
            await dynamoDBService.updateForm(state.formId, updateData);
            console.log('Form saved to DynamoDB');
            if (updates.title) {
                dispatch({ type: 'SET_FORM_TITLE', payload: updates.title });
            }
            if (updates.status) {
                dispatch({ type: 'SET_FORM_STATUS', payload: updates.status });
            }
            return true;
        } catch (error) {
            console.error('Error saving form to DynamoDB:', error);
            throw error;
        }
    }, [state.formId, state.formData, state.currentStep, state.formTitle, state.formStatus]);

    // UPDATE - Update form metadata
    const updateFormMetadata = async (updates) => {
        if (!state.formId) return;
        try {
            await dynamoDBService.updateForm(state.formId, updates);
            if (updates.title) {
                dispatch({ type: 'SET_FORM_TITLE', payload: updates.title });
            }
            if (updates.status) {
                dispatch({ type: 'SET_FORM_STATUS', payload: updates.status });
            }
            await loadFormList();
            return true;
        } catch (error) {
            console.error('Error updating form metadata:', error);
            throw error;
        }
    };

    // DELETE - Delete form
    const deleteForm = async (formId) => {
        if (!formId) return;
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await dynamoDBService.deleteForm(formId);
            console.log('Form deleted from DynamoDB:', formId);
            // If deleting current form, reset state
            if (formId === state.formId) {
                dispatch({ type: 'RESET_CURRENT_FORM' });
                dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
            }
            await loadFormList();
            return true;
        } catch (error) {
            console.error('Error deleting form:', error);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Auto-save when form data changes - FIXED with useCallback
    useEffect(() => {
        const autoSave = async () => {
            if (state.formId && (Object.keys(state.formData).length > 0 || state.currentStep >
                1)) {
                const timeoutId = setTimeout(async () => {
                    try {
                        await saveForm();
                    } catch (error) {
                        console.error('Auto-save failed:', error);
                    }
                }, 2000);
                return () => clearTimeout(timeoutId);
            }
        };
        autoSave();
    }, [state.formData, state.currentStep, state.formId, saveForm]); // Added saveForm to dependencies

    // Load form list on component mount
    useEffect(() => {
        loadFormList();
    }, []);

    //Rest of the functions remain the same (nextStep, prevStep, etc.)
    const nextStep = () => {
        if (state.currentStep < 4) {
            dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
        }
    };
    const prevStep = () => {
        if (state.currentStep > 1) {
            dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
        }
    };
    const goToStep = (step) => {
        if (step >= 1 && step <= 4) {
            dispatch({ type: 'SET_STEP', payload: step });
        }
    };
    const updateFormData = (data) => {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
    };
    const setErrors = (errors) => {
        dispatch({ type: 'SET_ERRORS', payload: errors });
    };
    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    };
    const setView = (view) => {
        dispatch({ type: 'SET_VIEW', payload: view });
    };
    const validateCurrentStep = () => {
        const errors = {};
        switch (state.currentStep) {
            case 1:
                if (!state.formData.firstName?.trim()) {
                    errors.firstName = 'First name is required';
                }
                if (!state.formData.lastName?.trim()) {
                    errors.lastName = 'Last name is required';
                }
                if (!state.formData.email?.trim()) {
                    errors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(state.formData.email)) {
                    errors.email = 'Email is invalid';
                }
                break;
            case 2:
                if (!state.formData.street?.trim()) {
                    errors.street = 'Street address is required';
                }
                if (!state.formData.city?.trim()) {
                    errors.city = 'City is required';
                }
                if (!state.formData.zipCode?.trim()) {
                    errors.zipCode = 'ZIP code is required';
                }
                break;
            default:
                break;
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return false;
        }
        clearErrors();
        return true;
    };
    const submitForm = async () => {
        const allErrors = {};
        if (!state.formData.firstName?.trim()) {
            allErrors.firstName = 'First name is required';
        }
        if (!state.formData.lastName?.trim()) {
            allErrors.lastName = 'Last name is required';
        }
        if (!state.formData.email?.trim()) {
            allErrors.email = 'Email is required';
        }
        if (!state.formData.street?.trim()) {
            allErrors.street = 'Street address is required';
        }
        if (!state.formData.city?.trim()) {
            allErrors.city = 'City is required';
        }
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            const firstErrorStep = allErrors.firstName || allErrors.lastName || allErrors.email
                ? 1 : 2;
            dispatch({ type: 'SET_STEP', payload: firstErrorStep });
            return false;
        }
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            await updateFormMetadata({ status: 'submitted' });
            dispatch({ type: 'SET_SUBMITTED', payload: true });
            dispatch({ type: 'SET_FORM_STATUS', payload: 'submitted' });
            console.log('Form submitted successfully');
            return true;
        } catch (error) {
            console.error('Form submission failed:', error);
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };
    const resetForm = async () => {
        if (window.confirm('Are you sure you want to reset this form? All data will be permanently deleted.')) {
            try {
                if (state.formId) {
                    await deleteForm(state.formId);
                }
            } catch (error) {
                console.error('Error resetting form:', error);
            }
        }
    };
    const value = {
        // State
        ...state,
        // CRUD Operations
        createNewForm,
        loadForm,
        loadFormList,
        searchForms,
        saveForm,
        updateFormMetadata,
        deleteForm,
        // Navigation
        nextStep,
        prevStep,
        goToStep,
        updateFormData,
        validateCurrentStep,
        submitForm,
        resetForm,
        setView,
    };
    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
};