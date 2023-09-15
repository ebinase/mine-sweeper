'use client';

import React from 'react';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';
import { CellData } from '../../functions/board';

type Props = {
  cell: CellData;
  handleClick: (id: number) => void;
  isFailed: boolean;
  toggleFlag: (id: number) => void;
};

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false, toggleFlag }) => {
  return (
    <div className={'flex justify-center items-center aspect-square w-[8vmin] md:w-[6vmin]'}>
      {cell.isOpen ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <UnopenedCell cell={cell} handleClick={handleClick} toggleFlag={toggleFlag} />
      )}
    </div>
  );
};

export default Cell;
