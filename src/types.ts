import { MouseEventHandler } from 'react';

export type StylePos = { left: number; top: number };
export type StyleSize = { width: number; height: number };
export type StyleRot = { rotationDeg: number };
export type DeltaPos = { x: number; y: number };
export type DeltaSize = { w: number; h: number };
export type DeltaRot = { deg: number };

export type OnDragStartHandler = VoidFunction;
export type OnDragHandler = (e: { style: StylePos; delta: DeltaPos; totalDelta: DeltaPos; nativeEvent: MouseEvent }) => void;
export type OnDragEndHandler = (e: { style: StylePos; totalDelta: DeltaPos; nativeEvent: MouseEvent }) => void;

export type OnResizeStartHandler = VoidFunction;
export type OnResizeHandler = (e: {
  style: StylePos & StyleSize;
  delta: DeltaPos & DeltaSize;
  totalDelta: DeltaPos & DeltaSize;
  nativeEvent: MouseEvent;
}) => void;
export type OnResizeEndHandler = (e: { style: StylePos & StyleSize; totalDelta: DeltaPos & DeltaSize; nativeEvent: MouseEvent }) => void;

export type OnRotateStartHandler = VoidFunction;
export type OnRotateHandler = (e: { style: StyleRot; delta: DeltaRot; totalDelta: DeltaRot; nativeEvent: MouseEvent }) => void;
export type OnRotateEndHandler = (e: { style: StyleRot; totalDelta: DeltaRot; nativeEvent: MouseEvent }) => void;

export type ResizeHandlerType = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';
export type OnDragMouseDown = MouseEventHandler<HTMLDivElement>;
export type OnResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: ResizeHandlerType) => void;
export type OnRotateMouseDown = MouseEventHandler<HTMLDivElement>;
