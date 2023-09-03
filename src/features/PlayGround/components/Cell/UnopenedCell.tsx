'use client';

import useLongPress from '@/hooks/useLongPress';
import Image from 'next/image';
import { useState } from 'react';
import { CellData } from '../../hooks/useBoard';

type Props = {
  handleClick: (id: number) => void;
  cell: CellData;
};

const UnopenedCell: React.FC<Props> = ({ handleClick, cell }) => {
  const [isFlagged, setIsFlagged] = useState(false);

  // マスの開放、長押しでフラグでのフラグの切り替え
  const handleLongPress = () => setIsFlagged(!isFlagged);
  const handleClickWithFlag = () => (isFlagged ? setIsFlagged(false) : handleClick(cell.id)); // フラグが立っているときは開放しない
  const longPressEvent = useLongPress(handleLongPress, handleClickWithFlag);
  // 右クリックでフラグを切り替える
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsFlagged(!isFlagged);
  };
  return (
    <div
      className='h-full w-full flex justify-center items-center bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff]'
      {...longPressEvent}
      onContextMenu={handleContextMenu}
    >
      {isFlagged && <Image src='/flag.png' alt='red flag' width={30} height={30} />}
    </div>
  );
};

export default UnopenedCell;
