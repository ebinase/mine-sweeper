'use client';

import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const HelpDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <button
        type='button'
        className='absolute inset-0 bg-black/60'
        aria-label='Close help'
        onClick={onClose}
      />
      <div className='relative z-10 w-[90vw] max-w-sm rounded-sm bg-slate-700 p-4 text-slate-100 shadow-lg'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold'>操作方法</h2>
          <button
            type='button'
            className='text-xs px-2 py-1 bg-slate-500'
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
        <ul className='mt-3 space-y-2 text-xs leading-relaxed'>
          <li>左クリック/タップ: マスを開く</li>
          <li>右クリック/長押し: 旗を置く</li>
          <li>旗を再度操作: ? に切り替え</li>
        </ul>
      </div>
    </div>
  );
};

export default HelpDialog;
