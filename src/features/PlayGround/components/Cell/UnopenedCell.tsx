'use client';

import useLongPress from '@/hooks/useLongPress';
import Image from 'next/image';
import { CellData } from '../../hooks/useBoard';
import { useState } from 'react';

type Props = {
  handleClick: (id: number) => void;
  cell: CellData;
  toggleFlag: (id: number) => void;
};

const UnopenedCell: React.FC<Props> = ({ handleClick, cell, toggleFlag }) => {
  // フラグをハテナ表示に切り替えできるようにする
  const [isSuspicious, setIsSuspicious] = useState(false);
  /**
   * フラグなし
   * - 左クリック: 開放
   * - 右クリック: フラグを立てる
   * フラグあり
   * - 左クリック: フラグ/ハテナを切り替え
   * - 左クリック長押し: フラグを外す
   * - 右クリック: フラグを外す
   */
  const handleLongPress = () => toggleFlag(cell.id);
  const toggleFlagAndQuestion = () => setIsSuspicious((prev) => !prev);
  const handleClickWithFlag = () =>
    cell.isFlagged ? toggleFlagAndQuestion() : handleClick(cell.id); // フラグが立っているときは開放しない
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
      {cell.isFlagged &&
        (isSuspicious ? (
          <span className='text-gray-300 md:text-2xl'>?</span>
        ) : (
          <Image
            src='/flag.png'
            alt='red flag'
            width={30}
            height={30}
            className={'w-3/5 lg:animate-none animate-slide-in-blurred-top pointer-events-none'}
          />
        ))}
    </div>
  );
};

export default UnopenedCell;
