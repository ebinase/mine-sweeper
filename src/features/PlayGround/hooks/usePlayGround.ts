import { useReducer } from 'react';
import {
  Board,
  BoardConfig,
  countFlags,
  initBoard,
  isAllOpened,
  openAll,
  openCell,
  toggleFlag,
} from '../functions/board';

type GameState = 'initialized' | 'playing' | 'completed' | 'failed';

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

type State = {
  gameMode: GameMode;
  gameState: GameState;
  board: Board;
};

export type Action =
  | { type: 'init'; gameMode: GameMode }
  | { type: 'reset' }
  | { type: 'open'; index: number }
  | { type: 'toggleFlag'; index: number };

const initialize = (gameMode: GameMode): State => {
  return {
    gameMode,
    gameState: 'initialized',
    board: initBoard(gameModeToOptions(gameMode)),
  };
};

const open = (state: State, action: Extract<Action, { type: 'open' }>): State => {
  // ゲームが終了していたら何もしない
  if (state.gameState === 'completed' || state.gameState === 'failed') {
    return state;
  }

  const result = openCell(state.board, action.index);

  if (result.kind === 'Right') {
    const updatedBoard = result.value;
    if (isAllOpened(updatedBoard)) {
      return {
        ...state,
        gameState: 'completed',
        board: openAll(updatedBoard),
      };
    }
    return { ...state, board: updatedBoard };
  } else {
    switch (result.value) {
      case 'Mine Exploded':
        return {
          ...state,
          gameState: 'failed',
          board: openAll(state.board),
        };
      default:
        return state;
    }
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // 初期化
    case 'init':
      return initialize(action.gameMode);
    // 同じゲームモードで初期化
    case 'reset':
      return initialize(state.gameMode);
    // マスを開く
    case 'open':
      return open(state, action);
    case 'toggleFlag':
      return {
        ...state,
        board: toggleFlag(state.board, action.index),
      };
    default:
      return state;
  }
};

const usePlayGround = () => {
  // reducer
  const [state, dispatch] = useReducer(reducer, initialize('easy'));

  // middleware
  const flags = countFlags(state.board);

  return { ...state, dispatch, flags };
};

export default usePlayGround;
