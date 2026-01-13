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
  return (
    <div className="space-y-6 animate-fade-in-up">
      <p className="text-slate-600 leading-relaxed">
        {t('review.description')}
      </p>
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className='font-semibold text-slate-800'>{t('review.personalInfo')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(1)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.fullName')}</span>
              <span className="text-sm font-medium text-slate-900">{formData.personalInfo.fullName}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.gender')}</span>
              <span className="text-sm font-medium text-slate-900 capitalize">{formData.personalInfo.gender}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.phone')}</span>
              <span className="text-sm font-medium text-slate-900">{formData.personalInfo.phoneNumber}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.email')}</span>
              <span className="text-sm font-medium text-slate-900">{formData.personalInfo.email}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.church')}</span>
              <span className="text-sm font-medium text-slate-900">{formData.personalInfo.church}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.maritalStatus')}</span>
              <span className="text-sm font-medium text-slate-900 capitalize">{formData.personalInfo.maritalStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Family Participation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className="font-semibold text-slate-800">{t('review.familyParticipation')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(2)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                {t('review.fields.attendingWithSpouse')}
              </span>
              <span className="text-sm font-medium text-slate-900">
                {formData.familyParticipation.attendingWithSpouse ? t('common.yes') : t('common.no')}
              </span>
            </div>
            
            {formData.familyParticipation.attendingWithSpouse && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.spouseName')}</span>
                  <span className="text-sm font-medium text-slate-900">{formData.familyParticipation.spouseName || 'N/A'}</span>
                </div>
                {formData.familyParticipation.spousePhone && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.spousePhone')}</span>
                    <span className="text-sm font-medium text-slate-900">{formData.familyParticipation.spousePhone}</span>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.numberOfChildren')}</span>
              <span className="text-sm font-medium text-slate-900">
                {formData.familyParticipation.numberOfChildren}
              </span>
            </div>
            
            {formData.familyParticipation.numberOfChildren > 0 && formData.familyParticipation.children && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('review.fields.children')}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.familyParticipation.children.map((child: any, index: number) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-sm font-medium text-slate-900 block">
                        {child.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t('review.fields.age')}: {child.age}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel Schedule */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className="font-semibold text-slate-800">{t('review.travelSchedule')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(3)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.transport')}</span>
              <span className="text-sm font-medium text-slate-900 capitalize block">
                {formData.travelSchedule.transport ? t(`step3.transportOptions.${formData.travelSchedule.transport}`) : t('review.values.notSpecified')}
              </span>
            </div>
            
            {formData.travelSchedule.transport === 'plane' && formData.travelSchedule.flightCode && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.flightCode')}</span>
                <span className="text-sm font-medium text-slate-900">{formData.travelSchedule.flightCode}</span>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.arrival')}</span>
              <span className="text-sm font-medium text-slate-900">
                {formData.travelSchedule.arrivalDate ? format(new Date(formData.travelSchedule.arrivalDate), 'MMM d, yyyy h:mm a') : t('review.values.notSpecified')}
              </span>
            </div>
            
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.returnDate')}</span>
              <span className="text-sm font-medium text-slate-900">
                {formData.travelSchedule.returnDate ? format(new Date(formData.travelSchedule.returnDate), 'MMM d, yyyy') : t('review.values.notSpecified')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Package & Souvenir */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <PackageIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className="font-semibold text-slate-800">{t('review.packageSouvenir')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(4)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-4">
             <div className="flex justify-between items-center pb-3 border-b border-slate-50">
               <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.selectedPackage')}</span>
                  <span className="text-sm font-medium text-slate-900">{t('review.values.package')} {formData.packageSelection?.mainPackage || 'N/A'}</span>
               </div>
             </div>

            {/* Show spouse package if attending with spouse */}
            {formData.familyParticipation?.attendingWithSpouse && formData.packageSelection?.spousePackage && (
               <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <div>
                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.spousePackage')}</span>
                   <span className="text-sm font-medium text-slate-900">{t('review.values.package')} {formData.packageSelection.spousePackage}</span>
                </div>
              </div>
            )}

            {/* Show children packages if any */}
            {formData.packageSelection?.childrenPackages && formData.packageSelection.childrenPackages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('review.fields.childrenPackages')}</span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {formData.packageSelection.childrenPackages.map((childPkg: any, index: number) => (
                    <div key={index} className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                      <span className="text-sm text-slate-600">
                        {formData.familyParticipation?.children?.[childPkg.childIndex]?.name || `Child ${childPkg.childIndex + 1}`}:
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {t('review.values.package')} {childPkg.package}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show T-shirt selections */}
            {((formData.packageSelection?.mainWantsTShirt) || 
              (formData.familyParticipation?.attendingWithSpouse && formData.familyParticipation?.spouseWantsTShirt) ||
              (formData.familyParticipation?.children && formData.familyParticipation.children.some((c: any) => c.wantsTShirt)) ||
              (formData.packageSelection?.shirts && formData.packageSelection.shirts.length > 0)) && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('review.fields.souvenirShirts')}</span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {formData.packageSelection?.mainWantsTShirt && (
                    <div className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                      <span className="text-sm text-slate-600">Main ({formData.packageSelection?.mainTShirtSize}):</span>
                      <span className="text-sm font-medium text-slate-900">1 {t('review.values.pcs')}</span>
                    </div>
                  )}
                  {formData.familyParticipation?.attendingWithSpouse && formData.familyParticipation?.spouseWantsTShirt && (
                    <div className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                      <span className="text-sm text-slate-600">Spouse ({formData.familyParticipation?.spouseTShirtSize}):</span>
                      <span className="text-sm font-medium text-slate-900">1 {t('review.values.pcs')}</span>
                    </div>
                  )}
                  {formData.familyParticipation?.children && formData.familyParticipation.children.map((child: any, index: number) => 
                    child.wantsTShirt && (
                      <div key={index} className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                        <span className="text-sm text-slate-600">{child.name} ({child.tShirtSize}):</span>
                        <span className="text-sm font-medium text-slate-900">1 {t('review.values.pcs')}</span>
                      </div>
                    )
                  )}
                  {formData.packageSelection?.shirts && formData.packageSelection.shirts.map((shirt: any, index: number) => 
                    <div key={index} className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                      <span className="text-sm text-slate-600">{t('review.values.size')} {shirt.size}:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {shirt.quantity} {t('review.values.pcs')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4 border-t border-slate-200 mt-2">
              <span className="text-base font-semibold text-slate-700">{t('review.totalAmount')}:</span>
              <span className="text-lg font-bold text-[#2E5AAC]">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className="font-semibold text-slate-800">{t('review.payment')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(5)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.status')}</span>
               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                {formData.payment.status === 'paid' ? t('review.values.paid') : t('review.values.willPayLater')}
              </span>
            </div>
            
            {formData.payment.status === 'paid' && formData.payment.transferDate && (
              <div>
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.transferDate')}</span>
                 <span className="text-sm font-medium text-slate-900">
                  {format(new Date(formData.payment.transferDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            <div>
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.receipt')}</span>
               <span className="text-sm font-medium text-slate-900">
                {formData.payment.receiptImage ? t('review.values.uploaded') : t('review.values.notUploaded')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accommodation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center">
            <HomeIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
            <h3 className="font-semibold text-slate-800">{t('review.accommodationSponsorship')}</h3>
          </div>
          {onEditStep && (
            <button 
              type="button" 
              onClick={() => onEditStep(6)} 
              className="text-[#2E5AAC] text-sm font-medium flex items-center hover:text-[#1e3a8a] transition-colors"
            >
              {t('common.edit')} <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.accommodation')}</span>
              <span className="text-sm font-medium text-slate-900">
                {formData.accommodation.stayStatus === 'arranged' ? t('review.values.alreadyArranged') : t('review.values.notArranged')}
              </span>
            </div>
            
            {formData.accommodation.stayStatus === 'arranged' && formData.accommodation.accommodationInfo && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.details')}</span>
                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {formData.accommodation.accommodationInfo}
                </p>
              </div>
            )}
            
            {formData.accommodation.stayStatus === 'notArranged' && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.needAssistance')}</span>
                <span className="text-sm font-medium text-slate-900">
                  {formData.accommodation.needAssistance ? t('common.yes') : t('common.no')}
                </span>
              </div>
            )}
            
            {formData.accommodation.sponsorshipAmount && formData.accommodation.sponsorshipAmount > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.sponsorship')}</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(formData.accommodation.sponsorshipAmount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};