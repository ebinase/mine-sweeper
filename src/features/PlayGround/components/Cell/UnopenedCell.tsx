'use client';

import useLongPress from '@/hooks/useLongPress';
import Image from 'next/image';
import { isFlagged, type Cell } from '@ebinas/react-use-minesweeper';

type Props = {
  handleClick: (id: number) => void;
  cell: Cell;
  toggleFlag: (id: number) => void;
  switchFlagType: (id: number) => void;
};

const UnopenedCell: React.FC<Props> = ({ handleClick, cell, toggleFlag, switchFlagType }) => {
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
  const handleClickWithFlag = () =>
    isFlagged(cell) ? switchFlagType(cell.id) : handleClick(cell.id); // フラグが立っているときは開放しない
  const longPressEvent = useLongPress(handleLongPress, handleClickWithFlag);
  // 右クリックでフラグを切り替える
  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toggleFlag(cell.id);
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClickWithFlag();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFlag(cell.id);
    }
  };

  return (
    <button
      type='button'
      className='h-full w-full flex justify-center items-center bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] focus:bg-slate-400'
      {...longPressEvent}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      aria-label={`Cell at position ${cell.id}`}
    >
      {isFlagged(cell) &&
        (cell.state.flag === 'suspected' ? (
          <span className='text-gray-300 md:text-2xl'>?</span>
        ) : (
          <Image
            src='/flag.png'
            alt='red flag'
            width={30}
            height={30}
            className={'w-3/5 pointer-events-none'}
          />
        ))}
    </button>
  );
};

export default UnopenedCell;
