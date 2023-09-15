'use client';

import React from 'react';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';
import { CellData } from '../../functions/board';

type Props = {
  cell: CellData;
  isFailed: boolean;
  handleClick: (index: number) => void;
  toggleFlag: (index: number) => void;
};

const Cell: React.FC<Props> = ({ cell, isFailed = false, handleClick, toggleFlag }) => {
  return (
    <div className={'flex justify-center items-center aspect-square w-[8vmin] md:w-[6vmin]'}>
      {cell.isOpen ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <UnopenedCell
          cell={cell}
          handleClick={() => handleClick(cell.id)}
          toggleFlag={() => toggleFlag(cell.id)}
        />
      )}
    </div>
  );
};

export default React.memo(Cell);
