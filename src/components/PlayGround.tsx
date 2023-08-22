'use client';

import { useState } from 'react';

// basic
// TODO: 何もないマスの一括開放(flood fill)
// TODO: クリアしたときの処理
// TODO: フラグ設置機能
// TODO: CSS修正
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
        [1, 1]
      ];

const random = () => Math.floor(Math.random() * 64);

const isInside = (position: Array<number>) => {
  const rows = 8;
  const cols = 8;
  const [row, col] = position;
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

const bombPositions = Array(10)
  .fill(null)
  .map(() => random());

type Cell = { isOpen: boolean; isBomb: boolean; value: number | null }
type Board = Array<Cell>;
type MatrixBoard = Cell[][];

const initialBoard: Board = [...Array(64)].map((_, j) => {
  const isBomb = bombPositions.includes(j);
  return {
    isOpen: false,
    isBomb,
    value: null,
  };
});

// 一次元の盤面の配列を二次元に変換する
const convert = (board: Board): MatrixBoard => {
  const newBoard: Cell[][] = [];
  for (let i = 0; i < 8; i++) {
    newBoard.push(board.slice(i * 8, i * 8 + 8));
  }
  return newBoard;
}

// 一次元配列の座標を二次元配列の座標に変換する
const convertIndex = (index: number): [number, number] => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return [row, col];
}

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
        if (isInside(position) && !newBoard[position[0]][position[1]].isBomb && !newBoard[position[0]][position[1]].isOpen) {
          queue.push(position);
        }
      }
    }
  }

  return newBoard;
};

const PlayGround = () => {
  const [isOver, setIsOver] = useState(false);
  const [board, setBoard] = useState<MatrixBoard>(getBombCount(convert(initialBoard)));

  const handleClick = (index: number) => {
    const position = convertIndex(index);
    const targetCell = board[position[0]][position[1]];

    // ゲームが終了していたら何もしない
    if (isOver) return;
    // すでに開いていたら何もしない
    if (targetCell.isOpen) return;

    // 爆弾を踏んだらゲームオーバー
    if (targetCell.isBomb) {
      alert('💣💥');
      const newBoard = board.flat().map((i) => ({ ...i, isOpen: true }));
      setBoard(convert(newBoard));
      setIsOver(true);
      return;
    }

    setBoard(targetCell.value === 0 ? openEmptyArea(board, position) : open(board, position));
  };

  return (
    <div>
      <h1>Mine Sweeper</h1>
      <div className='grid grid-cols-8 bg-cyan-800 gap-1 p-2'>
        {board.flat().map((cell, j) => {
          return (
            <div
              key={j}
              className={
                'w-20 h-20 text-black flex justify-center items-center ' +
                (cell.isBomb ? 'bg-red-800' : 'bg-slate-50')
              }
              onClick={() => handleClick(j)}
            >
             {cell.isOpen ? cell.value : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayGround;
