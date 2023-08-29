'use client';

import { useEffect, useState } from 'react';
import Cell from './Cell';
import { getRandomElements } from '@/functions/random';
import confetti from 'canvas-confetti';

// グローバルメニュー
// TODO: タイマー
// TODO: リセットボタン
// TODO: 絵文字
// TODO: 難易度選択

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
type MatrixBoard = CellData[][];

const bombPositions = getRandomElements(
  [...Array(64)].map((_, j) => j),
  10,
);

const initialBoard: Board = [...Array(64)].map((_, j) => {
  const isBomb = bombPositions.includes(j);
  return {
    isOpen: false,
    isBomb,
    value: null,
  };
});

const generateRandomBoard = () => {
  const matrix = convert(initialBoard);
  return getBombCount(matrix);
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
  console.log('openEmptyArea');
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

type GameState = 'playing' | 'win' | 'lose';

const isWin = (board: MatrixBoard): boolean => {
  return board.flat().every((cell) => {
    return cell.isBomb || cell.isOpen; // 爆弾以外のマスが全て開いていたら勝利
  });
};

const PlayGround = () => {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [board, setBoard] = useState<MatrixBoard>(
    [...Array(64)].fill({
      isOpen: false,
      isBomb: false,
      value: 1,
    } as CellData),
  );

  useEffect(() => {
    const randomBoard = generateRandomBoard();
    setBoard(randomBoard);
  }, []);

  // TODO: 画面更新前にアラートが出てしまうので修正する
  useEffect(() => {
    if (gameState === 'lose') {
      alert('💣💥');
    }
  }, [gameState]);

  const handleClick = (index: number) => {
    const position = convertIndex(index);
    const targetCell = board[position[0]][position[1]];

    // ゲームが終了していたら何もしない
    if (gameState !== 'playing') return;
    // すでに開いていたら何もしない
    if (targetCell.isOpen) return;

    // 爆弾を踏んだらゲームオーバー
    if (targetCell.isBomb) {
      setBoard(openAll(board));
      setGameState('lose');
      return;
    }

    const updatedBoard =
      targetCell.value === 0 ? openEmptyArea(board, position) : open(board, position);

    if (isWin(updatedBoard)) {
      setGameState('win');
      setBoard(openAll(board));
      return;
    } else {
      setBoard(updatedBoard);
    }
  };

  type Side = 'L' | 'R';
  useEffect(() => {
    if (gameState !== 'win') return;

    const showConfetti = (side: Side) => {
      confetti({
        // 激しいアニメーションが苦手なユーザーに対しては無効にする
        // See https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-reduced-motion
        disableForReducedMotion: true,
        zIndex: -100,
        origin: {
          x: (Math.floor(Math.random() * 7) + 1) / 10 + (side === 'L' ? -0.3 : 0.3),
          y: Math.random() - 0.3,
        },
        startVelocity: 20,
        ticks: 400,
        spread: 360,
      });
    };

    showConfetti('L');
    showConfetti('R');
    (function loop(side: Side = 'L') {
      showConfetti(side);
      setTimeout(() => loop(side === 'L' ? 'R' : 'L'), 2500 + Math.random() * 500);
    })();
  }, [gameState]);
  return (
    <div>
      <h1>Mine Sweeper - Classic {gameState === 'win' && '🎉🎉🎉'}</h1>
      <div className='w-[90vmin] h-[90vmin] md:w-[60vmin] md:h-[60vmin] grid grid-cols-8 grid-rows-[8] bg-slate-700 md:gap-2 gap-1 p-2'>
        {board.flat().map((cell, j) => {
          return (
            <Cell
              key={j}
              cell={cell}
              handleClick={() => handleClick(j)}
              isFailed={gameState === 'lose'}
            ></Cell>
          );
        })}
      </div>
    </div>
  );
};

export default PlayGround;
