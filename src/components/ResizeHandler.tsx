import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { ResizeHandlerType, OnResizeMouseDown } from '../types';
import { captureClick, LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface ResizeHandlerProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: ResizeHandlerType;
  onResizeMouseDown?: OnResizeMouseDown;
}

export const ResizeHandler = (props: ResizeHandlerProps) => {
  const { style, type, onResizeMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    captureClick();
    document.body.style.cursor = style?.cursor ?? 'auto';
    onResizeMouseDown?.(e, type);
  };

  return <div className={styles.resizeHandler} {...props} onMouseDown={onMouseDownHandler} />;
};
