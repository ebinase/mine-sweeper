import { useState } from 'react';
import useBoard, { Board, BoardConfig } from './useBoard';

type GameState = 'playing' | 'win' | 'lose';

const isWin = (board: Board): boolean => {
  return board.flat().every((cell) => {
    return cell.isMine || cell.isOpen; // 爆弾以外のマスが全て開いていたら勝利
  });
};

export type GameMode = 'easy' | 'normal' | 'hard';

const gameModeToOptions = (gameMode: GameMode): BoardConfig => {
  switch (gameMode) {
    case 'easy':
      return { rows: 9, cols: 9, mines: 10 };
    case 'normal':
      return { rows: 16, cols: 16, mines: 40 };
    case 'hard':
      return { rows: 30, cols: 16, mines: 99 };
  }
};

const usePlayGround = () => {
  const [mode, setMode] = useState<GameMode>('easy');
  const [gameState, setGameState] = useState<GameState>('playing');
  const { board, initBoard, openCell, openAll, toggleFlag } = useBoard(gameModeToOptions(mode));

  const init = (mode: GameMode) => {
    setMode(mode);
    setGameState('playing');
    initBoard(gameModeToOptions(mode));
  };

  // 同じモードでリセットする
  const reset = () => {
    init(mode);
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

  const getConfig = () => {
    return gameModeToOptions(mode);
  };

  const countFlags = () => board.flat().filter((cell) => cell.isFlagged).length;

  return { board, gameState, init, reset, open, getConfig, toggleFlag, countFlags, mode };
};

export default usePlayGround;
