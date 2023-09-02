import { useState } from 'react';
import useBoard, { MatrixBoard } from '../components/Board';

type GameState = 'playing' | 'win' | 'lose';

const isWin = (board: MatrixBoard): boolean => {
  return board.flat().every((cell) => {
    return cell.isBomb || cell.isOpen; // 爆弾以外のマスが全て開いていたら勝利
  });
};

type Options = {
  rows: number;
  cols: number;
  mines: number;
};

const usePlayGround = (options: Options) => {
  const [gameState, setGameState] = useState<GameState>('playing');
  const { board, initBoard, openCell, openAll } = useBoard(options);

  const init = (options: Options) => {
    initBoard(options);
    setGameState('playing');
  };

  const open = (index: number) => {
    // ゲームが終了していたら何もしない
    if (gameState !== 'playing') return;

    const result = openCell(index);

    if (result.kind === 'Right') {
      const updatedBoard = result.value;
      if (isWin(updatedBoard)) {
        setGameState('win');
        openAll();
        return;
      }
    } else {
      switch (result.value) {
        case 'Mine Exploded':
          openAll();
          setGameState('lose');
          break;
        default:
          break;
      }
    }
  };

  return { board, gameState, init, open };
};

export default usePlayGround;
