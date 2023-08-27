'use client';

import React, { useState } from 'react';
import { CellData } from '../PlayGround';
import Image from 'next/image';
import useLongPress from '@/hooks/useLongPress';
import OpenedCell from './OpenedCell';

type Props = {
  cell: CellData;
  handleClick: () => void;
  isFailed: boolean;
};

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false }) => {
  const [isFlagged, setIsFlagged] = useState(false);

  // 長押しでフラグを切り替える
  const handleLongPress = () => setIsFlagged(!isFlagged);
  const longPressEvent = useLongPress(handleLongPress, handleClick);
  // 右クリックでフラグを切り替える
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsFlagged(!isFlagged);
  };

  return (
    <div
      className={'flex justify-center items-center aspect-square select-none'}
      {...longPressEvent}
      onContextMenu={handleContextMenu}
    >
      {cell.isOpen ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <div className='h-full w-full flex justify-center items-center bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff]'>
          {isFlagged && <Image src='/flag.png' alt='red flag' width={30} height={30} />}
        </div>
      )}
    </div>
  );
};

export default Cell;
