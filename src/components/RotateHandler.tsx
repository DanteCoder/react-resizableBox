import React, { DetailedHTMLProps, MouseEventHandler } from 'react';
import { OnRotateMouseDown } from '../types';
import { RotateArrow } from '../icons/RotateArrow';
import styles from './ResizableBox.module.css';
import { LEFT_MOUSE_BUTTON } from '../utils';

interface RotateHandlerProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onRotateMouseDown?: OnRotateMouseDown;
}

export const RotateHandler = (props: RotateHandlerProps) => {
  const { onRotateMouseDown, ...htmlProps } = props;

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== LEFT_MOUSE_BUTTON) return;
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    onRotateMouseDown?.(e);
  };

  return (
    <div
      className={styles.rotateHandler}
      {...htmlProps}
      style={{
        transform: `translate(-50%, -50%)`,
        ...props.style,
      }}
      onMouseDown={onMouseDownHandler}
    >
      <RotateArrow />
    </div>
  );
};
