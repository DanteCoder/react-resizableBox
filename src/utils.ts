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
