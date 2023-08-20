'use client';

import { useState } from 'react';

// basic
// TODO: 爆弾を踏んだときの処理
// TODO: 何もないマスの一括開放(flood fill)
// TODO: クリアしたときの処理
// TODO: フラグ設置機能
// TODO: CSS修正
// グローバルメニュー
// TODO: タイマー
// TODO: リセットボタン
// TODO: 絵文字
// TODO: 難易度選択

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
    };

    let count = 0;
    if (board[j - 1]?.isBomb) count++;
    if (board[j + 1]?.isBomb) count++;
    if (board[j - 8]?.isBomb) count++;
    if (board[j + 8]?.isBomb) count++;
    if (board[j - 9]?.isBomb) count++;
    if (board[j + 9]?.isBomb) count++;
    if (board[j - 7]?.isBomb) count++;
    if (board[j + 7]?.isBomb) count++;
    return { ...i, value: count };
  });
};

const PlayGround = () => {
  const [boardData, setBoard] = useState<Board>(board);

  const open = (index: number) => {
    const newBoard = boardData.map((i, j) => {
      if (j === index) return { ...i, isOpen: true };
      return i;
    });
    setBoard(newBoard);
  };

  return (
    <div>
      <h1>Mine Sweeper</h1>
      <div className='grid grid-cols-8 bg-cyan-800 gap-1 p-2'>
        {getBombCount(boardData).map((i, j) => {
          return (
            <div
              key={j}
              className={
                'w-20 h-20 text-black flex justify-center items-center ' +
                (i.isOpen ? (i.isBomb ? 'bg-red-800' : 'bg-slate-50') : 'bg-slate-400')
              }
              onClick={() => open(j)}
            >
              {i.isOpen ? i.value : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayGround;
