'use client';

import { toMarixPosition } from '../../functions/matrix';
import Cell from '../Cell';
import { MineSweeper } from '../../hooks/useMineSweeper';
import { useEffect, useRef, useState } from 'react';

type Props = Pick<MineSweeper, 'board' | 'open' | 'toggleFlag' | 'switchFlagType'> & {
  zoom: boolean;
};

const Board: React.FC<Props> = ({ board, open, toggleFlag, switchFlagType, zoom }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomConfig, setZoomConfig] = useState({
    scale: 1,
    origin: { x: 'center', y: 'top' },
  });

  useEffect(() => {
    // TODO: もっとわかりやすいUIにする
    const container = containerRef.current;
    if (!container) return;
    // 盤面サイズが正しく図れるようにする
    container.classList.remove('p-2');
    // スクロール可能な場合は見た目が分かりやすくなるようpaddingを追加する
    const isScrollable = container.scrollHeight > container.clientHeight;
    if (isScrollable) {
      container.classList.add('p-2');
    }
  }, [board.meta]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isScrollable = (scrollLength: number, clientLength: number) =>
      scrollLength > clientLength;

    // 現在のスクロール位置に応じて拡大縮小の基準点を変更する
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const scrollPercentX = isScrollable(scrollWidth, clientWidth)
      ? (scrollLeft / (scrollWidth - clientWidth)) * 100
      : 50;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentY = isScrollable(scrollHeight, clientHeight)
      ? (scrollTop / (scrollHeight - clientHeight)) * 100
      : 50;

    const scale = zoom
      ? 1
      : scrollHeight > scrollWidth // 全体が収まるように縦横の長い方に合わせる
      ? clientHeight / scrollHeight - 0.01
      : clientWidth / scrollWidth - 0.01;

    console.log({
      scale,
      origin: {
        x: `${scrollPercentX}%`,
        y: `${scrollPercentY}%`,
      },
    });

    setZoomConfig({
      scale,
      origin: {
        x: `${scrollPercentX}%`,
        y: `${scrollPercentY}%`,
      },
    });
  }, [zoom]);

  return (
    <section
      className={
        'overflow-auto max-w-[90vw] max-h-[55vh] md:max-h-[62vh] xl:max-h-[70vh] bg-black/50  dark:bg-white/50 select-none'
      }
      ref={containerRef}
    >
      <div
        className={'w-fit h-fit bg-slate-700 grid gap-1 p-2'}
        style={{
          gridTemplateColumns: `repeat(${board.meta.cols}, 1fr)`,
          gridTemplateRows: `repeat(${board.meta.rows}, 1fr)`,

          transformOrigin: `${zoomConfig.origin.x} ${zoomConfig.origin.y}`,
          transform: `scale(${zoomConfig.scale})`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {board.data.flat().map((cell) => {
          const [row, col] = toMarixPosition(cell.id, board.meta.cols);
          return (
            <Cell
              key={cell.id}
              cell={cell}
              row={row}
              col={col}
              handleClick={open}
              toggleFlag={toggleFlag}
              switchFlagType={switchFlagType}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Board;
