import React from 'react';
import { FormProvider, useForm } from './context/FormContext';
import MultiStepForm from './MultiStepForm';
import FormDashboard from './components/FormDashboard';
import './styles/App.css';
const AppContent = () => {
  const { currentView, setView } = useForm();
  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-brand">
          <h1> Form Manager Pro</h1>
          <span className="nav-subtitle">AWS DynamoDB CRUD System</span>
        </div>
        <div className="nav-links">
          <button
            onClick={() => setView('dashboard')}
            className={currentView === 'dashboard' ? 'active' : ''}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView('form')}
            className={currentView === 'form' ? 'active' : ''}
            disabled={!useForm().formId && currentView !== 'form'}
          >
            Form Editor
          </button>
        </div>
      </nav>
      <main className="app-main">
        {currentView === 'dashboard' ? <FormDashboard /> : <MultiStepForm />}
      </main>
    </div>
  );
};
export default AppContent;