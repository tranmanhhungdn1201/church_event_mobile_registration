import { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { CalendarIcon, CopyIcon, CheckIcon, UploadIcon, ChevronDownIcon, ChevronUpIcon, ReceiptIcon, AlertCircleIcon, DownloadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { formStyles } from '../../utils/styles';

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
  const adultPackages = watch('packageSelection.adultPackages') || [];
  const childPackages = watch('packageSelection.childPackages') || [];
  const shirts = watch('packageSelection.shirts') || [];
  const sponsorshipAmount = watch('accommodation.sponsorshipAmount') || 0;
  
  const SHIRT_PRICE = 160000;
  
  const packageOptions = [
    { id: 'ADULT_A', name: t('step4.packageA.title'), price: 2000000 },
    { id: 'ADULT_B', name: t('step4.packageB.title'), price: 1700000 },
    { id: 'ADULT_C', name: t('step4.packageC.title'), price: 1000000 },
    { id: 'ADULT_D', name: t('step4.packageD.title'), price: 600000 }
  ];
  
  // Calculate payment breakdown
  const calculatePaymentBreakdown = (): PaymentBreakdown => {
    const breakdown: PaymentBreakdown = {
      packages: [],
      shirts: [],
      total: 0
    };
    
    // Adult packages
    adultPackages.forEach((pkg: any) => {
      if (pkg.quantity > 0) {
        const option = packageOptions.find(p => p.id === pkg.id);
        if (option) {
          const amount = pkg.quantity * option.price;
          breakdown.packages.push({
            name: `${option.name} (${t('step4.quantity')}: ${pkg.quantity})`,
            description: option.id === 'ADULT_A' || option.id === 'ADULT_B' 
              ? option.name.includes('Hôn nhân') ? 'Gói gia đình' : 'Gói độc thân'
              : option.name,
            amount: amount
          });
          breakdown.total += amount;
        }
      }
    });

    // Child packages
    childPackages.forEach((pkg: any) => {
       if (pkg.quantity > 0) {
        // Find option in a child-specific list if we had one defined in this scope, 
        // but Step4 has the child prices. We should replicate or import them.
        // For now defining them here locally or using a shared constant is best.
        // Let's rely on mapping ID to price manually or via a quick object since I can't easily share constants across files without more refactoring.
        // Wait, packageOptions in this file only has A, B, C with old prices. I need to update packageOptions first!
        
        let price = 0;
        let name = '';

        if (pkg.id === 'CHILD_A') { name = t('step4.childPackageA.title'); price = 700000; }
        else if (pkg.id === 'CHILD_B') { name = t('step4.childPackageB.title'); price = 400000; }
        else if (pkg.id === 'CHILD_C') { name = t('step4.childPackageC.title'); price = 200000; }

        if (price > 0) {
          const amount = pkg.quantity * price;
          breakdown.packages.push({
             name: `${t('step4.childPackages')} - ${name} (${t('step4.quantity')}: ${pkg.quantity})`,
             description: 'Gói trẻ em',
             amount: amount
          });
          breakdown.total += amount;
        }
       }
    });
    
    // Shirts
    if (shirts.length > 0) {
      const totalShirts = shirts.reduce((sum: number, shirt: any) => sum + shirt.quantity, 0);
      const totalShirtCost = shirts.reduce((sum: number, shirt: any) => sum + (shirt.quantity * SHIRT_PRICE), 0);
      
      // Group by size for display
      const shirtDetails = shirts.map((s: any) => `${s.quantity}x ${s.size}`).join(', ');

      breakdown.shirts.push({
        name: t('step5.additionalShirts'),
        description: shirtDetails,
        amount: totalShirtCost
      });
      breakdown.total += totalShirtCost;
    }

    // Magazine
    const wantMagazine = watch('packageSelection.wantMagazine');
    const magazineQuantity = watch('packageSelection.magazineQuantity') || 1;
    if (wantMagazine) {
        // SHIRT_PRICE was 160000, MAGAZINE_PRICE is also 160000
        const magPrice = 160000; 
        const amount = magazineQuantity * magPrice;
         breakdown.shirts.push({
            name: t('step4.magazine'),
            description: `${t('step4.quantity')}: ${magazineQuantity}`,
            amount: amount
         });
         breakdown.total += amount;
    }

    // Sponsorship
    if (sponsorshipAmount > 0) {
      breakdown.total += Number(sponsorshipAmount);
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

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/assets/payment-qr.png';
    link.download = 'Church_Event_Payment_QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={formStyles.section}>
      {/* Payment Summary */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
          <ReceiptIcon className="h-5 w-5 mr-2 text-[#2E5AAC]" />
          {t('step5.paymentSummary')}
        </h3>
        
        {/* Package costs */}
        {paymentBreakdown.packages.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('step5.packageCost')}</h4>
            <div className="space-y-3">
              {paymentBreakdown.packages.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-3 px-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
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
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('step5.shirtCost')}</h4>
            <div className="space-y-3">
              {paymentBreakdown.shirts.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-3 px-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#2E5AAC]">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsorship cost */}
        {sponsorshipAmount > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('step6.sponsorshipAmount')}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-start py-3 px-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t('step6.sponsorshipAmount')}</p>
                </div>
                <span className="text-sm font-semibold text-[#2E5AAC]">
                  {formatCurrency(sponsorshipAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Total */}
        <div className="border-t border-slate-200 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-slate-700">{t('step5.totalAmount')}</span>
            <span className="text-2xl font-bold text-[#2E5AAC] tracking-tight">
              {formatCurrency(paymentBreakdown.total)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className={formStyles.label}>
          {t('step5.paymentStatus')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative block group cursor-pointer">
            <input 
              type="radio" 
              value="paid" 
              {...register('payment.status')} 
              className="peer sr-only" 
            />
            <div className="w-full py-4 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:shadow-sm">
              <span className="font-medium text-sm">{t('step5.paymentOptions.paid')}</span>
            </div>
          </label>
          <label className="relative block group cursor-pointer">
            <input 
              type="radio" 
              value="willPayLater" 
              {...register('payment.status')} 
              className="peer sr-only" 
            />
            <div className="w-full py-4 px-4 text-center rounded-xl border border-slate-200 bg-white transition-all duration-200 peer-checked:border-[#2E5AAC] peer-checked:bg-[#2E5AAC] peer-checked:text-white hover:border-slate-300 hover:shadow-sm">
              <span className="font-medium text-sm">{t('step5.paymentOptions.willPayLater')}</span>
            </div>
          </label>
        </div>
      </div>

      {paymentStatus === 'paid' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="space-y-2">
            <label htmlFor="transferDate" className={formStyles.label}>
              {t('step5.transferDate')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-slate-400" />
              </div>
              <Controller 
                control={control} 
                name="payment.transferDate" 
                render={({ field }) => (
                  <input 
                    type="date" 
                    id="transferDate" 
                    className={`${formStyles.input} pl-10`}
                    value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''} 
                    onChange={e => {
                      field.onChange(e.target.value ? new Date(e.target.value) : null);
                    }} 
                  />
                )} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={formStyles.label}>
              {t('step5.uploadReceipt')} <span className="text-red-500">*</span>
            </label>
            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
                <AlertCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
            {!imagePreview ? (
              <label htmlFor="receipt-upload" className="block cursor-pointer group">
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-xl group-hover:border-[#2E5AAC] group-hover:bg-blue-50/30 transition-all duration-200">
                  <div className="space-y-2 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-slate-400 group-hover:text-[#2E5AAC] transition-colors" />
                    <div className="flex flex-col sm:flex-row justify-center items-center text-sm text-slate-600">
                      <span className="font-medium text-[#2E5AAC] hover:text-[#254a8f]">
                        {t('common.upload')} a file
                      </span>
                      <span className="sm:ml-1 text-slate-500">or drag and drop</span>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG, PDF up to 10MB</p>
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
              <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50">
                {imagePreview.startsWith('data:image/') || imagePreview.includes('blob:') ? (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <img
                      src={imagePreview}
                      alt="Receipt preview"
                      className="max-w-full h-auto max-h-80 rounded-lg mx-auto shadow-sm"
                      onError={(e) => {
                        console.error('Error loading image');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <div className="bg-blue-100 rounded-full p-6 mb-4">
                      <ReceiptIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-900 font-medium">File đã được tải lên</p>
                    <p className="text-xs text-slate-500 mt-1">Click vào nút X để xóa và tải lại</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-white text-slate-500 rounded-full p-2 hover:bg-slate-100 hover:text-red-500 transition-all duration-200 shadow-md border border-slate-200"
                  title="Remove file"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <button 
          type="button" 
          className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors" 
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
        >
          <span className='font-semibold text-slate-800'>{t('step5.bankInstructions')}</span>
          {isInstructionsOpen ? <ChevronUpIcon className="h-5 w-5 text-slate-500" /> : <ChevronDownIcon className="h-5 w-5 text-slate-500" />}
        </button>
        
        {isInstructionsOpen && (
          <div className="p-5 space-y-5 border-t border-slate-200">
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('step5.bankSyntax')}
            </p>
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
              <code className="text-sm font-mono text-[#2E5AAC] break-all">
                Name_Church_Name
              </code>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <img 
                  src="/assets/payment-qr.png" 
                  alt="Payment QR Code" 
                  className="max-w-[200px] h-auto rounded-lg"
                />
              </div>
              <button 
                type="button"
                onClick={handleDownloadQR}
                className="mt-3 flex items-center text-sm font-medium text-[#2E5AAC] hover:text-[#254a8f] transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                {t('step5.downloadQR')}
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">{t('step5.accountInfo')}:</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{t('step5.bankName')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900">{t('step5.bankNameValue')}</span>
                    <button type="button" onClick={() => handleCopy(t('step5.bankNameValue'), 'bankName')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                      {copiedItems.bankName ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{t('step5.accountNumber')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900">{t('step5.accountNumberValue')}</span>
                    <button type="button" onClick={() => handleCopy(t('step5.accountNumberValue'), 'accountNumber')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                      {copiedItems.accountNumber ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">{t('step5.accountHolder')}:</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-slate-900">
                      {t('step5.accountHolderValue')}
                    </span>
                    <button type="button" onClick={() => handleCopy(t('step5.accountHolderValue'), 'accountHolder')} className="ml-2 p-1.5 text-slate-400 hover:text-[#2E5AAC] hover:bg-blue-50 rounded-md transition-colors">
                      {copiedItems.accountHolder ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};