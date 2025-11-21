import React from 'react';
import { FormProvider } from './context/FormContext';
import './styles/App.css';
import AppContent from './AppContent';
function Main() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}
export default Main;