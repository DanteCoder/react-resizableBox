import React, { CSSProperties, MouseEventHandler } from 'react';
import { ResizeHandlerType, OnResizeMouseDown } from '../types';
import { captureClick, LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface Props {
  left: number;
  top: number;
  type: ResizeHandlerType;
  color?: CSSProperties['color'];
  onResizeMouseDown?: OnResizeMouseDown;
}

export const ResizeHandler = (props: Props) => {
  const { left, top, type, onResizeMouseDown, color } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    captureClick();
    onResizeMouseDown?.(e, type);
  };

  return <div onMouseDown={onMouseDownHandler} className={styles.resizeHandler} style={{ left, top, color }} />;
};
