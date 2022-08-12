import { useCallback } from 'react';
import { MouseEventHandler, useRef } from 'react';
import { DeltaPos, OnDragHandler, OnDragEndHandler, OnDragStartHandler, StylePos } from '../types';

interface Props {
  styles: StylePos;
  scale: number;
  onDragStart?: OnDragStartHandler;
  onDrag?: OnDragHandler;
  onDragEnd?: OnDragEndHandler;
}

const useDrag = (props: Props) => {
  const { styles, scale } = props;
  const isMouseDown = useRef(false);
  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newStyle = useRef(styles);
  const totalPosDelta = useRef<DeltaPos>({ x: 0, y: 0 });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      isMouseDown.current = true;
      startMousePos.current = { x: e.clientX, y: e.clientY };
      prevMousePos.current = startMousePos.current;

      startStyles.current = props.styles;
      newStyle.current = startStyles.current;

      totalPosDelta.current = { x: 0, y: 0 };

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        if (!isDragging.current) props.onDragStart?.();
        isDragging.current = true;

        const mouseDelta = {
          x: (clientX - prevMousePos.current.x) / scale,
          y: (clientY - prevMousePos.current.y) / scale,
        };

        prevMousePos.current = {
          x: clientX,
          y: clientY,
        };

        totalPosDelta.current = {
          x: (clientX - startMousePos.current.x) / scale,
          y: (clientY - startMousePos.current.y) / scale,
        };

        newStyle.current = {
          left: Math.round(startStyles.current.left + totalPosDelta.current.x),
          top: Math.round(startStyles.current.top + totalPosDelta.current.y),
        };

        props.onDrag?.({ style: newStyle.current, delta: mouseDelta, totalDelta: totalPosDelta.current });
      };

      const onMouseUp = () => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isDragging.current) props.onDragEnd?.({ style: newStyle.current, totalDelta: totalPosDelta.current });
        isMouseDown.current = false;
        isDragging.current = false;
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [props, scale]
  );

  return onMouseDown;
};

export default useDrag;
