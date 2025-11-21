import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from '../context/FormContext';
const FormDashboard = () => {
    const {
        formList,
        loadFormList,
        createNewForm,
        loadForm,
        deleteForm,
        searchForms,
        loading
    } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newFormTitle, setNewFormTitle] = useState('');
    // Wrap loadFormList in useCallback to prevent infinite re-renders
    const loadForms = useCallback(async () => {
        await loadFormList();
    }, [loadFormList]);
    useEffect(() => {
        loadForms();
    }, [loadForms]); // Now use the memoized function
    const handleSearch = async () => {
        if (searchTerm.trim() || statusFilter !== 'all') {
            await searchForms(searchTerm, statusFilter);
        } else {
            loadForms();
        }
    };
    const handleCreateForm = async () => {
        if (newFormTitle.trim()) {
            await createNewForm(newFormTitle);
            setNewFormTitle('');
            setShowCreateForm(false);
        }
    };
    const handleDeleteForm = async (formId, formTitle) => {
        if (window.confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
            await deleteForm(formId);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: 'status-draft', text: 'Draft' },
            submitted: { color: 'status-submitted', text: 'Submitted' },
            in_review: { color: 'status-in-review', text: 'In Review' },
            completed: { color: 'status-completed', text: 'Completed' }
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`status-badge ${config.color}`}>
                {config.text}
            </span>
        );
    };
    return (
        <div className="form-dashboard">
            <div className="dashboard-header">
                <h2>Form Management Dashboard</h2>
                <p>Create, manage, and track your multi-step forms with AWS DynamoDB</p>
            </div>
            {/* Search and Filter Section */}
            <div className="search-section">
                <div className="search-filters">
                    <div className="search-input">
                        <input
                            type="text"
                            placeholder="Search forms by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="search-btn">Search</button>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="in_review">In Review</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateForm(true)}
                    >
                        + Create New Form
                    </button>
                </div>
            </div>
            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Create New Form</h3>
                        <input
                            type="text"
                            placeholder="Enter form title..."
                            value={newFormTitle}
                            onChange={(e) => setNewFormTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateForm()}
                            className="modal-input"
                        />
                        <div className="modal-actions">
                            <button
                                onClick={handleCreateForm}
                                disabled={!newFormTitle.trim()}
                                className="btn btn-primary"
                            >
                                Create Form
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Forms List */}
            <div className="forms-list">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading forms from DynamoDB...</p>
                    </div>
                ) : formList.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"> </div>
                        <h3>No forms found</h3>
                        <p>Create your first form to get started with AWS DynamoDB integration</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn btn-primary"
                        >
                            Create Your First Form
                        </button>
                    </div>
                ) : (
                    <div className="forms-grid">
                        {formList.map((form) => (
                            <div key={form.formId} className="form-card">
                                <div className="form-card-header">
                                    <h4 className="form-card-title">{form.title}</h4>
                                    {getStatusBadge(form.status)}
                                </div>
                                <div className="form-card-body">
                                    <div className="form-info">
                                        <div className="info-item">
                                            <span className="label">Form ID:</span>
                                            <span className="value code">{form.formId}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Progress:</span>
                                            <span className="value">Step {form.currentStep} of 4</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Created:</span>
                                            <span className="value">{formatDate(form.createdAt)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Updated:</span>
                                            <span className="value">{formatDate(form.updatedAt)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Fields Completed:</span>
                                            <span className="value">{Object.keys(form.formData).length}
                                                fields</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-card-actions">
                                    <button
                                        onClick={() => loadForm(form.formId)}
                                        className="btn btn-primary"
                                    >
                                        {form.status === 'submitted' ? 'View' : 'Edit'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForm(form.formId, form.title)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(form.formId);
                                            alert('Form ID copied to clipboard!');
                                        }}
                                        className="btn btn-secondary"
                                        title="Copy Form ID"
                                    >
                                        Copy ID
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="dashboard-footer">
                <p>
                    <strong>Total Forms:</strong> {formList.length} |
                    <strong> Storage:</strong> AWS DynamoDB |
                    <strong> Features:</strong> Full CRUD Operations
                </p>
            </div>
        </div>
    );
};
export default FormDashboard;