// Keep all game images in the initial bundle so revealing a cell needs no image request.
import flag from './flag.png?inline';
import mine from './mine.svg?inline';
import explodedMine from './mine_explode.svg?inline';

export const gameImages = { flag, mine, explodedMine } as const;
