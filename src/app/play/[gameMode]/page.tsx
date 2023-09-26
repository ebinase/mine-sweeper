'use client';

import PlayGround from '@/features/PlayGround';
import { GAME_MODE_LIST, GameMode } from '@/features/PlayGround/hooks/useMineSweeper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  params: {
    gameMode: GameMode;
  };
};

export default function Play({ params }: Props) {
  const router = useRouter();
  const { gameMode } = params;

  const isValidGameMode = GAME_MODE_LIST.includes(gameMode);

  useEffect(() => {
    // ゲームモードの文字列が不正な場合は404を返す
    if (!isValidGameMode) {
      router.replace('/404');
    }
  }, [isValidGameMode, router]);


  return (
    <main className='flex h-full w-full flex-col items-center'>
      {isValidGameMode ? <PlayGround defaultGameMode={gameMode}></PlayGround> : null}
    </main>
  );
}
