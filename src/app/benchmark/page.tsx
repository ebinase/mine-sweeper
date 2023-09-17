'use client';

import {
  Board,
  initBoard,
  oldOpenEmptyArea,
  openEmptyArea,
  setMines,
} from '@/features/PlayGround/functions/board';
import { toMarixPosition } from '@/features/PlayGround/functions/matrix';
import React, { useState } from 'react';

// N回実行して平均を取る
const benchmark = (N: number, pre: () => Board, process: (board: Board) => any) => {
  let total = 0;
  for (let i = 0; i < N; i++) {
    // 前処理は実行時間から除外
    const board = pre();
    // 実行時間計測
    const start = performance.now();
    process(board);
    const end = performance.now();

    total += end - start;
  }
  const average = total / N;
  // 小数点以下3桁まで表示
  return Number(average.toFixed(3));
};

const targetPositionId = 0;
const makeBoard = (size: number) => {
  return setMines(
    initBoard({
      rows: 5,
      cols: size,
      mines: 1,
    }),
    targetPositionId,
  );
};

const BenchmarkPage: React.FC = () => {
  const [result, setResult] = useState<number[][]>([]);

  const handleClick = () => {
    const tmp: number[][] = [];
    for (let i = 5; i <= 13; i++) {
      console.log(i);

      // 毎回爆弾の位置をランダムに変える
      const before = benchmark(
        10,
        () => makeBoard(i),
        (board) => oldOpenEmptyArea(board, toMarixPosition(targetPositionId, board.meta.cols)),
      );

      const after = benchmark(
        10,
        () => makeBoard(i),
        (board) => openEmptyArea(board, toMarixPosition(targetPositionId, board.meta.cols)),
      );

      tmp.push([before, after]);
    }

    setResult(tmp);
  };

  console.log(result);

  const max = Math.max(...result.flat());

  return (
    <div className='p-3'>
      <h1>benchmark</h1>
      <button onClick={handleClick}>execute</button>
      <div className='pt-5'>
        {result.map((score, i) => (
          <div key={i} className='flex gap-1 items-center'>
            <div className='w-24 text-xs'>
              <span>5 ✕ {i + 5}</span>
            </div>
            <div>
              {score.map((item, j) => {
                const color = j === 0 ? 'bg-red-600' : 'bg-blue-500';
                return (
                  <div key={j} className='flex items-center gap-1'>
                    <div
                      className={color}
                      style={{ width: `${((item / max) * 60).toFixed(2)}vw`, height: '5px' }}
                    ></div>
                    <span className='text-xs'>{item}ms</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenchmarkPage;
