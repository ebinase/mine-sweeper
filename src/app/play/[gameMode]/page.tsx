'use client';

import PlayGround from '@/features/PlayGround';
import { GAME_MODE_LIST, GameMode } from '@/features/PlayGround/hooks/useMineSweeper';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    gameMode: GameMode;
  };
};

export default function Play({ params }: Props) {
  const router = useRouter();
  const { gameMode } = params;

  // ゲームモードの文字列が不正な場合は404を返す
  if (!GAME_MODE_LIST.includes(gameMode)) {
    router.replace('/404');
  }

  return (
    <main className='flex h-full w-full flex-col items-center'>
      <PlayGround defaultGameMode={gameMode}></PlayGround>
    </main>
  );
}
