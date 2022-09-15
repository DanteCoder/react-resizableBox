import { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import {
  DeltaPos,
  DeltaRot,
  OnRotateEndHandler,
  OnRotateHandler,
  OnRotateMouseDown,
  OnRotateStartHandler,
  StylePos,
  StyleRot,
  StyleSize,
} from '../types';
import { captureClick, topLeft2Center, vectorAngle } from '../utils';

interface UseRotateProps {
  styles: StylePos & StyleSize & StyleRot;
  resizableRef: RefObject<HTMLDivElement>;
  snapAngle: number | boolean;
  onRotateStart?: OnRotateStartHandler;
  onRotate?: OnRotateHandler;
  onRotateEnd?: OnRotateEndHandler;
}

const useRotate = (props: UseRotateProps): [OnRotateMouseDown, boolean] => {
  const { styles } = props;
  const isMouseDown = useRef(false);
  const isRotating = useRef(false);
  const resizableCenter = useRef({ x: 0, y: 0 });
  const startMousePos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);
  const newRotation = useRef(styles.rotationDeg);
  const prevRotation = useRef(styles.rotationDeg);
  const totalDelta = useRef<DeltaRot>({ deg: 0 });

  const [_isRotating, setIsRotating] = useState(false);

  const snapAngle = useMemo((): number | undefined => {
    if (typeof props.snapAngle === 'boolean') return undefined;
    if (props.snapAngle === 0) return undefined;
    return props.snapAngle;
  }, []);

  const onMouseDown: OnRotateMouseDown = useCallback(
    (e) => {
      isMouseDown.current = true;
      startMousePos.current = { x: e.clientX, y: e.clientY };
      startStyles.current = styles;
      prevRotation.current = styles.rotationDeg;
      totalDelta.current = { deg: 0 };

      const clientRect = props.resizableRef.current?.getBoundingClientRect();
      if (!clientRect) return;
      resizableCenter.current = topLeft2Center(clientRect.y, clientRect.x, clientRect.width, clientRect.height);

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        if (!isRotating.current) {
          captureClick();
          props.onRotateStart?.();
        }
        isRotating.current = true;
        setIsRotating(true);

        const mouseDelta = {
          x: clientX - startMousePos.current.x,
          y: clientY - startMousePos.current.y,
        };

        newRotation.current = getNewRotation(
          startMousePos.current,
          resizableCenter.current,
          mouseDelta,
          startStyles.current,
          e.shiftKey ? snapAngle : undefined
        );

        const delta = {
          deg: newRotation.current - prevRotation.current,
        };

        prevRotation.current = newRotation.current;

        totalDelta.current = {
          deg: newRotation.current - startStyles.current.rotationDeg,
        };

        props.onRotate?.({ style: { rotationDeg: newRotation.current }, delta, totalDelta: totalDelta.current, nativeEvent: e });
      };

      const onMouseUp = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isRotating) props.onRotateEnd?.({ style: { rotationDeg: newRotation.current }, totalDelta: totalDelta.current, nativeEvent: e });
        isMouseDown.current = false;
        isRotating.current = false;
        setIsRotating(false);
        document.body.style.cursor = 'auto';
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [props, styles]
  );

  return [onMouseDown, _isRotating];
};

const getNewRotation = (startMousePos: DeltaPos, rotationCenter: DeltaPos, mouseDelta: DeltaPos, startStyles: StyleRot, snapAngle?: number) => {
  const startVector = {
    x: startMousePos.x - rotationCenter.x,
    y: startMousePos.y - rotationCenter.y,
  };
  const endVector = {
    x: startVector.x + mouseDelta.x,
    y: startVector.y + mouseDelta.y,
  };

  const startVectorAngle = vectorAngle(startVector.x, startVector.y);
  const endVectorAngle = vectorAngle(endVector.x, endVector.y);
  const deltaAngle = ((endVectorAngle - startVectorAngle) * 180) / Math.PI;

  let newAngle = Math.round(startStyles.rotationDeg + deltaAngle);

  if (snapAngle != null) {
    newAngle = Math.round(newAngle / snapAngle) * snapAngle;
  }

  return newAngle;
};

export default useRotate;
