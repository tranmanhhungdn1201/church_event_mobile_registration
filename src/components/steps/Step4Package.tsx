import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PlusIcon, MinusIcon, CheckIcon, ShirtIcon, UserIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
const SHIRT_PRICE = 100000;
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
  
  const packageOptions = [
    {
      id: 'A',
      name: t('step4.packageA.title'),
      price: 500000,
      features: [t('step4.packageA.description')]
    },
    {
      id: 'B', 
      name: t('step4.packageB.title'),
      price: 800000,
      features: [t('step4.packageB.description')]
    },
    {
      id: 'C',
      name: t('step4.packageC.title'),
      price: 1200000,
      features: [t('step4.packageC.description')]
    }
  ];
  
  const shirtSizes = [
    { value: 'S', label: t('step4.shirtSizes.S') },
    { value: 'M', label: t('step4.shirtSizes.M') },
    { value: 'L', label: t('step4.shirtSizes.L') },
    { value: 'XL', label: t('step4.shirtSizes.XL') },
    { value: 'XXL', label: t('step4.shirtSizes.XXL') }
  ];
  const mainPackage = watch('packageSelection.mainPackage');
  const spousePackage = watch('packageSelection.spousePackage');
  const wantSouvenirShirt = watch('packageSelection.wantSouvenirShirt');
  const shirts = watch('packageSelection.shirts') || [];
  const attendingWithSpouse = watch('familyParticipation.attendingWithSpouse');
  const children = watch('familyParticipation.children') || [];
  const childrenPackages = watch('packageSelection.childrenPackages') || [];
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
    append: appendChildPackage,
    remove: removeChildPackage
  } = useFieldArray({
    control,
    name: 'packageSelection.childrenPackages'
  });
  // Initialize spouse package when spouse is added
  useEffect(() => {
    if (attendingWithSpouse && !spousePackage) {
      setValue('packageSelection.spousePackage', 'A');
    }
  }, [attendingWithSpouse, spousePackage, setValue]);
  // Sync children packages with children
  useEffect(() => {
    // Make sure each child has a package selection
    if (children.length > 0) {
      const existingChildPackages = getValues('packageSelection.childrenPackages') || [];
      const existingChildIndices = existingChildPackages.map((cp: any) => cp.childIndex);
      // Add missing child packages
      children.forEach((_child: any, index: number) => {
        if (!existingChildIndices.includes(index)) {
          appendChildPackage({
            childIndex: index,
            package: 'A'
          });
        }
      });
      // Remove packages for children that no longer exist
      const packagesToRemove = existingChildPackages.map((cp: any, index: number) => cp.childIndex >= children.length ? index : -1).filter((index: number) => index !== -1).sort((a: number, b: number) => b - a); // Sort in reverse to avoid index shifting issues
      packagesToRemove.forEach((index: number) => {
        removeChildPackage(index);
      });
    }
  }, [children.length, appendChildPackage, removeChildPackage, getValues]);
  // Calculate subtotal
  const calculateTotal = () => {
    // Main registrant package
    let total = packageOptions.find(p => p.id === mainPackage)?.price || 0;
    // Spouse package
    if (attendingWithSpouse && spousePackage) {
      total += packageOptions.find(p => p.id === spousePackage)?.price || 0;
    }
    // Children packages
    childrenPackages.forEach((childPackage: any) => {
      total += packageOptions.find(p => p.id === childPackage.package)?.price || 0;
    });
    // Main registrant shirts
    const shirtTotal = shirts.reduce((sum: number, shirt: any) => {
      return sum + shirt.quantity * SHIRT_PRICE;
    }, 0);
    // T-shirts for spouse and children
    const spouseWantsTShirt = watch('familyParticipation.spouseWantsTShirt');
    if (attendingWithSpouse && spouseWantsTShirt) {
      total += SHIRT_PRICE;
    }
    children.forEach((child: any, _index: number) => {
      if (child.wantsTShirt) {
        total += SHIRT_PRICE;
      }
    });
    return total + shirtTotal;
  };
  const subtotal = calculateTotal();
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
    append({
      size: selectedSize,
      quantity: 1
    });
  };
  return <div className="space-y-6">
      {/* Main registrant package */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step4.selectPackage')}
        </h3>
        <div className="grid gap-4">
          {packageOptions.map(pkg => <label key={pkg.id} className="block">
              <input type="radio" value={pkg.id} {...register('packageSelection.mainPackage')} className="sr-only" />
              <div className={`p-6 rounded-xl border-2 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${mainPackage === pkg.id ? 'border-[#2E5AAC] bg-gradient-to-r from-blue-50 to-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{pkg.name}</h4>
                    <p className="text-xl font-bold text-[#2E5AAC] mt-2">
                      {formatCurrency(pkg.price)}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${mainPackage === pkg.id ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] shadow-lg' : 'border-2 border-gray-300'}`}>
                    {mainPackage === pkg.id && <CheckIcon className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {pkg.features.map((feature, index) => <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>)}
                </ul>
              </div>
            </label>)}
        </div>
      </div>
      {/* Spouse package */}
      {attendingWithSpouse && <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
            {t('step2.spouseName')} Package
          </h3>
          <div className="grid gap-4">
            {packageOptions.map(pkg => <label key={pkg.id} className="block">
                <input type="radio" value={pkg.id} {...register('packageSelection.spousePackage')} className="sr-only" />
                <div className={`p-6 rounded-xl border-2 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${spousePackage === pkg.id ? 'border-[#2E5AAC] bg-gradient-to-r from-blue-50 to-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">{pkg.name}</h4>
                      <p className="text-xl font-bold text-[#2E5AAC] mt-2">
                        {formatCurrency(pkg.price)}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${spousePackage === pkg.id ? 'bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] shadow-lg' : 'border-2 border-gray-300'}`}>
                      {spousePackage === pkg.id && <CheckIcon className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              </label>)}
          </div>
        </div>}
      {/* Children packages */}
      {children.length > 0 && <div className="space-y-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
            {t('step2.children')} Packages
          </h3>
          <div className="grid gap-4">
            {children.map((child: any, childIndex: number) => {
              const childPackage = childrenPackages.find((cp: any) => cp.childIndex === childIndex)?.package || 'A';
              return <div key={childIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-[#2E5AAC]" />
                    {child.name || `${t('step2.childName')} ${childIndex + 1}`}'s Package
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packageOptions.map(pkg => <label key={pkg.id} className="block">
                        <input 
                          type="radio" 
                          name={`childPackage-${childIndex}`} 
                          checked={childPackage === pkg.id} 
                          onChange={() => {
                            const newChildrenPackages = [...childrenPackages];
                            const existingIndex = newChildrenPackages.findIndex((cp: any) => cp.childIndex === childIndex);
                            if (existingIndex >= 0) {
                              newChildrenPackages[existingIndex].package = pkg.id;
                            } else {
                              newChildrenPackages.push({
                                childIndex,
                                package: pkg.id
                              });
                            }
                            setValue('packageSelection.childrenPackages', newChildrenPackages);
                          }} 
                          className="sr-only" 
                        />
                        <div className={`p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer hover:shadow-md ${childPackage === pkg.id ? 'border-[#2E5AAC] bg-gradient-to-r from-blue-50 to-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                          <p className="font-semibold text-gray-800">{t('step4.selectPackage')} {pkg.id}</p>
                          <p className="text-lg font-bold text-[#2E5AAC] mt-1">
                            {formatCurrency(pkg.price)}
                          </p>
                        </div>
                      </label>)}
                  </div>
                </div>;
            })}
          </div>
        </div>}
      {/* T-shirt for spouse and children */}
      {attendingWithSpouse && <div className="border-t border-gray-200 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <ShirtIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
            {t('step4.spouseTShirt')}
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center">
              <input 
                id="spouseWantsTShirt" 
                type="checkbox" 
                {...register('familyParticipation.spouseWantsTShirt')} 
                className="h-5 w-5 text-[#2E5AAC] focus:ring-2 focus:ring-[#2E5AAC] border-gray-300 rounded" 
              />
              <label htmlFor="spouseWantsTShirt" className="ml-3 flex items-center text-sm font-semibold text-gray-700">
                <ShirtIcon className="h-4 w-4 mr-2 text-[#2E5AAC]" />
                {t('step4.spouseWantsTShirt')} <span className="text-[#2E5AAC] ml-1">({formatCurrency(SHIRT_PRICE)})</span>
              </label>
            </div>
            {watch('familyParticipation.spouseWantsTShirt') && <div className="mt-4 pl-8">
                <label htmlFor="spouseTShirtSize" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('step4.spouseTShirtSize')}
                </label>
                <select 
                  id="spouseTShirtSize" 
                  {...register('familyParticipation.spouseTShirtSize')} 
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200"
                >
                  {shirtSizes.map(size => <option key={size.value} value={size.value}>
                      {size.label}
                    </option>)}
                </select>
              </div>}
          </div>
        </div>}
      
      {/* T-shirt for children */}
      {children.length > 0 && <div className="border-t border-gray-200 pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <ShirtIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
            {t('step4.childrenTShirt')}
          </h3>
          <div className="grid gap-4">
            {children.map((child: any, index: number) => <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-[#2E5AAC]" />
                  {child.name || `${t('step2.childName')} ${index + 1}`}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input 
                      id={`child${index}WantsTShirt`} 
                      type="checkbox" 
                      {...register(`familyParticipation.children.${index}.wantsTShirt`)} 
                      className="h-5 w-5 text-[#2E5AAC] focus:ring-2 focus:ring-[#2E5AAC] border-gray-300 rounded" 
                    />
                    <label htmlFor={`child${index}WantsTShirt`} className="ml-3 flex items-center text-sm font-semibold text-gray-700">
                      <ShirtIcon className="h-4 w-4 mr-2 text-[#2E5AAC]" />
                      {t('step4.childWantsTShirt')} <span className="text-[#2E5AAC] ml-1">({formatCurrency(SHIRT_PRICE)})</span>
                    </label>
                  </div>
                  {watch(`familyParticipation.children.${index}.wantsTShirt`) && <div className="mt-4 pl-8">
                      <label htmlFor={`child${index}TShirtSize`} className="block text-sm font-medium text-gray-700 mb-2">
                        {t('step4.childTShirtSize')}
                      </label>
                      <select 
                        id={`child${index}TShirtSize`} 
                        {...register(`familyParticipation.children.${index}.tShirtSize`)} 
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200"
                      >
                        {shirtSizes.map(size => <option key={size.value} value={size.value}>
                            {size.label}
                          </option>)}
                      </select>
                    </div>}
                </div>
              </div>)}
          </div>
        </div>}
      
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <ShirtIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step4.additionalSouvenirShirt')}
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center">
            <input 
              id="wantSouvenirShirt" 
              type="checkbox" 
              {...register('packageSelection.wantSouvenirShirt')} 
              className="h-5 w-5 text-[#2E5AAC] focus:ring-2 focus:ring-[#2E5AAC] border-gray-300 rounded" 
            />
            <label htmlFor="wantSouvenirShirt" className="ml-3 block text-sm font-semibold text-gray-700">
              {t('step4.additionalSouvenirShirt')} <span className="text-[#2E5AAC] ml-1">({formatCurrency(SHIRT_PRICE)}/each)</span>
            </label>
          </div>
          {wantSouvenirShirt && <div className="mt-4 pl-8 space-y-4">
              <div className="flex items-center space-x-3">
                <select 
                  value={selectedSize} 
                  onChange={e => setSelectedSize(e.target.value)} 
                  className="block rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-12 border px-4 transition-all duration-200"
                >
                  {shirtSizes.map(size => <option key={size.value} value={size.value}>
                      {size.label}
                    </option>)}
                </select>
                <button 
                  type="button" 
                  onClick={handleAddShirt} 
                  className="h-12 px-6 bg-gradient-to-r from-[#2E5AAC] to-[#1e3a8a] text-white rounded-lg text-sm font-semibold flex items-center hover:shadow-lg transition-all duration-200"
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> {t('common.add')}
                </button>
              </div>
              {fields.length > 0 && <div className="space-y-3">
                  {fields.map((field: any, index: number) => <div key={field.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <ShirtIcon className="h-5 w-5 text-[#2E5AAC] mr-3" />
                        <span className="font-medium text-gray-700">{t('step4.shirtSizes.' + field.size)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <button 
                            type="button" 
                            onClick={() => {
                              const currentQty = shirts[index].quantity;
                              if (currentQty > 1) {
                                update(index, {
                                  ...shirts[index],
                                  quantity: currentQty - 1
                                });
                              } else {
                                remove(index);
                              }
                            }} 
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">
                            {field.quantity}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => {
                              update(index, {
                                ...shirts[index],
                                quantity: shirts[index].quantity + 1
                              });
                            }} 
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-[#2E5AAC] min-w-[6rem] text-right">
                          {formatCurrency(field.quantity * SHIRT_PRICE)}
                        </span>
                      </div>
                    </div>)}
                </div>}
            </div>}
        </div>
      </div>
      {/* Subtotal summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <p className="text-sm text-gray-600 font-medium mb-1">{t('step4.subtotal')}</p>
            <p className="text-3xl font-bold text-[#2E5AAC]">
              {formatCurrency(subtotal)}
            </p>
          </div>
          <div className="text-sm text-gray-600 text-left sm:text-right">
            <p className="font-medium">{t('step4.selectPackage')} & T-shirts</p>
          </div>
        </div>
      </div>
    </div>;
};