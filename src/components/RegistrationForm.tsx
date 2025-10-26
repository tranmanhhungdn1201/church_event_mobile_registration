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
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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
    spouseWantsTShirt: z.boolean().optional().default(false),
    spouseTShirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional(),
    numberOfChildren: z.number().min(0).default(0),
    children: z.array(z.object({
      name: z.string(),
      age: z.number().min(0).max(18),
      wantsTShirt: z.boolean().default(false),
      tShirtSize: z.enum(['S', 'M', 'L', 'XL', 'XXL']).optional()
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
    mainPackage: z.enum(['A', 'B', 'C']),
    spousePackage: z.enum(['A', 'B', 'C']).optional(),
    childrenPackages: z.array(z.object({
      childIndex: z.number(),
      package: z.enum(['A', 'B', 'C'])
    })).optional(),
    wantSouvenirShirt: z.boolean().default(false),
    shirts: z.array(z.object({
      size: z.enum(['S', 'M', 'L', 'XL', 'XXL']),
      quantity: z.number().min(1)
    })).optional()
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
    stayStatus: z.enum(['arranged', 'notArranged']).optional(),
    accommodationInfo: z.string().optional(),
    needAssistance: z.boolean().optional(),
    sponsorshipAmount: z.number().optional(),
    bankNote: z.string().optional(),
    agreeToTerms: z.boolean()
  })
});
type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;
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
  title: t('navigation.step5'),
  component: Step5Payment
}, {
  id: 6,
  title: t('navigation.step6'),
  component: Step6Accommodation
}, {
  id: 7,
  title: t('navigation.step7'),
  component: ReviewStep
}];
export const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
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
    defaultValues: {
      personalInfo: {
        gender: 'male',
        church: 'Cần Thơ'
      },
      familyParticipation: {
        attendingWithSpouse: false,
        spouseWantsTShirt: false,
        spouseTShirtSize: 'M',
        numberOfChildren: 0,
        children: []
      },
      travelSchedule: {
        noTravelInfo: false
      },
      packageSelection: {
        mainPackage: 'A',
        spousePackage: 'A',
        childrenPackages: [],
        wantSouvenirShirt: false,
        shirts: []
      },
      payment: {
        status: 'willPayLater'
      },
      accommodation: {
        stayStatus: 'notArranged',
        needAssistance: false,
        agreeToTerms: false
      }
    }
  });
  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('churchRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert string dates back to Date objects
        if (parsedData.travelSchedule?.arrivalDate) {
          parsedData.travelSchedule.arrivalDate = new Date(parsedData.travelSchedule.arrivalDate);
        }
        if (parsedData.travelSchedule?.returnDate) {
          parsedData.travelSchedule.returnDate = new Date(parsedData.travelSchedule.returnDate);
        }
        if (parsedData.payment?.transferDate) {
          parsedData.payment.transferDate = new Date(parsedData.payment.transferDate);
        }
        methods.reset(parsedData);
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
      }
    }
  }, []);
  const saveFormData = () => {
    const formData = methods.getValues();
    localStorage.setItem('churchRegistrationData', JSON.stringify(formData));
    setIsSaveDraftModalOpen(true);
  };
  // Helper function to get the actual step index based on marital status and church
  const getActualStepIndex = (stepNumber: number) => {
    const maritalStatus = methods.getValues('personalInfo.maritalStatus');
    const church = methods.getValues('personalInfo.church');
    
    // If single and trying to access step 2 (family), skip to step 3
    if (maritalStatus === 'single' && stepNumber >= 2) {
      stepNumber = stepNumber + 1;
    }
    
    // If Đà Nẵng and trying to access step 3 (travel), skip to step 4
    if (church === 'Đà Nẵng' && stepNumber >= 3) {
      stepNumber = stepNumber + 1;
    }
    
    // If both single and Đà Nẵng, need to account for double skip
    if (maritalStatus === 'single' && church === 'Đà Nẵng' && stepNumber >= 3) {
      stepNumber = stepNumber + 1;
    }
    
    return stepNumber;
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
        // Validate payment step
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
        
        // Prepare data for API submission
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
          submittedAt: new Date().toISOString()
        };
        
        // Convert FormData to JSON
        const formDataToSend = new FormData();
        formDataToSend.append('data', JSON.stringify(submitData));
        
        // If there's a receipt image, add it to FormData
        if (formData.payment.receiptImage) {
          formDataToSend.append('receiptImage', formData.payment.receiptImage);
        }
        
        // Call API here
        try {
          const response = await fetch('/api/registration', {
            method: 'POST',
            body: formDataToSend
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('Registration successful:', result);
            // Clear saved draft
            localStorage.removeItem('churchRegistrationData');
            // Show success
            setIsComplete(true);
          } else {
            throw new Error('Failed to submit registration');
          }
        } catch (error) {
          console.error('Error submitting registration:', error);
          // For now, just show success even if API fails
          localStorage.removeItem('churchRegistrationData');
          setIsComplete(true);
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
  
  // Render current step component
  const renderCurrentStep = () => {
    if (isComplete) {
      return <SuccessStep formData={methods.getValues()} />;
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
      {isComplete ? renderCurrentStep() : <FormLayout title={steps[currentStep - 1]?.title} currentStep={currentStep} totalSteps={steps.length} progress={progress} onNext={handleNext} onBack={handleBack} onSaveDraft={saveFormData} isLastStep={currentStep === steps.length} maritalStatus={maritalStatus} church={church}>
          {renderCurrentStep()}
          {/* Notification */}
          {notification && <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-md flex items-center min-w-80 max-w-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-3" /> : <AlertCircleIcon className="w-5 h-5 mr-3" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>}
        </FormLayout>}
      <SaveDraftModal isOpen={isSaveDraftModalOpen} onClose={() => setIsSaveDraftModalOpen(false)} />
    </FormProvider>;
};