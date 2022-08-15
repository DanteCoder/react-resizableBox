import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { OnRotateMouseDown } from '../types';
import { RotateArrow } from '../icons/RotateArrow';
import styles from './ResizableBox.module.css';
import { LEFT_MOUSE_BUTTON } from '../utils';

interface RotateHandlerProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  rotationDeg: number;
  onRotateMouseDown?: OnRotateMouseDown;
}

export const RotateHandler = (props: RotateHandlerProps) => {
  const { style, rotationDeg, onRotateMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'grabbing';
    onRotateMouseDown?.(e);
  };

  return (
    <div
      className={styles.rotateHandler}
      {...props}
      style={{
        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
        ...style,
      }}
      onMouseDown={onMouseDownHandler}
    >
      <RotateArrow />
    </div>
  );
};
