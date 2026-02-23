import React from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;
  
  // Use Portal to break out of any parent transforms (which break fixed positioning)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">
            {t('step4.sizeChart') || 'Bảng Size Áo'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-2 overflow-y-auto bg-white flex justify-center">
            {/* Using the public path to the image */}
          <img 
            src="/assets/size-chart.png" 
            alt="Size Chart" 
            className="max-w-full h-auto rounded-lg"
          />
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
          >
            {t('common.close') || 'Đóng'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
