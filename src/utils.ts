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

const resizeCursors: CSSProperties['cursor'][] = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];

export const getResizeCursors = (rotationDeg: number) => {
  const topPosition = Math.round(rotationDeg / 45);
  const absTopPosition = topPosition < 0 ? topPosition + 8 : topPosition;
  return {
    n: resizeCursors[absTopPosition % 8],
    ne: resizeCursors[(absTopPosition + 1) % 8],
    e: resizeCursors[(absTopPosition + 2) % 8],
    se: resizeCursors[(absTopPosition + 3) % 8],
    s: resizeCursors[(absTopPosition + 4) % 8],
    sw: resizeCursors[(absTopPosition + 5) % 8],
    w: resizeCursors[(absTopPosition + 6) % 8],
    nw: resizeCursors[(absTopPosition + 7) % 8],
  };
};

const sign = (num: number) => (num >= 0 ? 1 : -1);

export const getParametricPos = (width: number, height: number, rotationDeg: number, offsetWidth: number, offsetHeight: number) => {
  const angle = deg2Rad(rotationDeg);
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const tan = Math.tan(angle);

  const parametricWidth = width + 2 * offsetWidth;
  const parametricHeight = height + 2 * offsetHeight;

  let x = 0;
  let y = 0;

  x = (parametricHeight / 2) * tan * sign(cos);
  y = (parametricHeight / 2) * sign(-cos);

  if (Math.abs(x) > parametricWidth / 2) {
    x = (parametricWidth / 2) * sign(x);
    y = (parametricWidth / 2) * (1 / tan) * sign(-sin);
  }

  return {
    left: x + width / 2,
    top: y + height / 2,
  };
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
