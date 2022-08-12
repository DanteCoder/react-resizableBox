import React, { MouseEventHandler } from 'react';
import { OnRotateMouseDown } from '../types';
import RotateArrow from '../icons/RotateArrow.svg';
import styles from './ResizableBox.module.css';
import { CSSProperties } from 'react';
import { captureClick, LEFT_MOUSE_BUTTON } from '../utils';

interface Props {
  left: number;
  top: number;
  rotationDeg: number;
  onRotateMouseDown?: OnRotateMouseDown;
  svgFilter?: CSSProperties['filter'];
}

export const RotateHandler = (props: Props) => {
  const { left, top, rotationDeg, onRotateMouseDown, svgFilter } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    captureClick();
    onRotateMouseDown?.(e);
  };

  return (
    <div
      onMouseDown={onMouseDownHandler}
      className={styles.rotateHandler}
      style={{
        left,
        top,
        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
      }}
    >
      <img style={{ filter: svgFilter }} src={RotateArrow} alt="Rotate" />
    </div>
  );
};
