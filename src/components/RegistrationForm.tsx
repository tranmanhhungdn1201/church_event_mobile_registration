import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormLayout } from './FormLayout';
import { Step1PersonalInfo } from './steps/Step1PersonalInfo';
import { Step2FamilyParticipation } from './steps/Step2FamilyParticipation';
import { Step3TravelSchedule } from './steps/Step3TravelSchedule';
import { Step4Package } from './steps/Step4Package';
import { Step5Payment } from './steps/Step5Payment';
import { Step6Accommodation } from './steps/Step6Accommodation';
import { ReviewStep } from './steps/ReviewStep';
import { SuccessStep } from './steps/SuccessStep';
import { SaveDraftModal } from './SaveDraftModal';
import { LoadDraftModal } from './LoadDraftModal';
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { saveDraft, submitRegistration } from '../utils/api';
// Form schema for the entire registration process
const createRegistrationSchema = () => z.object({
  // Step 1: Personal Information
  personalInfo: z.object({
    fullName: z.string().min(1, 'Required'),
    gender: z.enum(['male', 'female']),
    phoneNumber: z.string().min(10, 'Invalid phone number').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
    email: z.string().email('Invalid email').min(1, 'Required'),
    church: z.string().min(1, 'Required'),
    maritalStatus: z.string().min(1, 'Required')
  }),
  // Step 2: Family Participation
  familyParticipation: z.object({
    attendingWithSpouse: z.boolean().optional(),
    spouseName: z.string().optional(),
    spousePhone: z.string().optional(),
    numberOfChildren: z.number().min(0).default(0),
    counts: z.object({
      above11: z.number().min(0).default(0),
      between6And11: z.number().min(0).default(0),
      under6: z.number().min(0).default(0)
    }).optional(),
    children: z.array(z.object({
      name: z.string(),
      age: z.number().min(0).max(18),
      group: z.string().optional()
    })).optional()
  }),
  // Step 4: Travel Schedule (now optional)
  travelSchedule: z.object({
    noTravelInfo: z.boolean().optional(),
    arrivalDate: z.date().optional(),
    transport: z.enum(['plane', 'train', 'bus', 'self']).optional(),
    flightCode: z.string().optional(),
    returnDate: z.date().optional()
  }).refine((data) => {
    // If noTravelInfo is true, all other fields are optional
    if (data.noTravelInfo) {
      return true;
    }
    // If noTravelInfo is false or undefined, validate normally
    return true;
  }).optional(),
  // Step 3: Package & Souvenir
  packageSelection: z.object({
    adultPackages: z.array(z.object({
      id: z.string(),
      quantity: z.number().min(0)
    })).default([]),
    childPackages: z.array(z.object({
      id: z.string(),
      quantity: z.number().min(0)
    })).default([]),
    shirts: z.array(z.object({
      size: z.enum(['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']),
      quantity: z.number().min(1)
    })).optional(),
    magazineQuantity: z.number().min(0).default(0).optional()
  }).refine((data) => {
    // Ensure at least one package is selected
    const totalPackages = 
      data.adultPackages.reduce((sum, pkg) => sum + pkg.quantity, 0) + 
      data.childPackages.reduce((sum, pkg) => sum + pkg.quantity, 0);
    return totalPackages > 0;
  }, {
    message: "Vui lòng chọn ít nhất một gói tham gia",
    path: ["adultPackages"]
  }),
  // Step 5: Payment
  payment: z.object({
    status: z.enum(['paid', 'willPayLater']),
    transferDate: z.date().optional(),
    receiptImage: z.any().nullable().optional()
  }).refine((data) => {
    // If status is 'paid', both receiptImage and transferDate are required
    if (data.status === 'paid') {
      return data.receiptImage !== null && data.receiptImage !== undefined && data.transferDate !== undefined;
    }
    return true;
  }, {
    message: 'Transfer date and receipt image are required when payment status is paid',
    path: ['receiptImage']
  }),
  // Step 6: Accommodation & Sponsorship (now optional)
  accommodation: z.object({
    assistanceDetails: z.string().optional(),
    participateBigGame: z.enum(['yes', 'no', 'considering']).optional(),
    participateSports: z.enum(['yes', 'no', 'considering']).optional(),
    sponsorshipAmount: z.number().optional(),
    bankNote: z.string().optional()
  }),
  isDraft: z.boolean().optional()
});
export type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;
const getSteps = (t: (key: string) => string) => [{
  id: 1,
  title: t('navigation.step1'),
  component: Step1PersonalInfo
}, {
  id: 2,
  title: t('navigation.step2'),
  component: Step2FamilyParticipation
}, {
  id: 3,
  title: t('navigation.step3'),
  component: Step3TravelSchedule
}, {
  id: 4,
  title: t('navigation.step4'),
  component: Step4Package
}, {
  id: 5,
  title: t('navigation.step5'), // Payment
  component: Step5Payment
}, {
  id: 6,
  title: t('navigation.step6'), // Accomodation & Sponsorship
  component: Step6Accommodation
}, {
  id: 7,
  title: t('navigation.step7'),
  component: ReviewStep
}];


