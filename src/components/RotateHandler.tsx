import React, { MouseEventHandler } from 'react';
import { OnRotateMouseDown } from '../types';
import RotateArrow from '../icons/RotateArrow.svg';
import styles from './ResizableBox.module.css';

interface Props {
  left: number;
  top: number;
  rotationDeg: number;
  onMouseDown?: OnRotateMouseDown;
}

export const RotateHandler = (props: Props) => {
  const { left, top, rotationDeg, onMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const captureClick = (e: MouseEvent) => {
      e.stopPropagation();
      requestAnimationFrame(() => {
        document.removeEventListener('click', captureClick, true);
      });
    };

    document.addEventListener('click', captureClick, true);
    onMouseDown?.(e);
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
      <img src={RotateArrow} alt="Rotate" />
    </div>
  );
};
