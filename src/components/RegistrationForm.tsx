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
    receiptImage: z.any().optional()
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
  component: Step4Package
}, {
  id: 4,
  title: t('navigation.step4'),
  component: Step3TravelSchedule
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
  const handleNext = async () => {
    const currentStepId = steps[currentStep - 1]?.id;
    // Validate the current step
    let isValid = false;
    switch (currentStepId) {
      case 1:
        isValid = await methods.trigger('personalInfo');
        break;
      case 2:
        isValid = await methods.trigger('familyParticipation');
        break;
      case 3:
        isValid = await methods.trigger('packageSelection');
        break;
      case 4:
        isValid = await methods.trigger('travelSchedule');
        break;
      case 5:
        isValid = await methods.trigger('payment');
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
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        // Handle form submission
        const formData = methods.getValues();
        console.log('Form submitted:', formData);
        // Clear saved draft
        localStorage.removeItem('churchRegistrationData');
        // Show success
        setIsComplete(true);
      }
    } else {
      // Show error notification
      setNotification({
        type: 'error',
        message: t('notifications.validationError')
      });
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  const CurrentStepComponent = isComplete ? SuccessStep : steps[currentStep - 1]?.component;
  const progress = Math.round(currentStep / steps.length * 100);
  return <FormProvider {...methods}>
      {isComplete ? <SuccessStep formData={methods.getValues()} /> : <FormLayout title={steps[currentStep - 1]?.title} currentStep={currentStep} totalSteps={steps.length} progress={progress} onNext={handleNext} onBack={handleBack} onSaveDraft={saveFormData} isLastStep={currentStep === steps.length}>
          {CurrentStepComponent && <CurrentStepComponent formData={methods.getValues()} />}
          {/* Notification */}
          {notification && <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-md flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <AlertCircleIcon className="w-5 h-5 mr-2" />}
              <span>{notification.message}</span>
            </div>}
        </FormLayout>}
      <SaveDraftModal isOpen={isSaveDraftModalOpen} onClose={() => setIsSaveDraftModalOpen(false)} />
    </FormProvider>;
};