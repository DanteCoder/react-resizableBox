import { CSSProperties } from 'react';

export const LEFT_MOUSE_BUTTON = 0;

export const vectorLength = (x: number, y: number) => Math.sqrt(x * x + y * y);
export const vectorAngle = (x: number, y: number) => Math.atan2(y, x);
export const deg2Rad = (deg: number) => (deg * Math.PI) / 180;
export const topLeft2Center = (top: number, left: number, width: number, height: number) => ({
  x: left + width / 2,
  y: top + height / 2,
});
export const center2TopLeft = (centerX: number, centerY: number, width: number, height: number) => ({
  left: centerX - width / 2,
  top: centerY - height / 2,
});

const resizeCursors: { [key: number]: CSSProperties['cursor'] } = {
  0: 'n-resize',
  45: 'ne-resize',
  90: 'e-resize',
  135: 'se-resize',
  180: 's-resize',
  225: 'sw-resize',
  270: 'w-resize',
  315: 'nw-resize',
  360: 'n-resize',
};

export const resizeHandlerCursor = (rotationDeg: number) => {
  const modulus = rotationDeg % 360;
  const angle = modulus < 0 ? modulus + 360 : modulus;
  const rounded = Math.round(angle / 45) * 45;
  return resizeCursors[rounded];
};

/**
 * Stops the next click event propagation
 */
export const captureClick = () => {
  const onClickHandler = (e: MouseEvent) => {
    e.stopPropagation();
    requestAnimationFrame(() => {
      document.removeEventListener('click', onClickHandler, true);
    });
  };

  document.addEventListener('click', onClickHandler, true);
};
