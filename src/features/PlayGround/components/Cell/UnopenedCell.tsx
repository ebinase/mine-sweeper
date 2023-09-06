'use client';

import useLongPress from '@/hooks/useLongPress';
import Image from 'next/image';
import { CellData } from '../../hooks/useBoard';
import { useEffect, useState } from 'react';

type Props = {
  handleClick: (id: number) => void;
  cell: CellData;
  toggleFlag: (id: number) => void;
};

const UnopenedCell: React.FC<Props> = ({ handleClick, cell, toggleFlag }) => {
  // マスの開放、長押しでフラグでのフラグの切り替え
  const handleLongPress = () => toggleFlag(cell.id);
  const handleClickWithFlag = () => (cell.isFlagged ? toggleFlag(cell.id) : handleClick(cell.id)); // フラグが立っているときは開放しない
  const longPressEvent = useLongPress(handleLongPress, handleClickWithFlag);
  // 右クリックでフラグを切り替える
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    toggleFlag(cell.id);
  };
  return (
    <div
      className='h-full w-full flex justify-center items-center bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff]'
      {...longPressEvent}
      onContextMenu={handleContextMenu}
    >
      {cell.isFlagged && (
        <Image
          src='/flag.png'
          alt='red flag'
          width={30}
          height={30}
          className={'w-3/5 lg:animate-none animate-slide-in-blurred-top'}
        />
      )}
    </div>
  );
};

export default UnopenedCell;
