'use client';

import React from 'react';
import { CellData } from '../..';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';

type Props = {
  cell: CellData;
  handleClick: () => void;
  isFailed: boolean;
};

const Cell: React.FC<Props> = ({ cell, handleClick, isFailed = false }) => {
  return (
    <div className={'flex justify-center items-center aspect-square select-none'}>
      {cell.isOpen ? (
        <OpenedCell cell={cell} isExploded={isFailed} />
      ) : (
        <UnopenedCell handleClick={handleClick} />
      )}
    </div>
  );
};

export default Cell;
