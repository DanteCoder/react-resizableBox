export const deltaLength = (dx: number, dy: number) => Math.sqrt(dx * dx + dy * dy);
export const vectorAngle = (dx: number, dy: number) => Math.atan2(dy, dx);
export const deg2Rad = (deg: number) => (deg * Math.PI) / 180;
export const topLeft2Center = (top: number, left: number, width: number, height: number) => ({
  x: left + width / 2,
  y: top + height / 2,
});
export const center2TopLeft = (centerX: number, centerY: number, width: number, height: number) => ({
  left: centerX - width / 2,
  top: centerY - height / 2,
});
