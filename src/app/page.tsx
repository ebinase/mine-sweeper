import PlayGround from '@/features/PlayGround';

export default function Home() {
  return (
    <main className='flex h-full w-full flex-col items-center'>
      <PlayGround defaultGameMode={'easy'}></PlayGround>
    </main>
  );
}
