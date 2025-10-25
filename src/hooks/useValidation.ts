import { useLanguage } from '../contexts/LanguageContext';

export const useValidation = () => {
  const { t } = useLanguage();

  const getValidationMessage = (error: any, fieldType?: string): string => {
    if (!error) return '';
    
    const message = error.message as string;
    
    // Map common validation messages to translation keys
    if (message === 'Required') {
      return t('validation.required');
    }
    
    if (message === 'Invalid email') {
      return t('validation.email');
    }
    
    if (message === 'Invalid phone number') {
      return t('validation.phone');
    }
    
    if (message.includes('Invalid phone number')) {
      return t('validation.phone');
    }
    
    if (message.includes('minimum')) {
      const min = message.match(/\d+/)?.[0];
      return t('validation.minLength', { min: min || '1' });
    }
    
    if (message.includes('maximum')) {
      const max = message.match(/\d+/)?.[0];
      return t('validation.maxLength', { max: max || '100' });
    }
    
    // Fallback to original message if no mapping found
    return message;
  };

  return { getValidationMessage };
};
