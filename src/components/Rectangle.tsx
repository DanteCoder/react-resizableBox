import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { OnDragMouseDown } from '../types';
import { LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface RectangleProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  draggable: boolean;
  onDragMouseDown?: OnDragMouseDown;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}

export const Rectangle = (props: RectangleProps) => {
  const { draggable, onDragMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    document.body.style.cursor = 'grabbing';
    onDragMouseDown?.(e);
  };

  return <div className={styles.rectangle} {...props} onMouseDown={draggable ? onMouseDownHandler : undefined} />;
};
