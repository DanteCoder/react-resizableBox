import React, { CSSProperties, MouseEventHandler, useEffect } from 'react';
import { OnDragMouseDown } from '../types';
import styles from './ResizableBox.module.css';

interface Props {
  width: number;
  height: number;
  draggable: boolean;
  isDragging: boolean;
  onMouseDown?: OnDragMouseDown;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}

export const Rectangle = (props: Props) => {
  const { width, height, draggable, isDragging, onMouseDown } = props;

  useEffect(() => {
    if (!isDragging) return;
    const captureClick = (e: MouseEvent) => {
      e.stopPropagation();
      requestAnimationFrame(() => {
        document.removeEventListener('click', captureClick, true);
      });
    };
    document.addEventListener('click', captureClick, true);
  }, [isDragging]);

  return (
    <div
      onMouseDown={draggable ? onMouseDown : undefined}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      className={styles.rectangle}
      style={{
        width,
        height,
        ...props.style,
      }}
    />
  );
};
