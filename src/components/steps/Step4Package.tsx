import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, MinusIcon, ShirtIcon, UserIcon, InfoIcon, AlertTriangleIcon, HelpCircleIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';
import { SizeChartModal } from '../SizeChartModal';

const SHIRT_PRICE = 160000;
const MAGAZINE_PRICE = 180000;

export const Step4Package = () => {
  const {
    control,
    register,
    watch,
    setValue,
    getValues
  } = useFormContext();
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('M');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  
  const packageOptions = [
    {
      id: 'ADULT_A',
      name: t('step4.packageA.title'),
      price: 2000000,
      description: t('step4.packageA.description')
    },
    {
      id: 'ADULT_B', 
      name: t('step4.packageB.title'),
      price: 1700000,
      description: t('step4.packageB.description')
    },
    {
      id: 'ADULT_C',
      name: t('step4.packageC.title'),
      price: 1000000,
      description: t('step4.packageC.description')
    },
    {
      id: 'ADULT_D',
      name: t('step4.packageD.title'),
      price: 600000,
      description: t('step4.packageD.description')
    }
  ];

  const childPackageOptions = [
    {
      id: 'CHILD_A',
      name: t('step4.childPackageA.title'),
      price: 700000,
      description: t('step4.childPackageA.description')
    },
    {
      id: 'CHILD_B', 
      name: t('step4.childPackageB.title'),
      price: 400000,
      description: t('step4.childPackageB.description')
    },
    {
      id: 'CHILD_C',
      name: t('step4.childPackageC.title'),
      price: 200000,
      description: t('step4.childPackageC.description')
    }
  ];
  
  const shirtSizes = [
    { value: 'S', label: t('step4.shirtSizes.S') },
    { value: 'M', label: t('step4.shirtSizes.M') },
    { value: 'L', label: t('step4.shirtSizes.L') },
    { value: 'XL', label: t('step4.shirtSizes.XL') },
    { value: '2XL', label: t('step4.shirtSizes.2XL') },
    { value: '3XL', label: t('step4.shirtSizes.3XL') },
    { value: '4XL', label: t('step4.shirtSizes.4XL') }
  ];

  const shirts = watch('packageSelection.shirts') || [];
  const wantMagazine = watch('packageSelection.wantMagazine');
  const magazineQuantity = watch('packageSelection.magazineQuantity') || 1;
  
  const adultPackages = watch('packageSelection.adultPackages') || [];
  const childPackages = watch('packageSelection.childPackages') || [];

  // Get participant counts for validation
  const attendingWithSpouse = watch('familyParticipation.attendingWithSpouse');
  // const numberOfChildren = watch('familyParticipation.numberOfChildren') || 0; // Deprecated for validation
  const counts = watch('familyParticipation.counts') || {};
  
  // Adults = Self + Spouse (if any) + Children > 11
  const expectedAdults = 1 + (attendingWithSpouse ? 1 : 0) + (counts.above11 || 0);
  // Children = Children 6-11
  const expectedChildren = counts.between6And11 || 0;

  const {
    fields,
    append,
    update,
    remove
  } = useFieldArray({
    control,
    name: 'packageSelection.shirts'
  });

  const {
    fields: adultFields,
    append: appendAdultPkg,
    remove: removeAdultPkg,
    update: updateAdultPkg
  } = useFieldArray({
    control,
    name: 'packageSelection.adultPackages'
  });

  const {
    fields: childFields,
    append: appendChildPkg,
    remove: removeChildPkg,
    update: updateChildPkg
  } = useFieldArray({
    control,
    name: 'packageSelection.childPackages'
  });


  // Initialize package quantities if empty
  useEffect(() => {
    // Only initialize if the array is completely empty to avoid overwriting existing data
    // Use getValues to check current state without dependency loop
    const currentAdults = getValues('packageSelection.adultPackages');
    if (!currentAdults || currentAdults.length === 0) {
      packageOptions.forEach(pkg => {
        appendAdultPkg({ id: pkg.id, quantity: 0 });
      });
    }

    const currentChildren = getValues('packageSelection.childPackages');
    if (!currentChildren || currentChildren.length === 0) {
      childPackageOptions.forEach(pkg => {
        appendChildPkg({ id: pkg.id, quantity: 0 });
      });
    }
  }, []); // Run once on mount

  // Calculate subtotal
  const calculateTotal = () => {
    let total = 0;
    
    // Adult packages
    adultPackages.forEach((pkg: any) => {
      const option = packageOptions.find(p => p.id === pkg.id);
      if (option) {
        total += pkg.quantity * option.price;
      }
    });

    // Child packages
    childPackages.forEach((pkg: any) => {
      const option = childPackageOptions.find(p => p.id === pkg.id);
      if (option) {
        total += pkg.quantity * option.price;
      }
    });
    
    // Additional shirts
    const shirtTotal = shirts.reduce((sum: number, shirt: any) => {
      return sum + shirt.quantity * SHIRT_PRICE;
    }, 0);
    
    // Magazine
    if (magazineQuantity > 0) {
      total += magazineQuantity * MAGAZINE_PRICE;
    }

    return total + shirtTotal;
  };

  const subtotal = calculateTotal();

  // Validate quantities
  const totalAdultPackages = adultPackages.reduce((sum: number, pkg: any) => sum + (pkg.quantity || 0), 0);
  const totalChildPackages = childPackages.reduce((sum: number, pkg: any) => sum + (pkg.quantity || 0), 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddShirt = () => {
    // Check if shirt size already exists
    const existingIndex = shirts.findIndex((s: any) => s.size === selectedSize);
    
    if (existingIndex >= 0) {
      // Update existing
      update(existingIndex, {
        ...shirts[existingIndex],
        quantity: shirts[existingIndex].quantity + 1
      });
    } else {
      // Add new
      append({
        size: selectedSize,
        quantity: 1
      });
    }
  };

  const updatePackageQuantity = (type: 'adult' | 'child', index: number, delta: number) => {
    if (type === 'adult') {
      const currentPkg = adultPackages[index];
      const newQuantity = Math.max(0, (currentPkg?.quantity || 0) + delta);
      updateAdultPkg(index, { ...currentPkg, quantity: newQuantity });
    } else {
      const currentPkg = childPackages[index];
      const newQuantity = Math.max(0, (currentPkg?.quantity || 0) + delta);
      updateChildPkg(index, { ...currentPkg, quantity: newQuantity });
    }
  };

  // Helper to render description as list
  const renderDescription = (desc: string) => {
    if (!desc) return null;
    const items = desc.split(',').map(item => item.trim());
    
    return (
      <ul className="mt-2 space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-slate-600 flex items-start">
            <span className="mr-2 text-slate-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={formStyles.section}>
      {/* Adult Packages */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step4.adultPackages')}
        </h3>
        
        {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">
              {t('step4.participantInfo')} {expectedAdults}
            </p>
            <p className="text-blue-600/80">
              {t('step4.participantInstruction')}
            </p>
          </div>
        </div>

        {/* Warning if count exceeds */}
        {totalAdultPackages > expectedAdults && (
           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 animate-fade-in">
             <AlertTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
             <div className="text-sm text-amber-700">
               <p className="font-semibold">
                  {t('step4.warning.adultCountMismatch', { selected: totalAdultPackages, expected: expectedAdults })}
               </p>
             </div>
           </div>
        )}

        <div className="space-y-4">
          {packageOptions.map((pkg, idx) => {
             // Find the corresponding form field index based on ID to ensure correct binding
             const fieldIndex = adultFields.findIndex((f: any) => f.id === pkg.id);
             // If not found yet (initial render might be racing), fallback to idx assuming order is preserved
             const indexToUse = fieldIndex >= 0 ? fieldIndex : idx;
             const currentQty = adultPackages[indexToUse]?.quantity || 0;

             return (
            <div key={pkg.id} className={`p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${currentQty > 0 ? 'border-[#2E5AAC] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className="text-lg font-semibold text-slate-800">{pkg.name}</h4>
                     <p className="text-lg font-bold text-[#2E5AAC] sm:hidden">
                        {formatCurrency(pkg.price)}
                     </p>
                  </div>
                  {renderDescription(pkg.description)}
                  <p className="text-xl font-bold text-[#2E5AAC] mt-3 hidden sm:block">
                    {formatCurrency(pkg.price)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-none">
                    <span className="text-slate-600 font-medium sm:hidden">{t('step4.quantity') || 'Số lượng'}</span>
                    <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button 
                          type="button" 
                          onClick={() => updatePackageQuantity('adult', indexToUse, -1)}
                          className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all disabled:opacity-50"
                          disabled={currentQty <= 0}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <input 
                            type="number"
                            className="w-10 text-center font-bold text-lg text-slate-800 bg-transparent border-none focus:ring-0 p-0"
                            value={currentQty}
                            readOnly
                        />
                        <button 
                          type="button" 
                          onClick={() => updatePackageQuantity('adult', indexToUse, 1)}
                          className="w-8 h-8 rounded-md bg-[#2E5AAC] text-white hover:bg-[#254a8f] flex items-center justify-center transition-all shadow-sm"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          )})}
        </div>
        
        {/* Contact Note */}
         <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-800 flex items-start">
             <InfoIcon className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
             <p>{t('step4.contactBTC')}</p>
        </div>
      </div>

      {/* Child Packages */}
      {expectedChildren > 0 && (
      <div className="space-y-6 border-t border-slate-200 pt-8 mt-8">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step4.childPackages')}
        </h3>

         {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
          <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
             <p className="font-semibold mb-1">
              {t('step4.childParticipantInfo')} {expectedChildren}
            </p>
            <p className="text-blue-600/80">
              {t('step4.childParticipantInstruction')}
            </p>
          </div>
        </div>

         {/* Warning if count exceeds */}
        {totalChildPackages > expectedChildren && (
           <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 animate-fade-in">
             <AlertTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
             <div className="text-sm text-amber-700">
               <p className="font-semibold">
                  {t('step4.warning.childCountMismatch', { selected: totalChildPackages, expected: expectedChildren })}
               </p>
             </div>
           </div>
        )}

        <div className="space-y-4">
          {childPackageOptions.map((pkg, idx) => {
              const fieldIndex = childFields.findIndex((f: any) => f.id === pkg.id);
              const indexToUse = fieldIndex >= 0 ? fieldIndex : idx;
              const currentQty = childPackages[indexToUse]?.quantity || 0;

             return (
            <div key={pkg.id} className={`p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${currentQty > 0 ? 'border-[#2E5AAC] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                     <h4 className="text-lg font-semibold text-slate-800">{pkg.name}</h4>
                     <p className="text-lg font-bold text-[#2E5AAC] sm:hidden">
                        {formatCurrency(pkg.price)}
                     </p>
                  </div>
                  {renderDescription(pkg.description)}
                   <p className="text-xl font-bold text-[#2E5AAC] mt-3 hidden sm:block">
                    {formatCurrency(pkg.price)}
                  </p>
                </div>
                 <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-none">
                     <span className="text-slate-600 font-medium sm:hidden">{t('step4.quantity') || 'Số lượng'}</span>
                     <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button 
                          type="button" 
                          onClick={() => updatePackageQuantity('child', indexToUse, -1)}
                          className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all disabled:opacity-50"
                          disabled={currentQty <= 0}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-slate-800">{currentQty}</span>
                        <button 
                          type="button" 
                          onClick={() => updatePackageQuantity('child', indexToUse, 1)}
                          className="w-8 h-8 rounded-md bg-[#2E5AAC] text-white hover:bg-[#254a8f] flex items-center justify-center transition-all shadow-sm"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
      )}

      
      {/* Merchandise Section (Shirts & Magazines) */}
      <div className="border-t border-slate-200 pt-8 mt-8 space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <ShirtIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step4.souvenirShirt')} & {t('step4.magazine')}
        </h3>

        {/* Shirts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
           <div className="flex items-center justify-between mb-2">
                <label className="text-base font-semibold text-slate-700">
                  {t('step4.buyTShirt')} <span className="text-[#2E5AAC] ml-1">({formatCurrency(SHIRT_PRICE)})</span>
                </label>
           </div>
           
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <div className="flex flex-row items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <label className="text-sm font-medium text-slate-700 leading-none whitespace-nowrap">
                        {t('step4.selectSize')}:
                      </label>
                      <button 
                        type="button"
                        onClick={() => setIsSizeChartOpen(true)}
                        className="text-xs text-[#2E5AAC] hover:text-[#1a3a78] font-medium flex items-center whitespace-nowrap leading-none"
                      >
                        <HelpCircleIcon className="w-3.5 h-3.5 mr-1" />
                        {t('step4.viewSizeChart') || 'Xem bảng size'}
                      </button>
                    </div>
                    <div className="relative">
                      <select 
                        value={selectedSize} 
                        onChange={e => setSelectedSize(e.target.value)} 
                        className={`${formStyles.input} py-2`}
                      >
                        {shirtSizes.map(size => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button 
                      type="button" 
                      onClick={handleAddShirt} 
                      className={`${formStyles.buttonPrimary} h-[42px] px-4 flex items-center whitespace-nowrap`}
                    >
                      <PlusIcon className="h-5 w-5 sm:mr-2" /> 
                      <span className="hidden sm:inline">{t('common.add')}</span>
                      <span className="sm:hidden">Thêm</span>
                    </button>
                  </div>
                </div>
            </div>

            {/* Added shirts list */}
            {fields.length > 0 && (
            <div className="space-y-3 mt-4">
                <h4 className="text-sm font-semibold text-slate-600 mb-3">
                {t('step4.addedShirts')}
                </h4>
                {fields.map((field: any, index: number) => (
                <div key={field.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: Icon + Info */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-blue-50 rounded-lg p-2 sm:p-3 flex-shrink-0">
                                <ShirtIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#2E5AAC]" />
                            </div>
                            <div className="min-w-0">
                                 <p className="font-bold text-slate-800 text-sm sm:text-base">Size: {field.size}</p>
                                 <p className="text-sm font-bold text-[#2E5AAC] sm:hidden">
                                    {formatCurrency(field.quantity * SHIRT_PRICE)}
                                 </p>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-2 sm:gap-4">
                             {/* Price Desktop */}
                            <div className="hidden sm:block text-right min-w-[6rem]">
                                <span className="text-lg font-bold text-[#2E5AAC] whitespace-nowrap">
                                    {formatCurrency(field.quantity * SHIRT_PRICE)}
                                </span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 sm:gap-2 border border-slate-200 rounded-lg p-1">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const currentQty = shirts[index].quantity;
                                        if (currentQty > 1) {
                                            update(index, { ...shirts[index], quantity: currentQty - 1 });
                                        } else {
                                            remove(index);
                                        }
                                    }} 
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors"
                                >
                                    <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                                <span className="text-sm sm:text-base font-bold text-slate-800 min-w-[1.5rem] text-center">
                                    {field.quantity}
                                </span>
                                <button 
                                    type="button" 
                                    onClick={() => update(index, { ...shirts[index], quantity: shirts[index].quantity + 1 })} 
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-50 hover:bg-green-50 text-slate-500 hover:text-green-500 flex items-center justify-center transition-colors"
                                >
                                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>
                            
                            {/* Delete Button */}
                             <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors ml-1"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Magazines */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-4">
          <div className="flex items-center mb-4 justify-between">
            <label className="text-base font-semibold text-slate-700">
               {t('step4.registerMagazine')} <span className="text-[#2E5AAC] ml-1">({formatCurrency(MAGAZINE_PRICE)}/cuốn)</span>
            </label>
            <div className="flex items-center gap-1 sm:gap-2 border border-slate-200 rounded-lg p-1 bg-white">
              <button 
                type="button" 
                onClick={() => {
                  if (magazineQuantity > 0) {
                    setValue('packageSelection.magazineQuantity', magazineQuantity - 1);
                  }
                }} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center transition-colors"
              >
                <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <span className="text-sm sm:text-lg font-bold text-slate-800 min-w-[2rem] text-center">
                {magazineQuantity}
              </span>
              <button 
                type="button" 
                onClick={() => setValue('packageSelection.magazineQuantity', magazineQuantity + 1)} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-50 hover:bg-green-50 text-slate-500 hover:text-green-500 flex items-center justify-center transition-colors"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
          
          {magazineQuantity > 0 && (
            <div className="text-right mt-2 hidden sm:block">
               <span className="text-lg font-bold text-[#2E5AAC]">
                  Tổng: {formatCurrency(magazineQuantity * MAGAZINE_PRICE)}
               </span>
            </div>
          )}
          {magazineQuantity > 0 && (
            <div className="text-right mt-2 sm:hidden">
               <span className="text-sm font-bold text-[#2E5AAC]">
                  Tổng: {formatCurrency(magazineQuantity * MAGAZINE_PRICE)}
               </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtotal summary */}
      <div className="mt-8 mb-24 bg-slate-50 rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <p className="text-sm text-slate-600 font-medium mb-1 uppercase tracking-wide">{t('step4.subtotal')}</p>
            <p className="text-3xl font-bold text-[#2E5AAC] tracking-tight">
              {formatCurrency(subtotal)}
            </p>
          </div>
          <div className="text-sm text-slate-500 text-left sm:text-right">
            <p className="font-medium">{t('step4.selectPackage')}, T-shirts & Magazine</p>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <SizeChartModal 
        isOpen={isSizeChartOpen} 
        onClose={() => setIsSizeChartOpen(false)} 
      />
    </div>
  );
};