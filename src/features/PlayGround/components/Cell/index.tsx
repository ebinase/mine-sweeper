'use client';

import React from 'react';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';
import { CellData } from '../../hooks/useBoard';

type Props = {
  cell: CellData;
  handleClick: (id: number) => void;
  isFailed: boolean;
};

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false }) => {
  return (
    <div className={'flex justify-center items-center aspect-square select-none'}>
      {cell.isOpen ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <UnopenedCell cell={cell} handleClick={handleClick} />
      )}
    </div>
  );
};

export default Cell;
