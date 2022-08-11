import { MouseEventHandler } from 'react';

export type OnDrag = (e: { top: number; left: number; deltaX: number; deltaY: number }) => void;
export type OnDragEnd = (e: { top: number; left: number; deltaX: number; deltaY: number }) => void;
export type OnResize = (e: { top: number; left: number; width: number; height: number }) => void;
export type OnRotate = (rotationDeg: number) => void;

export type HandlerType = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';
export type OnDragMouseDown = MouseEventHandler<HTMLDivElement>;
export type OnResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: HandlerType) => void;
export type OnRotateMouseDown = MouseEventHandler<HTMLDivElement>;
