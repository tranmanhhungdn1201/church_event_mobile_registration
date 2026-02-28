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
  const { t, language: lang } = useLanguage();
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
    const packagePrices: Record<string, number> = {
      ADULT_A: 2000000,
      ADULT_B: 1700000,
      ADULT_C: 1000000,
      ADULT_D: 600000
    };
    const childPackagePrices: Record<string, number> = {
      CHILD_A: 700000,
      CHILD_B: 400000,
      CHILD_C: 200000
    };
    
    let total = 0;
    
    // Adult packages
    if (formData.packageSelection?.adultPackages) {
      formData.packageSelection.adultPackages.forEach((pkg: any) => {
        total += pkg.quantity * (packagePrices[pkg.id] || 0);
      });
    }

    // Child packages
    if (formData.packageSelection?.childPackages) {
       formData.packageSelection.childPackages.forEach((pkg: any) => {
        total += pkg.quantity * (childPackagePrices[pkg.id] || 0);
      });
    }

    // Shirts
    const shirtTotal = (formData.packageSelection?.shirts || []).reduce((sum: number, shirt: any) => {
      return sum + shirt.quantity * 160000; // 160,000 VND per shirt
    }, 0);
    
    // Magazine
    const magazineQuantity = formData.packageSelection?.magazineQuantity || 0;
    if (magazineQuantity > 0) {
        total += Number(magazineQuantity) * 180000;
    }
    
    return total + shirtTotal;
  };
  
  const packageTotal = calculatePackageTotal();
  const sponsorshipAmount = formData.accommodation?.sponsorshipAmount || 0;
  const totalAmount = packageTotal + sponsorshipAmount;
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
              <span className="text-sm font-medium text-slate-900 capitalize">{formData.personalInfo.gender === 'male' ? t('common.male') : t('common.female')}</span>
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
              <span className="text-sm font-medium text-slate-900 capitalize">{formData.personalInfo.maritalStatus === 'single' ? t('step1.maritalStatusOptions.single') : t('step1.maritalStatusOptions.married')}</span>
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
            
            {formData.familyParticipation.numberOfChildren > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('review.fields.children')}</span>
                {formData.familyParticipation.counts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {formData.familyParticipation.counts.above11 > 0 && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{t('step2.ageGroups.above11')}</span>
                        <span className="min-w-[2rem] text-center px-2 py-1 bg-white rounded-md text-sm font-semibold text-[#2E5AAC] shadow-sm border border-slate-200">{formData.familyParticipation.counts.above11}</span>
                      </div>
                    )}
                    {formData.familyParticipation.counts.between6And11 > 0 && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{t('step2.ageGroups.between6And11')}</span>
                        <span className="min-w-[2rem] text-center px-2 py-1 bg-white rounded-md text-sm font-semibold text-[#2E5AAC] shadow-sm border border-slate-200">{formData.familyParticipation.counts.between6And11}</span>
                      </div>
                    )}
                    {formData.familyParticipation.counts.under6 > 0 && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{t('step2.ageGroups.under6')}</span>
                        <span className="min-w-[2rem] text-center px-2 py-1 bg-white rounded-md text-sm font-semibold text-[#2E5AAC] shadow-sm border border-slate-200">{formData.familyParticipation.counts.under6}</span>
                      </div>
                    )}
                  </div>
                ) : formData.familyParticipation.children && (
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
                )}
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
             <div className="pb-3 border-b border-slate-50">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">{t('step4.adultPackages')}</span>
               <div className="space-y-2">
                 {formData.packageSelection?.adultPackages?.map((pkg: any) => {
                    if (pkg.quantity > 0) {
                        return (
                             <div key={pkg.id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-700">
                                    {t(`step4.package${pkg.id.replace('ADULT_', '')}.title`)}
                                </span>
                                <span className="font-medium text-slate-900">x{pkg.quantity}</span>
                            </div>
                        )
                    }
                    return null;
                 })}
                  {(!formData.packageSelection?.adultPackages || formData.packageSelection.adultPackages.every((p:any) => p.quantity === 0)) && (
                      <span className="text-sm text-slate-400 italic">{lang === 'vi' ? "Chưa chọn" : "None selected"}</span>
                  )}
               </div>
             </div>

            {/* Show child packages */}
            <div className="pb-3 border-b border-slate-50">
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">{t('step4.childPackages')}</span>
                 <div className="space-y-2">
                 {formData.packageSelection?.childPackages?.map((pkg: any) => {
                    if (pkg.quantity > 0) {
                        return (
                             <div key={pkg.id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-700">
                                    {t(`step4.childPackage${pkg.id.replace('CHILD_', '')}.title`)}
                                </span>
                                <span className="font-medium text-slate-900">x{pkg.quantity}</span>
                            </div>
                        )
                    }
                     return null;
                 })}
                  {(!formData.packageSelection?.childPackages || formData.packageSelection.childPackages.every((p:any) => p.quantity === 0)) && (
                      <span className="text-sm text-slate-400 italic">{lang === 'vi' ? "Chưa chọn" : "None selected"}</span>
                  )}
               </div>
            </div>

            {/* Show T-shirt selections */}
            {(formData.packageSelection?.shirts && formData.packageSelection.shirts.length > 0) && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('review.fields.souvenirShirts')}</span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {formData.packageSelection.shirts.map((shirt: any, index: number) => 
                    <div key={index} className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                      <span className="text-sm text-slate-600">
                        {shirt.gender === 'female' ? '👗 Nữ' : '👔 Nam'} — Size {shirt.size}:
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {shirt.quantity} {t('review.values.pcs')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Show Magazine selections */}
            {(formData.packageSelection?.magazineQuantity && formData.packageSelection.magazineQuantity > 0) && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{t('step4.magazine')}</span>
                <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between pb-2">
                      <span className="text-sm text-slate-600">{t('step4.registerMagazine')}:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {formData.packageSelection.magazineQuantity} {t('review.values.pcsMagazine')}
                      </span>
                    </div>
                </div>
              </div>
            )}
            
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
          
          <div className="flex justify-between pt-4 border-t border-slate-200 mt-2">
            <span className="text-sm font-medium text-slate-600">{t('review.packageCost')}:</span>
            <span className="text-base font-semibold text-slate-800">
              {formatCurrency(packageTotal)}
            </span>
          </div>

          {sponsorshipAmount > 0 && (
            <div className="flex justify-between pt-2">
              <span className="text-sm font-medium text-slate-600">{t('review.fields.sponsorship')}:</span>
              <span className="text-base font-semibold text-slate-800">
                {formatCurrency(sponsorshipAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200 mt-2">
            <span className="text-base font-bold text-slate-800">{t('review.totalAmount')}:</span>
            <span className="text-xl font-bold text-[#2E5AAC]">
              {formatCurrency(totalAmount)}
            </span>
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
            {formData.accommodation.assistanceDetails && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('review.fields.needAssistance')}</span>
                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100 break-words">
                  {formData.accommodation.assistanceDetails}
                </p>
              </div>
            )}

            {formData.accommodation.participateBigGame && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('step6.bigGame')}</span>
                <span className="text-sm font-medium text-slate-900">
                   {t(`step6.participationOptions.${formData.accommodation.participateBigGame}`)}
                </span>
              </div>
            )}
            
            {formData.accommodation.participateSports && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('step6.sports')}</span>
                <span className="text-sm font-medium text-slate-900">
                   {t(`step6.participationOptions.${formData.accommodation.participateSports}`)}
                </span>
              </div>
            )}
            
            {formData.accommodation.participateVolleyball && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{t('step6.volleyball')}</span>
                <span className="text-sm font-medium text-slate-900">
                   {t(`step6.participationOptions.${formData.accommodation.participateVolleyball}`)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};