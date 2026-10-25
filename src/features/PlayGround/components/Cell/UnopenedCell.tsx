import { gameImages } from '@/assets/gameImages';
import useLongPress from '@/hooks/useLongPress';
import type { Cell } from '@ebinas/react-use-minesweeper';
import type { Minesweeper } from '@ebinas/react-use-minesweeper/react';

type Props = Pick<Minesweeper, 'open' | 'setFlag'> & {
  cell: Extract<Cell, { state: 'hidden' }>;
};

const UnopenedCell: React.FC<Props> = ({ open, cell, setFlag }) => {
  /**
   * フラグなし
   * - 左クリック: 開放
   * - 右クリック: フラグを立てる
   * フラグあり
   * - 左クリック: フラグ/ハテナを切り替え
   * - 左クリック長押し: フラグを外す
   * - 右クリック: フラグを外す
   */
  const toggleFlag = () => setFlag(cell.id, cell.flag === 'none' ? 'flag' : 'none');
  const handleLongPress = toggleFlag;
  const handleClickWithFlag = () =>
    cell.flag === 'none'
      ? open(cell.id)
      : setFlag(cell.id, cell.flag === 'flag' ? 'question' : 'flag');
  const longPressEvent = useLongPress(handleLongPress, handleClickWithFlag);
  // 右クリックでフラグを切り替える
  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toggleFlag();
  };

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClickWithFlag();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFlag();
    }
  };

  return (
    <button
      type='button'
      className='touch-manipulation h-full w-full flex justify-center items-center bg-slate-500 shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] focus:bg-slate-400'
      {...longPressEvent}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      aria-label={`Cell at position ${cell.id}`}
    >
      {cell.flag !== 'none' &&
        (cell.flag === 'question' ? (
          <span className='text-gray-300 md:text-2xl'>?</span>
        ) : (
          <img
            src={gameImages.flag}
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
