import { useState, useEffect, useRef } from 'react';
import { Assessment } from '../lib/validation/assessment-schema';
import { saveFormDraft, loadFormDraft, clearFormDraft } from '../utils/autosave';
import { merge } from 'lodash';

export const useFormWithAutosave = (initialData: Assessment) => {
  const [formData, setFormData] = useState<Assessment>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  // Load saved draft on initial mount
  useEffect(() => {
    const savedDraft = loadFormDraft();
    if (savedDraft) {
      setFormData(prevData => ({
        ...initialData,  // Ensure structure
        ...savedDraft.data  // Override with saved data
      }));
      setLastSaved(savedDraft.timestamp);
    }
    setIsLoading(false);
  }, []);

  // Set up autosave
  useEffect(() => {
    if (!isLoading) {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = window.setTimeout(() => {
        saveFormDraft(formData);
        setLastSaved(new Date().toISOString());
      }, 5000);
    }

    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, isLoading]);

  const updateFormData = (newData: Partial<Assessment>) => {
    setFormData(prev => {
      // Deep merge the new data with previous state
      const updated = merge({}, prev, newData);
      return updated;
    });
  };

  const clearDraft = () => {
    clearFormDraft();
    setFormData(initialData);
    setLastSaved(null);
  };

  return {
    formData,
    updateFormData,
    isLoading,
    lastSaved,
    clearDraft
  };
};