const DEFAULT_VALUES: any = {
  personalInfo: {
    fullName: '',
    gender: 'male',
    phoneNumber: '',
    email: '',
    church: 'Cần Thơ',
    maritalStatus: ''
  },
  familyParticipation: {
    attendingWithSpouse: false,
    spouseName: '',
    spousePhone: '',
    numberOfChildren: 0,
    counts: {
      above11: 0,
      between6And11: 0,
      under6: 0
    },
    children: []
  },
  travelSchedule: {
    noTravelInfo: false,
    flightCode: ''
  },
  packageSelection: {
    adultPackages: [],
    childPackages: [],
    shirts: [],
    magazineQuantity: 0
  },
  payment: {
    status: 'willPayLater',
    transferDate: new Date(),
    receiptImage: null
  },
  accommodation: {
    assistanceDetails: '',
    participateBigGame: 'considering',
    participateSports: 'considering',
    bankNote: ''
  }
};

export const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isLoadDraftModalOpen, setIsLoadDraftModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const { t } = useLanguage();
  const steps = getSteps(t);
  const registrationSchema = createRegistrationSchema();
  
  // Initialize form with default values and validation schema
  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: DEFAULT_VALUES
  });
  // Helper function to convert and load form data
  const loadFormData = (data: RegistrationFormData) => {
    try {
      // Convert string dates back to Date objects
      if (data.travelSchedule?.arrivalDate) {
        data.travelSchedule.arrivalDate = data.travelSchedule.arrivalDate instanceof Date 
          ? data.travelSchedule.arrivalDate 
          : new Date(data.travelSchedule.arrivalDate);
      }
      if (data.travelSchedule?.returnDate) {
        data.travelSchedule.returnDate = data.travelSchedule.returnDate instanceof Date 
          ? data.travelSchedule.returnDate 
          : new Date(data.travelSchedule.returnDate);
      }
      if (data.payment?.transferDate) {
        data.payment.transferDate = data.payment.transferDate instanceof Date 
          ? data.payment.transferDate 
          : new Date(data.payment.transferDate);
      }
      methods.reset(data);
      if (data.isDraft === false) {
        setIsComplete(true);
      }
      // Show notification
      setNotification({
        type: 'success',
        message: t('notifications.draftLoaded')
      });
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error loading saved data:', error);
      setNotification({
        type: 'error',
        message: t('notifications.draftLoadError')
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('churchRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        loadFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Handle loading draft from server
  const handleLoadDraftFromServer = (data: RegistrationFormData) => {
    loadFormData(data);
    // Also save to localStorage for future use
    localStorage.setItem('churchRegistrationData', JSON.stringify(data));
  };
  const saveFormData = async () => {
    const formData = methods.getValues();
    
    // Lưu vào localStorage
    localStorage.setItem('churchRegistrationData', JSON.stringify(formData));
    
    // Gửi API để lưu draft
    const result = await saveDraft(formData);
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: t('notifications.draftSaved')
      });
      setIsSaveDraftModalOpen(true);
    } else {
      setNotification({
        type: 'error',
        message: result.error || t('notifications.draftSaveError')
      });
    }
    
    // Xóa notification sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleNext = async () => {
    const maritalStatus = methods.getValues('personalInfo.maritalStatus');
    const church = methods.getValues('personalInfo.church');
    
    // Validate the current step using currentStep directly
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await methods.trigger('personalInfo');
        break;
      case 2:
        // Skip family participation if single
        if (maritalStatus === 'single') {
          isValid = true;
        } else {
          isValid = await methods.trigger('familyParticipation');
        }
        break;
      case 3:
        // Skip travel schedule if Đà Nẵng
        if (church === 'Đà Nẵng') {
          isValid = true;
        } else {
          // Check if noTravelInfo is selected, if so, skip validation
          const travelData = methods.getValues('travelSchedule');
          if (travelData?.noTravelInfo) {
            isValid = true;
          } else {
            isValid = await methods.trigger('travelSchedule');
          }
        }
        break;
      case 4:
        isValid = await methods.trigger('packageSelection');
        break;
      case 5:
        // Payment step
        const paymentData = methods.getValues('payment');
        if (paymentData.status === 'willPayLater') {
          isValid = await methods.trigger('payment.status');
        } else if (paymentData.status === 'paid') {
          // Check if required fields are filled
          const hasTransferDate = paymentData.transferDate !== null && paymentData.transferDate !== undefined;
          const hasReceiptImage = paymentData.receiptImage !== null && paymentData.receiptImage !== undefined;
          
          if (!hasTransferDate && !hasReceiptImage) {
            isValid = false;
            setNotification({
              type: 'error',
              message: t('step5.transferDateRequired') + '. ' + t('step5.receiptRequired')
            });
            setTimeout(() => setNotification(null), 3000);
          } else if (!hasTransferDate) {
            isValid = false;
            setNotification({
              type: 'error',
              message: t('step5.transferDateRequired')
            });
            setTimeout(() => setNotification(null), 3000);
          } else if (!hasReceiptImage) {
            isValid = false;
            setNotification({
              type: 'error',
              message: t('step5.receiptRequired')
            });
            setTimeout(() => setNotification(null), 3000);
          } else {
            // Both fields are filled, validate normally
            isValid = await methods.trigger('payment');
          }
        } else {
          isValid = false;
        }
        break;
      case 6:
        // Accommodation & Sponsorship
        isValid = await methods.trigger('accommodation');
        break;
      case 7:
        // Review step
        isValid = true;
        break;
      default:
        isValid = false;
    }
    if (isValid) {
      // Skip steps based on conditions
      let nextStep = currentStep + 1;
      
      // Skip step 2 if single
      if (maritalStatus === 'single' && nextStep === 2) {
        nextStep = 3;
      }
      
      // Skip step 3 if Đà Nẵng
      if (church === 'Đà Nẵng' && nextStep === 3) {
        nextStep = 4;
      }
      
      // If both single and Đà Nẵng, handle double skip
      if (maritalStatus === 'single' && church === 'Đà Nẵng') {
        if (nextStep === 2) {
          nextStep = 3; // Skip to travel (but will skip again below)
        }
        if (nextStep === 3) {
          nextStep = 4; // Skip travel
        }
      }
      
      if (nextStep <= steps.length) {
        setCurrentStep(nextStep);
        window.scrollTo(0, 0);
      } else {
        // Submit the form
        const formData = methods.getValues();
        
        // Gửi API để submit đăng ký
        const result = await submitRegistration(formData);
        
        if (result.success) {
          // Xóa draft đã lưu
          localStorage.removeItem('churchRegistrationData');
          // Hiển thị thành công
          setIsComplete(true);
          setNotification({
            type: 'success',
            message: t('notifications.submitSuccess')
          });
        } else {
          // Hiển thị lỗi
          setNotification({
            type: 'error',
            message: result.error || t('notifications.submitError')
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        }
      }
    } else {
      // Show error notification for current step validation failure
      setNotification({
        type: 'error',
        message: t('notifications.validationError')
      });
      
      // Scroll to top to see notification
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      const maritalStatus = methods.getValues('personalInfo.maritalStatus');
      const church = methods.getValues('personalInfo.church');
      let prevStep = currentStep - 1;
      
      // Skip step 2 if single
      if (maritalStatus === 'single' && prevStep === 2) {
        prevStep = 1;
      }
      
      // Skip step 3 if Đà Nẵng
      if (church === 'Đà Nẵng' && prevStep === 3) {
        prevStep = 2;
        // Also need to handle if prevStep is 2 and single
        if (maritalStatus === 'single' && prevStep === 2) {
          prevStep = 1;
        }
      }
      
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  };

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
  };
  // Calculate progress, accounting for skipped steps
  const maritalStatus = methods.getValues('personalInfo.maritalStatus');
  const church = methods.getValues('personalInfo.church');
  let effectiveTotalSteps = steps.length;
  let effectiveCurrentStep = currentStep;
  
  // Account for skipped steps
  if (maritalStatus === 'single') {
    effectiveTotalSteps -= 1; // Skip step 2
    if (currentStep >= 2) effectiveCurrentStep -= 1;
  }
  
  if (church === 'Đà Nẵng') {
    effectiveTotalSteps -= 1; // Skip step 3
    if (currentStep >= 3) effectiveCurrentStep -= 1;
  }
  
  const progress = Math.round((effectiveCurrentStep / effectiveTotalSteps) * 100);
  
  const handleReset = () => {
    methods.reset(DEFAULT_VALUES);
    setIsComplete(false);
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // Render current step component
  const renderCurrentStep = () => {
    if (isComplete) {
      return <SuccessStep formData={methods.getValues()} onReset={handleReset} />;
    }
    
    const StepComponent = steps[currentStep - 1]?.component;
    if (!StepComponent) return null;
    
    // Only pass onEditStep to ReviewStep
    if (currentStep === 7) {
      return <StepComponent formData={methods.getValues()} onEditStep={handleEditStep} />;
    }
    
    return <StepComponent formData={methods.getValues()} />;
  };
  
  return <FormProvider {...methods}>
      {isComplete ? renderCurrentStep() : <FormLayout title={steps[currentStep - 1]?.title} currentStep={currentStep} totalSteps={steps.length} progress={progress} onNext={handleNext} onBack={handleBack} onSaveDraft={saveFormData} onLoadDraft={() => setIsLoadDraftModalOpen(true)} isLastStep={currentStep === steps.length} maritalStatus={maritalStatus} church={church}>
          {renderCurrentStep()}
          {/* Notification */}
          {notification && (
            <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg border flex items-center min-w-[300px] max-w-md animate-fade-in ${
              notification.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          )}
        </FormLayout>}
      <SaveDraftModal isOpen={isSaveDraftModalOpen} onClose={() => setIsSaveDraftModalOpen(false)} />
      <LoadDraftModal isOpen={isLoadDraftModalOpen} onClose={() => setIsLoadDraftModalOpen(false)} onLoadDraft={handleLoadDraftFromServer} />
    </FormProvider>;
};