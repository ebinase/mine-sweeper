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

const directions = [-1, +1, -8, +8, -9, +9, -7, +7];

const random = () => Math.floor(Math.random() * 64);

const bombPositions = Array(10)
  .fill(null)
  .map(() => random());

type Board = Array<{ isOpen: boolean; isBomb: boolean; value: number | null }>;

const board: Board = [...Array(64)].map((_, j) => {
  const isBomb = bombPositions.includes(j);
  return {
    isOpen: false,
    isBomb,
    value: null,
  };
});

const getBombCount = (board: Board): Board => {
  return board.map((i, j) => {
    if (board[j].isBomb) {
      return i;
    }

    let count = 0;
    for (const direction of directions) {
      if (board[j + direction]?.isBomb) count++;
    }
    return { ...i, value: count };
  });
};

const open = (board: Board, index: number): Board => {
  return board.map((i, j) => {
    if (j === index) return { ...i, isOpen: true };
    return i;
  });
};

// 何もないマスを一括開放する
const openEmptyArea = (board: Board, index: number): Board => {
  if (board[index].isOpen || board[index].value !== 0) return board;

  // flood fill
  let newBoard = board;
  let queue = [index];

  while (queue.length > 0) {
    const target = queue.shift() as number;

    newBoard = open(newBoard, target);

    console.log(target,newBoard[target].value, newBoard[target].value === 0);

    // 何もないマスだったら周囲のマスをキューに追加
    if (newBoard[target].value === 0) {
      for (const direction of directions) {
        const index = target + direction;
        if (!!newBoard[index] && !newBoard[index].isBomb && !newBoard[index].isOpen) {
          queue.push(index);
        }
      }
    }
  }

  return newBoard;
};

const PlayGround = () => {
  const [isOver, setIsOver] = useState(false);
  const [boardData, setBoard] = useState<Board>(getBombCount(board));

  const handleClick = (index: number) => {

    // ゲームが終了していたら何もしない
    if (isOver) return;
    // すでに開いていたら何もしない
    if (boardData[index].isOpen) return;

    // 爆弾を踏んだらゲームオーバー
    if (boardData[index].isBomb) {
      alert('💣💥');
      const newBoard = boardData.map((i) => (i.isBomb ? { ...i, isOpen: true } : i));
      setBoard(newBoard);
      setIsOver(true);
      return;
    }

    setBoard(boardData[index].value === 0 ? openEmptyArea(boardData, index) : open(boardData, index));
  };

  return (
    <div>
      <h1>Mine Sweeper</h1>
      <div className='grid grid-cols-8 bg-cyan-800 gap-1 p-2'>
        {boardData.map((i, j) => {
          return (
            <div
            suppressHydrationWarning
              key={j}
              className={
                'w-20 h-20 text-black flex justify-center items-center ' +
                (i.isOpen ? (i.isBomb ? 'bg-red-800' : 'bg-slate-50') : 'bg-slate-400')
              }
              onClick={() => handleClick(j)}
            >
             {j+':'} {i.value ===0 ? '🐶' : i.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayGround;
