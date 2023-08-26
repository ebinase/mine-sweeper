'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CellData } from './PlayGround';
import Image from 'next/image';
import { useLongPress } from 'react-use';

type Props = {
  cell: CellData;
  handleClick: () => void;
  isFailed: boolean;
};

const RIGHT_CLICK_EVENT = 2 as const;

const COLOR_MAP: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-purple-600',
  5: 'text-yellow-600',
  6: 'text-pink-600',
  7: 'text-slate-600',
  8: 'text-gray-600',
} as const;

const resolveColor = (value: number) => {
  return value in COLOR_MAP ? COLOR_MAP[value] : 'text-black';
};

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false }) => {
    // フラグの状態は左クリック長押しと右クリックで切り替える
  const [isFlagged, setIsFlagged] = useState(false);

const onLongPress = () => {
    console.log('onLongPress');
    setIsFlagged(!isFlagged);
  };

  const defaultOptions = {
    isPreventDefault: true, // クリックイベントを使用するため
    delay: 200,
  };
  const longPressEvent = useLongPress(onLongPress, defaultOptions);

  return (
    <div
      className={
        'text-black flex justify-center items-center text-lg shadow-[2px_2px_2px_#444,-1px_-1px_1px_#fff] aspect-square select-none ' +
        (cell.isOpen ? (cell.isBomb ? 'bg-red-800 text-4xl' : 'bg-slate-50') : 'bg-slate-500')
      }
      onClick={handleClick}
      {...longPressEvent}
      onContextMenu={(e) => {
        e.preventDefault();
        if (e.button === RIGHT_CLICK_EVENT) {
          setIsFlagged(!isFlagged);
        }
      }}
    >
      {cell.isOpen ? (
        cell.isBomb ? (
          isFailed ? (
            <Image src='/mine_explode.svg' alt='exploded mine' width={30} height={30} />
          ) : (
            <Image src='/mine.svg' alt='mine' width={30} height={30} />
          )
        ) : (
          <span className={resolveColor(cell.value as number)}>{cell.value !== 0 ? cell.value : ''}</span>
        )
      ) : (
        isFlagged && <Image src='/flag.png' alt='red flag' width={30} height={30} />
      )}
    </div>
  );
};

export default Cell;
