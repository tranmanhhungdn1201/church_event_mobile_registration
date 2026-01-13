import type { RegistrationFormData } from '../components/RegistrationForm';

// API base URL - có thể được cấu hình từ environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API Key - có thể được cấu hình từ environment variable
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Tạo headers mặc định cho API requests
 */
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};
  
  // Thêm X-API-Key nếu có
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  
  return headers;
};

/**
 * Chuẩn bị dữ liệu để gửi API
 */
const prepareFormData = (formData: RegistrationFormData, isDraft: boolean = false) => {
  const submitData = {
    personalInfo: {
      fullName: formData.personalInfo.fullName,
      gender: formData.personalInfo.gender,
      phoneNumber: formData.personalInfo.phoneNumber,
      email: formData.personalInfo.email,
      church: formData.personalInfo.church,
      maritalStatus: formData.personalInfo.maritalStatus
    },
    familyParticipation: formData.familyParticipation,
    travelSchedule: formData.travelSchedule,
    packageSelection: formData.packageSelection,
    payment: {
      status: formData.payment.status,
      transferDate: formData.payment.transferDate ? formData.payment.transferDate.toISOString() : null,
      receiptImage: formData.payment.receiptImage ? formData.payment.receiptImage : null
    },
    accommodation: formData.accommodation,
    isDraft,
    submittedAt: new Date().toISOString()
  };

  return submitData;
};

/**
 * Lưu draft (tiến trình) lên server
 */
export const saveDraft = async (formData: RegistrationFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const submitData = prepareFormData(formData, true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(submitData));
    
    // Nếu có receipt image, thêm vào FormData
    if (formData.payment.receiptImage) {
      formDataToSend.append('receiptImage', formData.payment.receiptImage);
    }

    const response = await fetch(`${API_BASE_URL}/registration/draft`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save draft');
    }

    await response.json();
    return { success: true };
  } catch (error) {
    console.error('Error saving draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Lấy draft data từ server qua email
 */
export const getDraftByEmail = async (email: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/registration/draft?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        ...getDefaultHeaders(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Không tìm thấy bản nháp với email này'
        };
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get draft');
    }

    const result = await response.json();
    return { success: true, data: result.data }; // Correctly unwrap the data field
  } catch (error) {
    console.error('Error getting draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Submit đăng ký hoàn chỉnh
 */
export const submitRegistration = async (formData: RegistrationFormData): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const submitData = prepareFormData(formData, false);
    
    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(submitData));
    
    // Nếu có receipt image, thêm vào FormData
    if (formData.payment.receiptImage) {
      formDataToSend.append('receiptImage', formData.payment.receiptImage);
    }

    const response = await fetch(`${API_BASE_URL}/registration`, {
      method: 'POST',
      headers: getDefaultHeaders(),
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit registration');
    }

    const result = await response.json();
    return { success: true, data: result.data }; // Correctly unwrap the data field
  } catch (error) {
    console.error('Error submitting registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

