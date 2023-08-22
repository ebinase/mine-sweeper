'use client';

import React, { useState, useRef } from 'react';
import { CellData } from './PlayGround';

type Props = {
  cell: CellData;
  handleClick: () => void;
  isFailed: boolean;
};

const RIGHT_CLICK_EVENT = 2 as const;

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false }) => {
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  // フラグの状態は左クリック長押しと右クリックで切り替える
  const [isFlagged, setIsFlagged] = useState(false);

  const handleMouseDown = () => {
    setIsLongPress(false);
    // 200ミリ秒後にsetIsLongPressをtrueに設定
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setIsFlagged(!isFlagged); // 時間経過後に自動でフラグを切り替える
    }, 500);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (!isLongPress) {
      // 長押しされていた場合はクリックとはみなさない
      handleClick();
    }

    // 長押し状態をリセットする
    setIsLongPress(false);
  };

  return (
    <div
      className={
        'w-20 h-20 text-black flex justify-center items-center text-lg ' +
        (cell.isOpen ? (cell.isBomb ? 'bg-red-800 text-4xl' : 'bg-slate-50') : 'bg-slate-500')
      }
      onMouseDown={(e) => e.button !== RIGHT_CLICK_EVENT && handleMouseDown()} // 右クリックで開放してしまうのを防ぐ
      onMouseUp={(e) => e.button !== RIGHT_CLICK_EVENT && handleMouseUp()}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsFlagged(!isFlagged);
      }}
    >
      {cell.isOpen 
      ? (cell.isBomb ? (isFailed ? '💥' : '💣') : cell.value)
      : isFlagged && '🚩'
      }
    </div>
  );
};

export default Cell;
