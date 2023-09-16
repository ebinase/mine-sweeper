'use client';

import Image from 'next/image';
import { BoardConfig } from '../../functions/board';

type Props = {
    normalFlags: number;
    suspectedFlags: number;
    boardConfig: BoardConfig;
};

export const Header: React.FC<Props> = ({normalFlags, suspectedFlags, boardConfig}) => {
    return (
        <header className='flex justify-between items-center py-0.5'>
        <h1>Mine Sweeper</h1>
        <div className='flex gap-2'>
          <div className='flex items-center'>
            <Image src='/flag.png' alt='flag' width={15} height={15} />
            <span className='text-xs'>×{normalFlags}</span>
          </div>
          <div className='flex items-center'>
            <Image src='/mine.svg' alt='exploded mine' width={15} height={15} />
            <span className='text-xs'>×{boardConfig.mines}</span>
          </div>
        </div>
      </header>
    );
};