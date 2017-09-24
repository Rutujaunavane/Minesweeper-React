import React, { Component } from 'react';
import CellStyle from './Cell.css';

const rightButton = (event, props) => {
  event.preventDefault();
  props.setMark(props.rowIndex, props.colIndex);
}

const leftButton = (props) => {
  props.revealCells(props.rowIndex, props.colIndex);
}

const Cell = (props) => {
  let cellClass = CellStyle.boardcell
  if (props.cell.value === 'X' || props.cell.value === '?') {
    cellClass += ` ${CellStyle.markedcell}`
  }
  return (
    <div className={cellClass} onClick={(e) => leftButton(props)} onContextMenu={(e) => rightButton(e, props)}>
      {props.cell.value}
    </div>
  );
}

export default Cell;
