import { MouseEventHandler, useCallback, useRef } from 'react';
import { OnRotate, OnRotateMouseDown } from '../types';
import { deg2Rad, vectorAngle } from '../utils';

interface Props {
  styles: {
    top: number;
    left: number;
    width: number;
    height: number;
    rotationDeg: number;
  };
  topOffset: number;
  onRotateStart?: VoidFunction;
  onRotate?: OnRotate;
  onRotateEnd?: OnRotate;
}

const useRotate = (props: Props) => {
  const { styles } = props;
  const isMouseDown = useRef(false);
  const isRotating = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newRotation = useRef(styles.rotationDeg);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      isMouseDown.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startStyles.current = styles;

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        if (!isRotating.current) props.onRotateStart?.();
        isRotating.current = true;

        const delta = {
          deltaX: clientX - startPos.current.x,
          deltaY: clientY - startPos.current.y,
        };

        newRotation.current = getNewRotation(delta, startStyles.current, props.topOffset, e.shiftKey);

        props.onRotate?.(newRotation.current);
      };

      const onMouseUp = (_e: MouseEvent) => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isRotating) props.onRotateEnd?.(newRotation.current);
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
