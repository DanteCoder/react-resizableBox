import { CSSProperties } from 'react';

export const LEFT_MOUSE_BUTTON = 0;

/**
 * Calculates the length of a vector.
 * @param x - The x component of the vector
 * @param y - The y component of the vector
 */
export const vectorLength = (x: number, y: number) => Math.sqrt(x * x + y * y);

/**
 * Calculates the angle of a vector.
 * @param x - The x component of the vector
 * @param y - The y component of the vector
 */
export const vectorAngle = (x: number, y: number) => Math.atan2(y, x);

/**
 * Converts degrees to radians.
 * @param deg - The degrees
 */
export const deg2Rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Calculates the center of a rectangle.
 * @param top - The top position of the rectangle
 * @param left - The left position of the rectangle
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 */
export const topLeft2Center = (top: number, left: number, width: number, height: number) => ({
  x: left + width / 2,
  y: top + height / 2,
});

/**
 * Calculates the top left corner of a rectangle.
 * @param centerX - The center x position of the rectangle
 * @param centerY - The center y position of the rectangle
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 */
export const center2TopLeft = (centerX: number, centerY: number, width: number, height: number) => ({
  left: centerX - width / 2,
  top: centerY - height / 2,
});

/**
 * Rotates a point around another point by a certain angle.
 * @param originX - The x coordinate of the origin
 * @param originY - The y coordinate of the origin
 * @param pointX - The x coordinate of the point to rotate
 * @param pointY - The y coordinate of the point to rotate
 * @param angleDeg - The angle in degrees to rotate the point by
 */
export const rotatePoint = (originX: number, originY: number, pointX: number, pointY: number, angleDeg: number) => {
  const angleRad = deg2Rad(angleDeg);
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const newX = (pointX - originX) * cos - (pointY - originY) * sin + originX;
  const newY = (pointX - originX) * sin + (pointY - originY) * cos + originY;
  return { left: newX, top: newY };
};

/**
 * The resize cursors.
 */
const resizeCursors: CSSProperties['cursor'][] = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];

/**
 * Returns the corresponding resize cursor for a given rotation.
 * @param rotationDeg - The rotation in degrees
 */
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

/**
 * Returns the sign of a number.
 * @param num - The number
 */
const sign = (num: number) => (num >= 0 ? 1 : -1);

/**
 * Calculates the parametric position of an object around a rectangle.
 * The object will be centered on the rectangle, with the specified angle
 * measured from the vertical, and the specified offsets, measured from the
 * edges of the rectangle.
 *
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param rotationDeg - The polar position of the object
 * @param offsetWidth - The horizontal offset from the edges
 * @param offsetHeight - The vertical offset from the edges
 */
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
