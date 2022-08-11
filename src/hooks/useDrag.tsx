import { useCallback, useState } from 'react';
import { MouseEventHandler, useRef } from 'react';
import { OnDrag, OnDragEnd } from '../types';

interface Props {
  styles: {
    left: number;
    top: number;
  };
  scale: number;
  onDragStart?: VoidFunction;
  onDrag?: OnDrag;
  onDragEnd?: OnDragEnd;
}

const useDrag = (props: Props) => {
  const { styles, scale } = props;
  const isMouseDown = useRef(false);
  const isDragging = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newStyle = useRef(styles);
  const totalDelta = useRef({ deltaX: 0, deltaY: 0 });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      isMouseDown.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      prevPos.current = startPos.current;
      startStyles.current = props.styles;
      newStyle.current = startStyles.current;
      totalDelta.current = { deltaX: 0, deltaY: 0 };

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        if (!isDragging.current) props.onDragStart?.();
        isDragging.current = true;
        setIsDraggingState(true);

        const delta = {
          deltaX: (clientX - prevPos.current.x) / scale,
          deltaY: (clientY - prevPos.current.y) / scale,
        };

        prevPos.current = {
          x: clientX,
          y: clientY,
        };

        totalDelta.current = {
          deltaX: (clientX - startPos.current.x) / scale,
          deltaY: (clientY - startPos.current.y) / scale,
        };

        newStyle.current = {
          left: Math.round(startStyles.current.left + totalDelta.current.deltaX),
          top: Math.round(startStyles.current.top + totalDelta.current.deltaY),
        };

        props.onDrag?.({ ...newStyle.current, ...delta });
      };

      const onMouseUp = (_e: MouseEvent) => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isDragging.current) props.onDragEnd?.({ ...newStyle.current, ...totalDelta.current });
        isMouseDown.current = false;
        isDragging.current = false;
        setIsDraggingState(false);
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [props, scale]
  );

  return [isMouseDown.current, isDraggingState, onMouseDown] as [boolean, boolean, MouseEventHandler<HTMLDivElement>];
};

export default useDrag;
