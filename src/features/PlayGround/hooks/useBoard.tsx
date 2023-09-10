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

export type Board = {
  meta: BoardConfig;
  data: CellData[][];
  initialized: boolean; // 設定に合わせて爆弾を配置したかどうか
};

const makePlainBoard = (config: BoardConfig): Board => {
  const { rows, cols } = config;
  console.log(rows, cols);
  const plainBoardData = [...Array(rows * cols)].map((_, j) => {
    return {
      id: j,
      isOpen: false,
      isMine: false,
      isFlagged: false,
      value: null,
    };
  });

  return {
    meta: config,
    data: convertToMatrix(plainBoardData, rows, cols),
    initialized: false,
  };
};

const setMines = (board: Board, forceEmpty: CellData['id'] | undefined = undefined): Board => {
  // initialBoardの中からランダムにmines個の爆弾の位置を決める
  // forceEmptyが指定されている場合はそのマスと周囲のマスを除外する
  const noMineArea =
    forceEmpty !== undefined
      ? getAroundItems(board.data, toMarixPosition(forceEmpty, board.meta.cols))
          .map((cell) => cell.id)
          .concat([forceEmpty])
      : [];
  const minePositions = getRandomElements(
    board.data
      .flat()
      .map((cell) => cell.id)
      .filter((id) => !noMineArea.includes(id)),
    board.meta.mines,
  );

  const boardWithMines = {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        return minePositions.includes(cell.id) ? { ...cell, isMine: true } : cell;
      });
    }),
  };

  return { ...setMineCount(boardWithMines), initialized: true };
};

// 周囲の爆弾の数を数える
const setMineCount = (board: Board): Board => {
  // matrixの要素を一つずつ見ていく
  const newBoardData = board.data.map((row, i) => {
    return row.map((cell, j) => {
      // すでに爆弾だったら何もしない
      if (cell.isMine) return cell;

      // 周囲8マスの爆弾の数を数える
      const count = getAroundItems(board.data, [i, j]).filter((item) => item.isMine).length;
      return { ...cell, value: count };
    });
  });

  return { ...board, data: newBoardData };
};

const open = (board: Board, selected: [number, number]): Board => {
  // 指定されたboardのマスを開く
  return {
    ...board,
    data: board.data.map((row, i) => {
      return row.map((cell, j) => {
        if (i === selected[0] && j === selected[1]) {
          return { ...cell, isOpen: true };
        }
        return cell;
      });
    }),
  };
};

// 何もないマスを一括開放する
const openEmptyArea = (board: Board, selected: [number, number]): Board => {
  const selectedCell = board.data[selected[0]][selected[1]];
  if (selectedCell.isOpen || selectedCell.value !== 0) return board;

  // flood fill
  let queue = [selected];
  let newBoard = board;

  // TODO: 効率化
  while (queue.length > 0) {
    const target = queue.shift() as [number, number];
    newBoard = open(newBoard, target);

    // 何もないマスだったら周囲のマスをキューに追加
    if (newBoard.data[target[0]][target[1]].value === 0) {
      getAroundItems(newBoard.data, target)
        .filter((cell) => !cell.isOpen && !cell.isMine)
        .forEach((cell) => {
          queue.push(toMarixPosition(cell.id, newBoard.meta.cols));
        });
    }
  }

  return newBoard;
};

const openAll = (board: Board): Board => {
  return {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        return { ...cell, isOpen: true };
      });
    }),
  };
};

type Options = BoardConfig;

const useBoard = (options: Options) => {
  const [board, setBoard] = useState<Board>(makePlainBoard(options));

  const initBoard = (options: BoardConfig) => {
    setBoard(makePlainBoard(options));
  };

  const openCell = (cellId: number): Either<string, Board> => {
    const position = toMarixPosition(cellId, board.meta.cols);

    // 最初のターンだけ盤面を書き換える
    const targetBoard = board.initialized ? board : setMines(board, cellId);

    const targetCell = targetBoard.data[position[0]][position[1]];

    if (!isInside(position, targetBoard.data)) {
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
    const updatedBoard = {
      ...board,
      data: board.data.map((row) => {
        return row.map((cell) => {
          if (cell.id === cellId) {
            return { ...cell, isFlagged: !cell.isFlagged };
          }
          return cell;
        });
      }),
    };

    setBoard(updatedBoard);
  };

  return { board, initBoard, openCell, openAll: () => setBoard(openAll(board)), toggleFlag };
};

export default useBoard;
