import { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { CalendarIcon, CopyIcon, CheckIcon, UploadIcon, ChevronDownIcon, ChevronUpIcon, ReceiptIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';

interface PaymentItem {
  name: string;
  description: string;
  amount: number;
}

interface PaymentBreakdown {
  packages: PaymentItem[];
  shirts: PaymentItem[];
  total: number;
}
export const Step5Payment = () => {
  const {
    register,
    control,
    watch,
    setValue
  } = useFormContext();
  const { t } = useLanguage();
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [copiedItems, setCopiedItems] = useState({
    bankName: false,
    accountNumber: false,
    accountHolder: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const paymentStatus = watch('payment.status');
  const receiptImage = watch('payment.receiptImage');
  
  // Clear receipt image when switching to "will pay later"
  useEffect(() => {
    if (paymentStatus === 'willPayLater' && receiptImage) {
      setValue('payment.receiptImage', null);
      setImagePreview(null);
      setUploadError(null);
    }
  }, [paymentStatus, receiptImage, setValue]);
  
  // Get form data for payment calculation
  const mainPackage = watch('packageSelection.mainPackage');
  const spousePackage = watch('packageSelection.spousePackage');
  const childrenPackages = watch('packageSelection.childrenPackages') || [];
  const shirts = watch('packageSelection.shirts') || [];
  const attendingWithSpouse = watch('familyParticipation.attendingWithSpouse');
  const spouseWantsTShirt = watch('familyParticipation.spouseWantsTShirt');
  const children = watch('familyParticipation.children') || [];
  
  const SHIRT_PRICE = 100000;
  
  const packageOptions = [
    { id: 'A', name: t('step4.packageA.title'), price: 500000 },
    { id: 'B', name: t('step4.packageB.title'), price: 800000 },
    { id: 'C', name: t('step4.packageC.title'), price: 1200000 }
  ];
  
  // Calculate payment breakdown
  const calculatePaymentBreakdown = (): PaymentBreakdown => {
    const breakdown: PaymentBreakdown = {
      packages: [],
      shirts: [],
      total: 0
    };
    
    // Main package
    const mainPkg = packageOptions.find(p => p.id === mainPackage);
    if (mainPkg) {
      breakdown.packages.push({
        name: t('step5.mainPackage'),
        description: mainPkg.name,
        amount: mainPkg.price
      });
      breakdown.total += mainPkg.price;
    }
    
    // Spouse package
    if (attendingWithSpouse && spousePackage) {
      const spousePkg = packageOptions.find(p => p.id === spousePackage);
      if (spousePkg) {
        breakdown.packages.push({
          name: t('step5.spousePackage'),
          description: spousePkg.name,
          amount: spousePkg.price
        });
        breakdown.total += spousePkg.price;
      }
    }
    
    // Children packages
    childrenPackages.forEach((childPackage: any) => {
      const childPkg = packageOptions.find(p => p.id === childPackage.package);
      if (childPkg) {
        const childName = children[childPackage.childIndex]?.name || `${t('step2.childName')} ${childPackage.childIndex + 1}`;
        breakdown.packages.push({
          name: t('step5.childrenPackages'),
          description: `${childPkg.name} - ${childName}`,
          amount: childPkg.price
        });
        breakdown.total += childPkg.price;
      }
    });
    
    // Spouse T-shirt
    if (attendingWithSpouse && spouseWantsTShirt) {
      breakdown.shirts.push({
        name: t('step5.spouseShirts'),
        description: `1 ${t('step5.shirtUnit')}`,
        amount: SHIRT_PRICE
      });
      breakdown.total += SHIRT_PRICE;
    }
    
    // Children T-shirts
    children.forEach((child: any, index: number) => {
      if (child.wantsTShirt) {
        const childName = child.name || `${t('step2.childName')} ${index + 1}`;
        const shirtSize = child.tShirtSize || 'M';
        breakdown.shirts.push({
          name: t('step5.childrenShirts'),
          description: `1 ${t('step5.shirtUnit')} (${t('step4.shirtSizes.' + shirtSize)}) - ${childName}`,
          amount: SHIRT_PRICE
        });
        breakdown.total += SHIRT_PRICE;
      }
    });
    
    // Additional shirts
    if (shirts.length > 0) {
      const totalShirts = shirts.reduce((sum: number, shirt: any) => sum + shirt.quantity, 0);
      const totalShirtCost = shirts.reduce((sum: number, shirt: any) => sum + (shirt.quantity * SHIRT_PRICE), 0);
      breakdown.shirts.push({
        name: t('step5.additionalShirts'),
        description: `${totalShirts} ${t('step5.shirtUnit')}`,
        amount: totalShirtCost
      });
      breakdown.total += totalShirtCost;
    }
    
    return breakdown;
  };
  
  const paymentBreakdown = calculatePaymentBreakdown();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleCopy = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(prev => ({
      ...prev,
      [itemType]: true
    }));
    setTimeout(() => {
      setCopiedItems(prev => ({
        ...prev,
        [itemType]: false
      }));
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Định dạng file không hợp lệ. Chỉ chấp nhận PNG, JPG, JPEG hoặc PDF');
        return;
      }
      
      setValue('payment.receiptImage', file);
      
      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.onerror = () => {
          setUploadError('Lỗi khi đọc file. Vui lòng thử lại');
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, just show the filename
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setValue('payment.receiptImage', null);
    setUploadError(null);
  };
  return <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <ReceiptIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step5.paymentSummary')}
        </h3>
        
        {/* Package costs */}
        {paymentBreakdown.packages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{t('step5.packageCost')}</h4>
            <div className="space-y-2">
              {paymentBreakdown.packages.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#2E5AAC]">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Shirt costs */}
        {paymentBreakdown.shirts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{t('step5.shirtCost')}</h4>
            <div className="space-y-2">
              {paymentBreakdown.shirts.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#2E5AAC]">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">{t('step5.totalAmount')}</span>
            <span className="text-2xl font-bold text-[#2E5AAC]">
              {formatCurrency(paymentBreakdown.total)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('step5.paymentStatus')}
        </label>
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <label className="flex-1 text-center">
            <input type="radio" value="paid" {...register('payment.status')} className="sr-only" />
            <div className={`py-3 cursor-pointer ${paymentStatus === 'paid' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step5.paymentOptions.paid')}
            </div>
          </label>
          <label className="flex-1 text-center border-l border-gray-300">
            <input type="radio" value="willPayLater" {...register('payment.status')} className="sr-only" />
            <div className={`py-3 cursor-pointer ${paymentStatus === 'willPayLater' ? 'bg-[#2E5AAC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              {t('step5.paymentOptions.willPayLater')}
            </div>
          </label>
        </div>
      </div>
      {paymentStatus === 'paid' && <div className="space-y-2">
          <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">
            {t('step5.transferDate')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Controller control={control} name="payment.transferDate" render={({
          field
        }) => <input type="date" id="transferDate" className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#2E5AAC] focus:border-[#2E5AAC] sm:text-sm h-11 border" value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} onChange={e => {
          field.onChange(e.target.value ? new Date(e.target.value) : null);
        }} />} />
          </div>
        </div>}
      {paymentStatus === 'paid' && <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('step5.uploadReceipt')} <span className="text-red-500">*</span>
        </label>
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{uploadError}</span>
          </div>
        )}
        {!imagePreview ? (
          <label htmlFor="receipt-upload" className="block cursor-pointer">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#2E5AAC] hover:bg-blue-50 transition-all duration-200">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-gray-600">
                  <span className="font-medium text-[#2E5AAC] hover:text-[#6AA6FF]">
                    {t('common.upload')} a file
                  </span>
                  <span className="sm:ml-1">or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            <input
              id="receipt-upload"
              type="file"
              className="sr-only"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="relative border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            {imagePreview.startsWith('data:image/') || imagePreview.includes('blob:') ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <img
                  src={imagePreview}
                  alt="Receipt preview"
                  className="max-w-full h-auto max-h-96 rounded-lg mx-auto"
                  onError={(e) => {
                    console.error('Error loading image');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <div className="bg-blue-100 rounded-full p-6 mb-4">
                  <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">File đã được tải lên</p>
                <p className="text-xs text-gray-500 mt-1">Click vào nút X để xóa và tải lại</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
              title="Remove file"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>}
      <div className="border rounded-lg overflow-hidden">
        <button type="button" className="w-full flex justify-between items-center p-4 bg-gray-50" onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}>
          <span className='font-medium'>{t('step5.bankInstructions')}</span>
          {isInstructionsOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
        {isInstructionsOpen && <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600">
              {t('step5.bankSyntax')}
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <code className="text-sm font-mono break-all">
                FullName_ACE_Package_ShirtSize_Quantity
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('step5.accountInfo')}:</p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.bankName')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Vietcombank</span>
                    <button type="button" onClick={() => handleCopy('Vietcombank', 'bankName')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {copiedItems.bankName ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.accountNumber')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">1023456789</span>
                    <button type="button" onClick={() => handleCopy('1023456789', 'accountNumber')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {copiedItems.accountNumber ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('step5.accountHolder')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      Church Anniversary
                    </span>
                    <button type="button" onClick={() => handleCopy('Church Anniversary', 'accountHolder')} className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      {copiedItems.accountHolder ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};