import { getRandomElements } from '@/functions/random';
import type { Either } from '@/types/Either';
import { useState } from 'react';
import {
  convertToMatrix,
  getAroundItems,
  isInside,
  toMarixPosition,
} from '../../functions/matrix';

export type BoardConfig = {
  rows: number;
  cols: number;
  mines: number;
};

type CellData = { id: number; isOpen: boolean; isBomb: boolean; value: number | null };
// type Board = Array<CellData>;
export type Board = CellData[][];

const generateRandomBoard = ({ rows, cols, mines }: BoardConfig): Board => {
  const initialBoard = [...Array(rows * cols)].map((_, j) => {
    return {
      id: j,
      isOpen: false,
      isBomb: false,
      value: null,
    };
  });

  // initialBoardの中からランダムにmines個の爆弾の位置を決める
  const bombPositions = getRandomElements(
    initialBoard.map((cell) => cell.id),
    mines,
  );

  const boardWithBombs = initialBoard.map((cell, j) => {
    return {
      ...cell,
      isBomb: bombPositions.includes(j),
    };
  });

  return setMineCount(convertToMatrix(boardWithBombs, rows, cols));
};

// 周囲の爆弾の数を数える
const setMineCount = (matrix: Board): Board => {
  // matrixの要素を一つずつ見ていく
  const newBoard = matrix.map((row, i) => {
    return row.map((cell, j) => {
      // すでに爆弾だったら何もしない
      if (cell.isBomb) return cell;

      // 周囲8マスの爆弾の数を数える
      const count = getAroundItems(matrix, [i, j]).filter((item) => item.isBomb).length;
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
        .filter((cell) => !cell.isOpen && !cell.isBomb)
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
  const [board, setBoard] = useState<Board>(generateRandomBoard(options));

  const initBoard = (options: BoardConfig) => {
    setBoard(generateRandomBoard(options));
  };

  const openCell = (cellId: number): Either<string, Board> => {
    const position = toMarixPosition(cellId, board[0].length);
    const targetCell = board[position[0]][position[1]];

    if (!isInside(position, board)) {
      return { kind: 'Left', value: 'Invalid position' };
    }

    if (targetCell.isOpen) {
      return { kind: 'Left', value: 'Cell already opened' };
    }

    if (targetCell.isBomb) {
      return { kind: 'Left', value: 'Mine Exploded' };
    }

    const updatedBoard =
      targetCell.value === 0 ? openEmptyArea(board, position) : open(board, position);

    setBoard(updatedBoard);

    return { kind: 'Right', value: updatedBoard };
  };

  return { board, initBoard, openCell, openAll: () => setBoard(openAll(board)) };
};

export default useBoard;
