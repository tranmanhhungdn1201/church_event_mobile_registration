import { useFormContext } from 'react-hook-form';
import { ChevronRightIcon, CalendarIcon, UserIcon, PackageIcon, CreditCardIcon, HomeIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface ReviewStepProps {
  formData?: any;
  onEditStep?: (stepNumber: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData: formDataProp, onEditStep }) => {
  const {
    getValues
  } = useFormContext();
  const { t } = useLanguage();
  const formData = formDataProp || getValues();
  // Format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return '₫0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  // Calculate total
  const calculatePackageTotal = () => {
    const packagePrices = {
      A: 500000,
      B: 800000,
      C: 1200000
    };
    
    let total = 0;
    
    // Main registrant package
    const mainPackage = formData.packageSelection?.mainPackage;
    if (mainPackage) {
      total += packagePrices[mainPackage as keyof typeof packagePrices] || 0;
    }
    
    // Spouse package
    const spousePackage = formData.packageSelection?.spousePackage;
    if (formData.familyParticipation?.attendingWithSpouse && spousePackage) {
      total += packagePrices[spousePackage as keyof typeof packagePrices] || 0;
    }
    
    // Children packages
    if (formData.packageSelection?.childrenPackages) {
      formData.packageSelection.childrenPackages.forEach((childPkg: any) => {
        total += packagePrices[childPkg.package as keyof typeof packagePrices] || 0;
      });
    }
    
    // T-shirts for main registrant
    if (formData.packageSelection?.mainWantsTShirt) {
      total += 100000;
    }
    
    // T-shirts for spouse
    if (formData.familyParticipation?.attendingWithSpouse && formData.familyParticipation?.spouseWantsTShirt) {
      total += 100000;
    }
    
    // T-shirts for children
    if (formData.familyParticipation?.children) {
      formData.familyParticipation.children.forEach((child: any) => {
        if (child.wantsTShirt) {
          total += 100000;
        }
      });
    }
    
    // Additional souvenir shirts
    const shirtTotal = (formData.packageSelection?.shirts || []).reduce((sum: number, shirt: any) => {
      return sum + shirt.quantity * 100000; // 100,000 VND per shirt
    }, 0);
    
    return total + shirtTotal;
  };
  const totalAmount = calculatePackageTotal();
  return <div className="space-y-6">
      <p className="text-gray-600">
        {t('review.description')}
      </p>
      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className='font-medium'>{t('review.personalInfo')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(1)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.fullName')}:</span>
            <span className="text-sm font-medium">
              {formData.personalInfo.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.gender')}:</span>
            <span className="text-sm font-medium capitalize">
              {formData.personalInfo.gender}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.phone')}:</span>
            <span className="text-sm font-medium">
              {formData.personalInfo.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.email')}:</span>
            <span className="text-sm font-medium">
              {formData.personalInfo.email}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.church')}:</span>
            <span className="text-sm font-medium">
              {formData.personalInfo.church}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.maritalStatus')}:</span>
            <span className="text-sm font-medium capitalize">
              {formData.personalInfo.maritalStatus}
            </span>
          </div>
        </div>
      </div>
      {/* Family Participation */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className="font-medium">{t('review.familyParticipation')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(2)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">
              {t('review.fields.attendingWithSpouse')}:
            </span>
            <span className="text-sm font-medium">
              {formData.familyParticipation.attendingWithSpouse ? t('common.yes') : t('common.no')}
            </span>
          </div>
          {formData.familyParticipation.attendingWithSpouse && <>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('review.fields.spouseName')}:</span>
                <span className="text-sm font-medium">
                  {formData.familyParticipation.spouseName || 'N/A'}
                </span>
              </div>
              {formData.familyParticipation.spousePhone && <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('review.fields.spousePhone')}:</span>
                  <span className="text-sm font-medium">
                    {formData.familyParticipation.spousePhone}
                  </span>
                </div>}
            </>}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.numberOfChildren')}:</span>
            <span className="text-sm font-medium">
              {formData.familyParticipation.numberOfChildren}
            </span>
          </div>
          {formData.familyParticipation.numberOfChildren > 0 && formData.familyParticipation.children && <div className="mt-2 space-y-2">
                <span className="text-sm text-gray-600">{t('review.fields.children')}:</span>
                {formData.familyParticipation.children.map((child: any, index: number) => <div key={index} className="bg-gray-50 p-2 rounded">
                    <span className="text-sm">
                      {child.name} ({t('review.fields.age')}: {child.age})
                    </span>
                  </div>)}
              </div>}
        </div>
      </div>
      {/* Travel Schedule */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className="font-medium">{t('review.travelSchedule')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(3)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.arrival')}:</span>
            <span className="text-sm font-medium">
              {formData.travelSchedule.arrivalDate ? format(new Date(formData.travelSchedule.arrivalDate), 'MMM d, yyyy h:mm a') : t('review.values.notSpecified')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.transport')}:</span>
            <span className="text-sm font-medium capitalize">
              {formData.travelSchedule.transport}
            </span>
          </div>
          {formData.travelSchedule.transport === 'plane' && formData.travelSchedule.flightCode && <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('review.fields.flightCode')}:</span>
                <span className="text-sm font-medium">
                  {formData.travelSchedule.flightCode}
                </span>
              </div>}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.returnDate')}:</span>
            <span className="text-sm font-medium">
              {formData.travelSchedule.returnDate ? format(new Date(formData.travelSchedule.returnDate), 'MMM d, yyyy') : t('review.values.notSpecified')}
            </span>
          </div>
        </div>
      </div>
      {/* Package & Souvenir */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <PackageIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className="font-medium">{t('review.packageSouvenir')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(4)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.selectedPackage')}:</span>
            <span className="text-sm font-medium">
              {t('review.values.package')} {formData.packageSelection?.mainPackage || 'N/A'}
            </span>
          </div>
          {/* Show spouse package if attending with spouse */}
          {formData.familyParticipation?.attendingWithSpouse && formData.packageSelection?.spousePackage && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('review.fields.spousePackage')}:</span>
              <span className="text-sm font-medium">
                {t('review.values.package')} {formData.packageSelection.spousePackage}
              </span>
            </div>
          )}
          {/* Show children packages if any */}
          {formData.packageSelection?.childrenPackages && formData.packageSelection.childrenPackages.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">{t('review.fields.childrenPackages')}:</span>
              {formData.packageSelection.childrenPackages.map((childPkg: any, index: number) => (
                <div key={index} className="flex justify-between pl-4">
                  <span className="text-sm text-gray-600">
                    {formData.familyParticipation?.children?.[childPkg.childIndex]?.name || `Child ${childPkg.childIndex + 1}`}:
                  </span>
                  <span className="text-sm font-medium">
                    {t('review.values.package')} {childPkg.package}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Show T-shirt selections */}
          {((formData.packageSelection?.mainWantsTShirt) || 
            (formData.familyParticipation?.attendingWithSpouse && formData.familyParticipation?.spouseWantsTShirt) ||
            (formData.familyParticipation?.children && formData.familyParticipation.children.some((c: any) => c.wantsTShirt)) ||
            (formData.packageSelection?.shirts && formData.packageSelection.shirts.length > 0)) && (
            <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
              <span className="text-sm text-gray-600">{t('review.fields.tShirts')}:</span>
              {formData.packageSelection?.mainWantsTShirt && (
                <div className="flex justify-between pl-4">
                  <span className="text-sm text-gray-600">Main ({formData.packageSelection?.mainTShirtSize}):</span>
                  <span className="text-sm font-medium">1 {t('review.values.pcs')}</span>
                </div>
              )}
              {formData.familyParticipation?.attendingWithSpouse && formData.familyParticipation?.spouseWantsTShirt && (
                <div className="flex justify-between pl-4">
                  <span className="text-sm text-gray-600">Spouse ({formData.familyParticipation?.spouseTShirtSize}):</span>
                  <span className="text-sm font-medium">1 {t('review.values.pcs')}</span>
                </div>
              )}
              {formData.familyParticipation?.children && formData.familyParticipation.children.map((child: any, index: number) => 
                child.wantsTShirt && (
                  <div key={index} className="flex justify-between pl-4">
                    <span className="text-sm text-gray-600">{child.name} ({child.tShirtSize}):</span>
                    <span className="text-sm font-medium">1 {t('review.values.pcs')}</span>
                  </div>
                )
              )}
              {formData.packageSelection?.shirts && formData.packageSelection.shirts.map((shirt: any, index: number) => 
                <div key={index} className="flex justify-between pl-4">
                  <span className="text-sm text-gray-600">{t('review.values.size')} {shirt.size}:</span>
                  <span className="text-sm font-medium">
                    {shirt.quantity} {t('review.values.pcs')}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-100 mt-4">
            <span className="text-sm font-medium">{t('review.totalAmount')}:</span>
            <span className="text-sm font-semibold text-[#2E5AAC]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
      {/* Payment */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className="font-medium">{t('review.payment')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(5)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.status')}:</span>
            <span className={`text-sm font-medium ${formData.payment.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
              {formData.payment.status === 'paid' ? t('review.values.paid') : t('review.values.willPayLater')}
            </span>
          </div>
          {formData.payment.status === 'paid' && formData.payment.transferDate && <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('review.fields.transferDate')}:</span>
                <span className="text-sm font-medium">
                  {format(new Date(formData.payment.transferDate), 'MMM d, yyyy')}
                </span>
              </div>}
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.receipt')}:</span>
            <span className="text-sm font-medium">
              {formData.payment.receiptImage ? t('review.values.uploaded') : t('review.values.notUploaded')}
            </span>
          </div>
        </div>
      </div>
      {/* Accommodation */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <HomeIcon className="h-5 w-5 text-[#2E5AAC] mr-2" />
            <h3 className="font-medium">{t('review.accommodationSponsorship')}</h3>
          </div>
          <button type="button" onClick={() => onEditStep?.(6)} className="text-[#2E5AAC] text-sm flex items-center">
            {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('review.fields.accommodation')}:</span>
            <span className="text-sm font-medium">
              {formData.accommodation.stayStatus === 'arranged' ? t('review.values.alreadyArranged') : t('review.values.notArranged')}
            </span>
          </div>
          {formData.accommodation.stayStatus === 'arranged' && formData.accommodation.accommodationInfo && <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('review.fields.details')}:</span>
                <span className="text-sm font-medium max-w-[60%] text-right">
                  {formData.accommodation.accommodationInfo}
                </span>
              </div>}
          {formData.accommodation.stayStatus === 'notArranged' && <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('review.fields.needAssistance')}:</span>
              <span className="text-sm font-medium">
                {formData.accommodation.needAssistance ? t('common.yes') : t('common.no')}
              </span>
            </div>}
          {formData.accommodation.sponsorshipAmount && formData.accommodation.sponsorshipAmount > 0 && <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('review.fields.sponsorship')}:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(formData.accommodation.sponsorshipAmount)}
              </span>
            </div>}
        </div>
      </div>
    </div>;
};