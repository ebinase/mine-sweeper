'use client';

import React from 'react';
import OpenedCell from './OpenedCell';
import UnopenedCell from './UnopenedCell';
import { CellData } from '../../functions/board';
import { Action } from '../../hooks/usePlayGround';

type Props = {
  cell: CellData;
  dispatch: React.Dispatch<Action>;
  isFailed: boolean;
};

const Cell: React.FC<Props> = ({ cell, dispatch, isFailed = false }) => {
  const handleClick = () => dispatch({ type: 'open', index: cell.id });
  const toggleFlag = () => dispatch({ type: 'toggleFlag', index: cell.id });
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

export default React.memo(Cell);
