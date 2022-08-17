import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { OnDragMouseDown } from '../types';
import { MoveArrows } from '../icons/MoveArrows';
import styles from './ResizableBox.module.css';
import { LEFT_MOUSE_BUTTON } from '../utils';

interface MoveHandlerProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  rotationDeg: number;
  onDragMouseDown: OnDragMouseDown;
}

export const MoveHandler = (props: MoveHandlerProps) => {
  const { style, rotationDeg, onDragMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    onDragMouseDown?.(e);
  };

  return (
    <div
      className={styles.moveHandler}
      {...props}
      style={{
        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
        ...style,
      }}
      onMouseDown={onMouseDownHandler}
    >
      <MoveArrows />
    </div>
  );
};
