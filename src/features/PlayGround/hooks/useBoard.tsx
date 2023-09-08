import { getRandomElements } from '@/functions/random';
import type { Either } from '@/types/Either';
import { useState } from 'react';
import { convertToMatrix, getAroundItems, isInside, toMarixPosition } from '../functions/matrix';

export type BoardConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type CellData = {
  id: number;
  isOpen: boolean;
  isMine: boolean;
  isFlagged: boolean;
  value: number | null;
};

export type Board = CellData[][];

const getInitialBoard = (rows: BoardConfig['rows'], cols: BoardConfig['cols']): Board => {
  const initialBoard = [...Array(rows * cols)].map((_, j) => {
    return {
      id: j,
      isOpen: false,
      isMine: false,
      isFlagged: false,
      value: null,
    };
  });

  return convertToMatrix(initialBoard, rows, cols);
};

const buildRandomBoard = (
  { rows, cols, mines }: BoardConfig,
  forceEmpty: CellData['id'] | undefined = undefined,
): Board => {
  const initialBoard = getInitialBoard(rows, cols);

  // initialBoardの中からランダムにmines個の爆弾の位置を決める
  // forceEmptyが指定されている場合はそのマスと周囲のマスを除外する
  const noMineArea =
    forceEmpty !== undefined
      ? getAroundItems(initialBoard, toMarixPosition(forceEmpty, cols))
          .map((cell) => cell.id)
          .concat([forceEmpty])
      : [];
  const minePositions = getRandomElements(
    initialBoard
      .flat()
      .map((cell) => cell.id)
      .filter((id) => !noMineArea.includes(id)),
    mines,
  );

  const boardWithMines = initialBoard.map((row) => {
    return row.map((cell) => {
      return minePositions.includes(cell.id) ? { ...cell, isMine: true } : cell;
    });
  });

  return setMineCount(boardWithMines);
};

// 周囲の爆弾の数を数える
const setMineCount = (matrix: Board): Board => {
  // matrixの要素を一つずつ見ていく
  const newBoard = matrix.map((row, i) => {
    return row.map((cell, j) => {
      // すでに爆弾だったら何もしない
      if (cell.isMine) return cell;

      // 周囲8マスの爆弾の数を数える
      const count = getAroundItems(matrix, [i, j]).filter((item) => item.isMine).length;
      return { ...cell, value: count };
    });
  });

  return newBoard;
};

const open = (board: Board, selected: [number, number]): Board => {
  // 指定されたboardのマスを開く
  return board.map((row, i) => {
    return row.map((cell, j) => {
      if (i === selected[0] && j === selected[1]) {
        return { ...cell, isOpen: true };
      }
      return cell;
    });
  });
};

// 何もないマスを一括開放する
const openEmptyArea = (board: Board, selected: [number, number]): Board => {
  const selectedCell = board[selected[0]][selected[1]];
  if (selectedCell.isOpen || selectedCell.value !== 0) return board;

  // flood fill
  let queue = [selected];
  let newBoard = board;

  // TODO: 効率化
  while (queue.length > 0) {
    const target = queue.shift() as [number, number];
    newBoard = open(newBoard, target);

    // 何もないマスだったら周囲のマスをキューに追加
    if (newBoard[target[0]][target[1]].value === 0) {
      getAroundItems(newBoard, target)
        .filter((cell) => !cell.isOpen && !cell.isMine)
        .forEach((cell) => {
          queue.push(toMarixPosition(cell.id, newBoard[0].length));
        });
    }
  }

  return newBoard;
};

const openAll = (board: Board): Board => {
  return board.map((row) => {
    return row.map((cell) => {
      return { ...cell, isOpen: true };
    });
  });
};

type Options = BoardConfig;

const useBoard = (options: Options) => {
  const [board, setBoard] = useState<Board>(getInitialBoard(options.rows, options.cols));
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);

  const initBoard = (options: BoardConfig) => {
    setBoard(getInitialBoard(options.rows, options.cols));
    setIsFirstClick(true);
  };

  const openCell = (cellId: number): Either<string, Board> => {
    const position = toMarixPosition(cellId, board[0].length);

    // 最初のターンだけ盤面を書き換える
    const targetBoard = isFirstClick ? buildRandomBoard(options, cellId) : board;
    if (isFirstClick) {
      setIsFirstClick(false);
    }

    const targetCell = targetBoard[position[0]][position[1]];

    if (!isInside(position, targetBoard)) {
      return { kind: 'Left', value: 'Invalid position' };
    }

    if (targetCell.isOpen) {
      return { kind: 'Left', value: 'Cell already opened' };
    }

    if (targetCell.isMine) {
      return { kind: 'Left', value: 'Mine Exploded' };
    }

    const updatedBoard =
      targetCell.value === 0 ? openEmptyArea(targetBoard, position) : open(targetBoard, position);

    setBoard(updatedBoard);

    return { kind: 'Right', value: updatedBoard };
  };

  const toggleFlag = (cellId: number): void => {
    const updatedBoard = board.map((row) => {
      return row.map((cell) => {
        if (cell.id === cellId) {
          return { ...cell, isFlagged: !cell.isFlagged };
        }
        return cell;
      });
    });

    setBoard(updatedBoard);
  };

  return { board, initBoard, openCell, openAll: () => setBoard(openAll(board)), toggleFlag };
};

export default useBoard;
