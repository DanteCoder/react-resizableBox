import React, { CSSProperties, MouseEventHandler } from 'react';
import { OnDragMouseDown } from '../types';
import { captureClick, LEFT_MOUSE_BUTTON } from '../utils';
import styles from './ResizableBox.module.css';

interface Props {
  width: number;
  height: number;
  draggable: boolean;
  onDragMouseDown?: OnDragMouseDown;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
}

export const Rectangle = (props: Props) => {
  const { width, height, draggable, onDragMouseDown } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    e.stopPropagation();
    captureClick();
    onDragMouseDown?.(e);
  };

  return (
    <div
      onMouseDown={draggable ? onMouseDownHandler : undefined}
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
