import { useCallback } from 'react';
import { useRef } from 'react';
import { HandlerType, OnResize, OnResizeMouseDown } from '../types';
import { center2TopLeft, deg2Rad, deltaLength, topLeft2Center, vectorAngle } from '../utils';

interface Props {
  styles: {
    left: number;
    top: number;
    width: number;
    height: number;
    rotationDeg: number;
  };
  scale: number;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: boolean | number;
  onResizeStart?: VoidFunction;
  onResize?: OnResize;
  onResizeEnd?: VoidFunction;
}

const useResize = (props: Props) => {
  const { styles, scale, minWidth = 10, minHeight = 10, aspectRatio = false } = props;
  const isMouseDown = useRef(false);
  const handlerType = useRef<HandlerType>('n');
  const startPos = useRef({ x: 0, y: 0 });
  const startStyles = useRef(styles);

  const onMouseDown: OnResizeMouseDown = useCallback(
    (e, type) => {
      isMouseDown.current = true;
      handlerType.current = type;
      startPos.current = { x: e.clientX, y: e.clientY };
      startStyles.current = styles;
      props.onResizeStart?.();

      const onMouseMove = (e: MouseEvent) => {
        if (!isMouseDown.current) return;
        e.stopImmediatePropagation();
        const { clientX, clientY } = e;

        const delta = {
          deltaX: (clientX - startPos.current.x) / scale,
          deltaY: (clientY - startPos.current.y) / scale,
        };

        const newStyle = getNewStyle(
          handlerType.current,
          startStyles.current,
          delta,
          minWidth,
          minHeight,
          aspectRatio || e.shiftKey,
          e.altKey
        );

        props.onResize?.(newStyle);
      };

      const onMouseUp = (_e: MouseEvent) => {
        if (!isMouseDown.current) return;
        isMouseDown.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        props.onResizeEnd?.();
      };

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    },
    [aspectRatio, minHeight, minWidth, props, scale, styles]
  );

  return [isMouseDown.current, onMouseDown] as [boolean, OnResizeMouseDown];
};

const getNewStyle = (
  type: HandlerType,
  initStyle: { top: number; left: number; width: number; height: number; rotationDeg: number },
  delta: { deltaX: number; deltaY: number },
  minWidth: number,
  minHeight: number,
  aspectRatio: boolean | number,
  symetrical: boolean
) => {
  const deltaL = deltaLength(delta.deltaX, delta.deltaY);
  const alpha = vectorAngle(delta.deltaX, delta.deltaY);
  const rotationRad = deg2Rad(initStyle.rotationDeg);
  const relativeAngle = alpha - rotationRad;

  // Calculate deltaWidth and deltaHeight on cursor displacement
  let [deltaWidth, deltaHeight] = (() => {
    let deltaWidth = 0;
    let deltaHeight = 0;

    if (type.match('w')) deltaWidth = -deltaL * Math.cos(relativeAngle);
    if (type.match('e')) deltaWidth = deltaL * Math.cos(relativeAngle);
    if (type.match('n')) deltaHeight = -deltaL * Math.sin(relativeAngle);
    if (type.match('s')) deltaHeight = deltaL * Math.sin(relativeAngle);

    return [deltaWidth, deltaHeight];
  })();

  // Apply symetry
  (() => {
    if (!symetrical) return;
    if (type.match(/w|e/)) deltaWidth *= 2;
    if (type.match(/n|s/)) deltaHeight *= 2;
  })();

  const resizeRatio = typeof aspectRatio === 'number' ? aspectRatio : initStyle.width / initStyle.height;

  // Apply aspect ratio
  (() => {
    if (!aspectRatio) return;
    if (type.match(/n|s/)) deltaWidth = deltaHeight * resizeRatio;
    if (type.match(/w|e/)) deltaHeight = deltaWidth / resizeRatio;
  })();

  let newWidth = Math.abs(initStyle.width + deltaWidth);
  let newHeight = typeof aspectRatio !== 'number' ? Math.abs(initStyle.height + deltaHeight) : newWidth * resizeRatio;

  // Constrain new size to minWidth and minHeight
  (() => {
    if (newWidth >= minWidth) return;
    newWidth = minWidth;
    deltaWidth = minWidth - initStyle.width;
    if (!aspectRatio) return;
    newHeight = minWidth / resizeRatio;
    deltaHeight = deltaWidth / resizeRatio;
  })();
  (() => {
    if (newHeight >= minHeight) return;
    newHeight = minHeight;
    deltaHeight = minHeight - initStyle.height;
    if (!aspectRatio) return;
    newWidth = minHeight * resizeRatio;
    deltaWidth = deltaHeight * resizeRatio;
  })();

  const { x: centerX, y: centerY } = topLeft2Center(initStyle.top, initStyle.left, initStyle.width, initStyle.height);

  // Calculates the center displacement
  const [centerDX, centerDY] = (() => {
    if (symetrical) return [0, 0];
    let centerDY = 0;
    let centerDX = 0;

    if (type.match('w')) {
      centerDX += -(deltaWidth / 2) * Math.cos(rotationRad);
      centerDY += -(deltaWidth / 2) * Math.sin(rotationRad);
    }
    if (type.match('e')) {
      centerDX += (deltaWidth / 2) * Math.cos(rotationRad);
      centerDY += (deltaWidth / 2) * Math.sin(rotationRad);
    }
    if (type.match('n')) {
      centerDX += (deltaHeight / 2) * Math.sin(rotationRad);
      centerDY += -(deltaHeight / 2) * Math.cos(rotationRad);
    }
    if (type.match('s')) {
      centerDX += -(deltaHeight / 2) * Math.sin(rotationRad);
      centerDY += (deltaHeight / 2) * Math.cos(rotationRad);
    }

    return [centerDX, centerDY];
  })();

  const newCenterX = centerX + centerDX;
  const newCenterY = centerY + centerDY;
  const newPos = center2TopLeft(newCenterX, newCenterY, newWidth, newHeight);

  const newStyle = {
    left: Math.round(newPos.left),
    top: Math.round(newPos.top),
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };

  return newStyle;
};

export default useResize;
