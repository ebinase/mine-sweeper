import { getRandomElements } from '@/functions/random';
import type { Either } from '@/types/Either';
import { convertToMatrix, getAroundItems, isInside, toMarixPosition } from './matrix';

export type BoardConfig = {
  rows: number;
  cols: number;
  mines: number;
};

export type CellData = {
  id: number;
  content:
    | { type: 'mine'; exploded: boolean }
    | { type: 'count'; value: number }
    | { type: 'empty' };
  state: 'opened' | 'unopened' | 'flagged';
};

export function isMine(
  cell: CellData,
): cell is CellData & { content: { type: 'mine'; exploded: boolean } } {
  return cell.content.type === 'mine';
}

export function isCount(
  cell: CellData,
): cell is CellData & { content: { type: 'count'; value: number } } {
  return cell.content.type === 'count';
}

export function isEmpty(cell: CellData): cell is CellData & { content: { type: 'empty' } } {
  return cell.content.type === 'empty';
}

export function isOpened(cell: CellData): cell is CellData & { state: 'opened' } {
  return cell.state === 'opened';
}

export function isFlagged(cell: CellData): cell is CellData & { state: 'flagged' } {
  return cell.state === 'flagged';
}

export type Board = {
  meta: BoardConfig;
  data: CellData[][];
};

const makePlainBoard = (config: BoardConfig): Board => {
  const { rows, cols } = config;
  const plainBoardData: CellData[] = [...Array(rows * cols)].map((_, i) => {
    return {
      id: i,
      content: { type: 'empty' },
      state: 'unopened',
    };
  });

  return {
    meta: config,
    data: convertToMatrix(plainBoardData, rows, cols),
  };
};

export const setMines = (
  board: Board,
  forceEmpty: CellData['id'] | undefined = undefined,
): Board => {
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

  const boardWithMines: Board = {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        return minePositions.includes(cell.id)
          ? { ...cell, content: { type: 'mine', exploded: false } }
          : cell;
      });
    }),
  };

  return setMineCount(boardWithMines);
};

// 周囲の爆弾の数を数える
const setMineCount = (board: Board): Board => {
  // matrixの要素を一つずつ見ていく
  const newBoardData: CellData[][] = board.data.map((row, i) => {
    return row.map((cell, j) => {
      // 爆弾だったら何もしない
      if (isMine(cell)) return cell;

      // 周囲8マスの爆弾の数を数える
      const count = getAroundItems(board.data, [i, j]).filter((item) => isMine(item)).length;
      return {
        ...cell,
        content: count === 0 ? { type: 'empty' } : { type: 'count', value: count },
      };
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
          return { ...cell, state: 'opened' };
        }
        return cell;
      });
    }),
  };
};

// 何もないマスを一括開放する
const openEmptyArea = (board: Board, selected: [number, number]): Board => {
  const selectedCell = board.data[selected[0]][selected[1]];
  if (isOpened(selectedCell) || !isEmpty(selectedCell)) return board;

  // flood fill
  let queue = [selected];
  let newBoard = board;

  // TODO: 効率化
  while (queue.length > 0) {
    const target = queue.shift() as [number, number];
    newBoard = open(newBoard, target);

    // 何もないマスだったら周囲のマスをキューに追加
    if (isEmpty(newBoard.data[target[0]][target[1]])) {
      getAroundItems(newBoard.data, target)
        .filter((cell) => !isOpened(cell) && !isMine(cell))
        .forEach((cell) => {
          queue.push(toMarixPosition(cell.id, newBoard.meta.cols));
        });
    }
  }

  return newBoard;
};

// NOTE: PlainBoard型を作ってもいいかも
export const initBoard = (options: BoardConfig): Board => {
  return makePlainBoard(options);
};

export const openCell = (board: Board, cellId: number): Either<string, Board> => {
  const position = toMarixPosition(cellId, board.meta.cols);

  const targetCell = board.data[position[0]][position[1]];

  if (!isInside(position, board.data)) {
    return { kind: 'Left', value: 'Invalid position' };
  }

  if (isOpened(targetCell)) {
    return { kind: 'Left', value: 'Cell already opened' };
  }

  if (isMine(targetCell)) {
    return { kind: 'Left', value: 'Mine Exploded' };
  }

  const updatedBoard = isEmpty(targetCell) ? openEmptyArea(board, position) : open(board, position);

  return { kind: 'Right', value: updatedBoard };
};

export const openAll = (board: Board): Board => {
  return {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        return { ...cell, state: 'opened' };
      });
    }),
  };
};

export const igniteMines = (board: Board): Board => {
  return {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        return isMine(cell) ? { ...cell, content: { ...cell.content, exploded: true } } : cell;
      });
    }),
  };
};

export const toggleFlag = (board: Board, cellId: number): Board => {
  const updatedBoard: Board = {
    ...board,
    data: board.data.map((row) => {
      return row.map((cell) => {
        if (cell.id !== cellId || isOpened(cell)) return cell;
        return { ...cell, state: isFlagged(cell) ? 'unopened' : 'flagged' };
      });
    }),
  };

  return updatedBoard;
};

export const isAllOpened = (board: Board): boolean => {
  return board.data.flat().every((cell) => {
    return isMine(cell) || isOpened(cell); // 爆弾以外のマスが全て開いていたら勝利
  });
};

export const countFlags = (board: Board) => board.data.flat().filter(isFlagged).length;
