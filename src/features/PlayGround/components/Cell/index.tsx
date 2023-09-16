'use client';

import React from 'react';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';
import { CellData, isOpened } from '../../functions/board';

type Props = {
  cell: CellData;
  isFailed: boolean;
  handleClick: (index: number) => void;
  toggleFlag: (index: number) => void;
  switchFlagType: (id: number) => void;
};

const Cell: React.FC<Props> = ({
  cell,
  isFailed = false,
  handleClick,
  toggleFlag,
  switchFlagType,
}) => {
  return (
    <div className={'flex justify-center items-center aspect-square w-[8vmin] md:w-[6vmin]'}>
      {isOpened(cell) ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <UnopenedCell
          cell={cell}
          handleClick={() => handleClick(cell.id)}
          toggleFlag={() => toggleFlag(cell.id)}
          switchFlagType={() => switchFlagType(cell.id)}
        />
      )}
    </div>
  );
};

export default React.memo(Cell);
