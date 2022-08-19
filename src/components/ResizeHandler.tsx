import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { ResizeHandlerType, OnResizeMouseDown } from '../types';
import { LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface ResizeHandlerProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  type: ResizeHandlerType;
  onResizeMouseDown?: OnResizeMouseDown;
}

export const ResizeHandler = (props: ResizeHandlerProps) => {
  const { type, onResizeMouseDown, ...htmlProps } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    document.body.style.cursor = props.style?.cursor ?? 'auto';
    onResizeMouseDown?.(e, type);
  };

  return <div className={styles.resizeHandler} {...htmlProps} onMouseDown={onMouseDownHandler} />;
};
