'use client';

import { toMarixPosition } from '../../functions/matrix';
import Cell from '../Cell';
import { MineSweeper } from '../../hooks/useMineSweeper';

type Props = Pick<MineSweeper, 'board' | 'open' | 'toggleFlag' | 'switchFlagType'>;

const Board: React.FC<Props> = ({ board, open, toggleFlag, switchFlagType }) => {
  return (
    <div
      className={'bg-slate-700 grid gap-1 p-2 w-fit'}
      style={{
        gridTemplateColumns: `repeat(${board.meta.cols}, 1fr)`,
        gridTemplateRows: `repeat(${board.meta.rows}, 1fr)`,
      }}
    >
      {board.data.flat().map((cell) => {
        const [row, col] = toMarixPosition(cell.id, board.meta.cols);
        return (
          <Cell
            key={cell.id}
            cell={cell}
            row={row}
            col={col}
            handleClick={open}
            toggleFlag={toggleFlag}
            switchFlagType={switchFlagType}
          />
        );
      })}
    </div>
  );
};

export default Board;
