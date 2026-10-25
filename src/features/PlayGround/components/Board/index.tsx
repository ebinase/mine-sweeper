import Cell from '../Cell';
import type { Minesweeper } from '@ebinas/react-use-minesweeper/react';

type Props = Pick<Minesweeper, 'board' | 'open' | 'setFlag'>;

const Board: React.FC<Props> = ({ board, open, setFlag }) => {
  return (
    <section
      className={'w-fit h-fit bg-slate-700 grid gap-1 p-2'}
      style={{
        gridTemplateColumns: `repeat(${board.config.cols}, 1fr)`,
        gridTemplateRows: `repeat(${board.config.rows}, 1fr)`,
      }}
    >
      {board.cells.map((cell) => (
        <Cell key={cell.id} cell={cell} open={open} setFlag={setFlag} />
      ))}
    </section>
  );
};

export default Board;
