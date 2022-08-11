import React, { CSSProperties, MouseEventHandler } from 'react';
import { HandlerType, OnResizeMouseDown } from '../types';
import styles from './ResizableBox.module.css';

interface Props {
  left: number;
  top: number;
  type: HandlerType;
  color?: CSSProperties['color'];
  onMouseDown?: OnResizeMouseDown;
}

export const ResizeHandler = (props: Props) => {
  const { left, top, type, onMouseDown, color } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    const captureClick = (e: MouseEvent) => {
      e.stopPropagation();
      requestAnimationFrame(() => {
        document.removeEventListener('click', captureClick, true);
      });
    };

    document.addEventListener('click', captureClick, true);
    onMouseDown?.(e, type);
  };

  return <div onMouseDown={onMouseDownHandler} className={styles.resizeHandler} style={{ left, top, color }}></div>;
};
