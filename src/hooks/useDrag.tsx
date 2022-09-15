import { useCallback, useState } from 'react';
import { useRef } from 'react';
import { DeltaPos, OnDragHandler, OnDragEndHandler, OnDragStartHandler, StylePos, OnDragMouseDown } from '../types';
import { captureClick } from '../utils';

interface UseDragProps {
  styles: StylePos;
  scale: number;
  onDragStart?: OnDragStartHandler;
  onDrag?: OnDragHandler;
  onDragEnd?: OnDragEndHandler;
}

const useDrag = (props: UseDragProps): [OnDragMouseDown, boolean] => {
  const { styles, scale } = props;
  const isMouseDown = useRef(false);
  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newStyle = useRef(styles);
  const totalPosDelta = useRef<DeltaPos>({ x: 0, y: 0 });

  const [_isDragging, setIsDragging] = useState(false);

  const onMouseDown: OnDragMouseDown = useCallback(
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

        if (!isDragging.current) {
          captureClick();
          props.onDragStart?.();
        }
        isDragging.current = true;
        setIsDragging(true);

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

        props.onDrag?.({ style: newStyle.current, delta: mouseDelta, totalDelta: totalPosDelta.current, nativeEvent: e });
      };

      const onMouseUp = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isDragging.current) props.onDragEnd?.({ style: newStyle.current, totalDelta: totalPosDelta.current, nativeEvent: e });
        isMouseDown.current = false;
        isDragging.current = false;
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [props, scale]
  );

  return [onMouseDown, _isDragging];
};

export default useDrag;
