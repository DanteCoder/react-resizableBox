import React, { MouseEventHandler, useEffect } from 'react';
import { OnDragMouseDown } from '../types';
import MoveArrows from '../icons/MoveArrows.svg';
import './ResizableBox.css';

interface Props {
  left: number;
  top: number;
  rotationDeg: number;
  draggable: boolean;
  isDragging: boolean;
  onMouseDown: OnDragMouseDown;
}

export const MoveHandler = (props: Props) => {
  const { left, top, rotationDeg, draggable, isDragging, onMouseDown } = props;

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

  const onMouseDownHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const captureClick = (e: MouseEvent) => {
      e.stopPropagation();
      requestAnimationFrame(() => {
        document.removeEventListener('click', captureClick, true);
      });
    };

    document.addEventListener('click', captureClick, true);
    onMouseDown?.(e);
  };
  return (
    <div
      onMouseDown={draggable ? onMouseDownHandler : undefined}
      className={'moveHandler'}
      style={{
        left,
        top,
        transform: `translate(-50%, -50%) rotate(${-rotationDeg}deg)`,
      }}
    >
      <img src={MoveArrows} alt="Move" />
    </div>
  );
};
