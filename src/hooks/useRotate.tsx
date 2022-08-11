import { MouseEventHandler, useCallback, useRef } from 'react';
import { DeltaRot, OnRotateEndHandler, OnRotateHandler, OnRotateMouseDown, OnRotateStartHandler, StylePos, StyleRot, StyleSize } from '../types';
import { deg2Rad, vectorAngle } from '../utils';

interface Props {
  styles: StylePos & StyleSize & StyleRot;
  topOffset: number;
  onRotateStart?: OnRotateStartHandler;
  onRotate?: OnRotateHandler;
  onRotateEnd?: OnRotateEndHandler;
}

const useRotate = (props: Props) => {
  const { styles } = props;
  const isMouseDown = useRef(false);
  const isRotating = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newRotation = useRef(styles.rotationDeg);
  const prevRotation = useRef(styles.rotationDeg);
  const totalDelta = useRef<DeltaRot>({ deg: 0 });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      isMouseDown.current = true;
      startMousePos.current = { x: e.clientX, y: e.clientY };
      startStyles.current = styles;
      prevRotation.current = styles.rotationDeg;
      totalDelta.current = { deg: 0 };

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        if (!isRotating.current) props.onRotateStart?.();
        isRotating.current = true;

        const mouseDelta = {
          deltaX: clientX - startMousePos.current.x,
          deltaY: clientY - startMousePos.current.y,
        };

        newRotation.current = getNewRotation(mouseDelta, startStyles.current, props.topOffset, e.shiftKey);

        const delta = {
          deg: newRotation.current - prevRotation.current,
        };

        prevRotation.current = newRotation.current;

        totalDelta.current = {
          deg: newRotation.current - startStyles.current.rotationDeg,
        };

        props.onRotate?.({ style: { rotationDeg: newRotation.current }, delta, totalDelta: totalDelta.current });
      };

      const onMouseUp = (_e: MouseEvent) => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isRotating) props.onRotateEnd?.({ style: { rotationDeg: newRotation.current }, totalDelta: totalDelta.current });
        isMouseDown.current = false;
        isRotating.current = false;
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [props, styles]
  );

  return [isMouseDown.current, onMouseDown] as [boolean, OnRotateMouseDown];
};

const getNewRotation = (
  delta: { deltaX: number; deltaY: number },
  styles: { top: number; left: number; width: number; height: number; rotationDeg: number },
  offsetTop: number,
  isShiftKey: boolean
) => {
  const rotationRad = deg2Rad(styles.rotationDeg);
  const startX = (styles.height / 2 - offsetTop) * Math.sin(rotationRad);
  const startY = -(styles.height / 2 - offsetTop) * Math.cos(rotationRad);
  const endX = startX + delta.deltaX;
  const endY = startY + delta.deltaY;

  const deltaAngle = ((vectorAngle(endX, endY) - vectorAngle(startX, startY)) * 180) / Math.PI;
  let newAngle = Math.round(deltaAngle + styles.rotationDeg);

  if (isShiftKey) {
    newAngle = Math.round(newAngle / 45) * 45;
  }

  return newAngle;
};

export default useRotate;
