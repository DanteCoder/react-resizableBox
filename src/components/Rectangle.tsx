import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { OnDragMouseDown } from '../types';
import { LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface RectangleProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  draggable: boolean;
  onDragMouseDown: OnDragMouseDown;
}

export const Rectangle = (props: RectangleProps) => {
  const { draggable, onDragMouseDown, ...htmlProps } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    onDragMouseDown?.(e);
  };

  return <div className={styles.rectangle} {...htmlProps} onMouseDown={draggable ? onMouseDownHandler : undefined} />;
};
