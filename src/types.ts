import { MouseEventHandler } from 'react';

/**
 * A position.
 */
export type StylePos = { left: number; top: number };
/**
 * A size.
 */
export type StyleSize = { width: number; height: number };
/**
 * A rotation.
 */
export type StyleRot = { rotationDeg: number };
/**
 * A change in position.
 */
export type DeltaPos = { x: number; y: number };
/**
 * A change in size.
 */
export type DeltaSize = { w: number; h: number };
/**
 * A change in rotation.
 */
export type DeltaRot = { deg: number };

/**
 * A function to handle the start of a drag.
 */
export type OnDragStartHandler = VoidFunction;
/**
 * A function to handle a drag event.
 */
export type OnDragHandler = (e: { style: StylePos; delta: DeltaPos; totalDelta: DeltaPos; nativeEvent: MouseEvent }) => void;
/**
 * A function to handle the end of a drag.
 */
export type OnDragEndHandler = (e: { style: StylePos; totalDelta: DeltaPos; nativeEvent: MouseEvent }) => void;

/**
 * A function to handle the start of a resize.
 */
export type OnResizeStartHandler = (e: { resizeDirection: ResizeHandlerType }) => void;
/**
 * A function to handle a resize event.
 */
export type OnResizeHandler = (e: {
  style: StylePos & StyleSize;
  delta: DeltaPos & DeltaSize;
  totalDelta: DeltaPos & DeltaSize;
  resizeDirection: ResizeHandlerType;
  nativeEvent: MouseEvent;
}) => void;
/**
 * A function to handle the end of a resize.
 */
export type OnResizeEndHandler = (e: {
  style: StylePos & StyleSize;
  totalDelta: DeltaPos & DeltaSize;
  resizeDirection: ResizeHandlerType;
  nativeEvent: MouseEvent;
}) => void;

/**
 * A function to handle the start of a rotation.
 */
export type OnRotateStartHandler = VoidFunction;
/**
 * A function to handle a rotation event.
 */
export type OnRotateHandler = (e: { style: StyleRot; delta: DeltaRot; totalDelta: DeltaRot; nativeEvent: MouseEvent }) => void;
/**
 * A function to handle the end of a rotation.
 */
export type OnRotateEndHandler = (e: { style: StyleRot; totalDelta: DeltaRot; nativeEvent: MouseEvent }) => void;

/**
 * The direction of a resize handler.
 */
export type ResizeHandlerType = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

export type OnDragMouseDown = MouseEventHandler<HTMLDivElement>;
export type OnResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: ResizeHandlerType) => void;
export type OnRotateMouseDown = MouseEventHandler<HTMLDivElement>;
