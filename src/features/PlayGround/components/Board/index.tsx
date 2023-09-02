import { getRandomElements } from '@/functions/random';
import { useState } from 'react';

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const isInside = (position: Array<number>) => {
  const rows = 8;
  const cols = 8;
  const [row, col] = position;
  return row >= 0 && row < rows && col >= 0 && col < cols;
};

export type CellData = { isOpen: boolean; isBomb: boolean; value: number | null };
type Board = Array<CellData>;
export type MatrixBoard = CellData[][];

const generateRandomBoard = (size: number, bombs: number): MatrixBoard => {
  const initialBoard: Board = [...Array(size)].map((_, j) => {
    return {
      isOpen: false,
      isBomb: false,
      value: null,
    };
  });

  const bombPositions = getRandomElements(
    [...Array(size)].map((_, j) => j),
    bombs,
  );

  const boardWithBombs = initialBoard.map((cell, j) => {
    return {
      ...cell,
      isBomb: bombPositions.includes(j),
    };
  });

  return getBombCount(convert(boardWithBombs));
};

// 一次元の盤面の配列を二次元に変換する
const convert = (board: Board): MatrixBoard => {
  const newBoard: CellData[][] = [];
  for (let i = 0; i < 8; i++) {
    newBoard.push(board.slice(i * 8, i * 8 + 8));
  }
  return newBoard;
};

// 一次元配列の座標を二次元配列の座標に変換する
const convertIndex = (index: number): [number, number] => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return [row, col];
};

// 周囲の爆弾の数を数える
const getBombCount = (matrix: MatrixBoard): MatrixBoard => {
  // matrixの要素を一つずつ見ていく
  const newBoard = matrix.map((row, i) => {
    return row.map((cell, j) => {
      // すでに爆弾だったら何もしない
      if (cell.isBomb) return cell;

      let count = 0;
      // 周囲8マスを見ていく
      for (let direction of directions) {
        const x = i + direction[0];
        const y = j + direction[1];
        if (x >= 0 && x < 8 && y >= 0 && y < 8 && matrix[x][y].isBomb) {
          count++;
        }
      }
      return { ...cell, value: count };
    });
  });

  return newBoard;
};

const open = (board: MatrixBoard, selected: [number, number]): MatrixBoard => {
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
const openEmptyArea = (board: MatrixBoard, selected: [number, number]): MatrixBoard => {
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
      for (let direction of directions) {
        const position = [target[0] + direction[0], target[1] + direction[1]] as [number, number];
        if (
          isInside(position) &&
          !newBoard[position[0]][position[1]].isBomb &&
          !newBoard[position[0]][position[1]].isOpen
        ) {
          queue.push(position);
        }
      }
    }
  }

  return newBoard;
};

const openAll = (board: MatrixBoard): MatrixBoard => {
  return board.map((row) => {
    return row.map((cell) => {
      return { ...cell, isOpen: true };
    });
  });
};

export type BoardConfig = {
  rows: number;
  cols: number;
  mines: number;
};

type Options = BoardConfig;

type Either<L, R> = { kind: 'Left'; value: L } | { kind: 'Right'; value: R };

const useBoard = ({ rows, cols, mines }: Options) => {
  const [board, setBoard] = useState<MatrixBoard>(generateRandomBoard(rows * cols, mines));

  const initBoard = ({ rows, cols, mines }: BoardConfig) => {
    setBoard(generateRandomBoard(rows * cols, mines));
  };

  const openCell = (index: number): Either<string, MatrixBoard> => {
    const position = convertIndex(index);
    const targetCell = board[position[0]][position[1]];

    if (!isInside(position)) {
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
