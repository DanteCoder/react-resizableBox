import React, { MouseEventHandler } from 'react';
import { OnDragMouseDown } from '../types';
import MoveArrows from '../icons/MoveArrows.svg';
import styles from './ResizableBox.module.css';
import { CSSProperties } from 'react';
import { captureClick, LEFT_MOUSE_BUTTON } from '../utils';

interface Props {
  left: number;
  top: number;
  rotationDeg: number;
  onDragMouseDown: OnDragMouseDown;
  svgFilter?: CSSProperties['filter'];
}

export const MoveHandler = (props: Props) => {
  const { left, top, rotationDeg, onDragMouseDown, svgFilter } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    captureClick();
    onDragMouseDown?.(e);
  };

  return (
    <div
      onMouseDown={onMouseDownHandler}
      className={styles.moveHandler}
      style={{
        left,
        top,
        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
      }}
    >
      <img style={{ filter: svgFilter }} src={MoveArrows} alt="Move" />
    </div>
  );
};
