import React, { CSSProperties, DetailedHTMLProps, useMemo, useRef } from 'react';
import {
  OnDragHandler,
  OnDragEndHandler,
  OnResizeHandler,
  OnRotateHandler,
  OnDragStartHandler,
  OnResizeStartHandler,
  OnResizeEndHandler,
  OnRotateStartHandler,
  OnRotateEndHandler,
} from '../types';
import classnames from 'classnames';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';
import useRotate from '../hooks/useRotate';
import { Rectangle } from './Rectangle';
import { MoveHandler } from './MoveHandler';
import { ResizeHandler } from './ResizeHandler';
import { RotateHandler } from './RotateHandler';
import { getParametricPos, getResizeCursors } from '../utils';
import styles from './ResizableBox.module.css';

export interface ResizableBoxProps extends Omit<DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onDrag' | 'onDragEnd'> {
  width: number;
  height: number;
  left: number;
  top: number;
  rotationDeg?: number;
  scale?: number;
  color?: CSSProperties['color'];
  draggable?: boolean;
  dragHandler?: boolean;
  dragHandlerDeg?: number;
  resizable?: boolean;
  aspectRatio?: boolean | number;
  rotatable?: boolean;
  snapAngle?: number | boolean;
  rotateHandlerDeg?: number;
  minWidth?: number;
  minHeight?: number;
  handlersOffset?: number;
  handlersSpaceOut?: number;
  relativeHandlers?: boolean;
  onDragStart?: OnDragStartHandler;
  onDrag?: OnDragHandler;
  onDragEnd?: OnDragEndHandler;
  onResizeStart?: OnResizeStartHandler;
  onResize?: OnResizeHandler;
  onResizeEnd?: OnResizeEndHandler;
  onRotateStart?: OnRotateStartHandler;
  onRotate?: OnRotateHandler;
  onRotateEnd?: OnRotateEndHandler;
}

export const ResizableBox = (props: ResizableBoxProps) => {
  const {
    width,
    height,
    left,
    top,
    rotationDeg = 0,
    scale = 1,
    color,
    draggable = true,
    dragHandler = false,
    dragHandlerDeg = 180,
    resizable = true,
    aspectRatio = false,
    rotatable = true,
    snapAngle = 45,
    rotateHandlerDeg = 0,
    minWidth = 10,
    minHeight = 10,
    handlersOffset = 20,
    handlersSpaceOut = 50,
    relativeHandlers = true,
    onDragStart,
    onDrag,
    onDragEnd,
    onResizeStart,
    onResize,
    onResizeEnd,
    onRotateStart,
    onRotate,
    onRotateEnd,
    ...htmlProps
  } = props;

  const resizableRef = useRef<HTMLDivElement>(null);
  const [onDragMouseDown, isDragging] = useDrag({
    styles: { left, top },
    scale,
    onDragStart,
    onDrag,
    onDragEnd,
  });
  const [onResizeMouseDown, isResizing] = useResize({
    styles: { left, top, width, height, rotationDeg },
    scale,
    minHeight,
    minWidth,
    aspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
  });
  const [onRotateMouseDown, isRotating] = useRotate({
    styles: { top, left, width, height, rotationDeg },
    resizableRef,
    snapAngle,
    onRotateStart,
    onRotate,
    onRotateEnd,
  });

  const offsets = useMemo(
    () => ({
      left: width < handlersSpaceOut ? (handlersSpaceOut - width) / 2 : 0,
      top: height < handlersSpaceOut ? (handlersSpaceOut - height) / 2 : 0,
    }),
    [width, height, handlersSpaceOut]
  );

  const rotateHandlerPos = useMemo(() => {
    return {
      ...getParametricPos(
        width,
        height,
        rotateHandlerDeg - (relativeHandlers ? 0 : rotationDeg),
        handlersOffset + offsets.left,
        handlersOffset + offsets.top
      ),
    };
  }, [isRotating, width, height, rotateHandlerDeg, relativeHandlers, handlersOffset, offsets]);

  const dragHandlerPos = useMemo(() => {
    return {
      ...getParametricPos(
        width,
        height,
        dragHandlerDeg - (relativeHandlers ? 0 : rotationDeg),
        handlersOffset + offsets.left,
        handlersOffset + offsets.top
      ),
    };
  }, [isRotating, width, height, dragHandlerDeg, relativeHandlers, handlersOffset, offsets]);

  const dragCursor = useMemo((): CSSProperties['cursor'] => {
    if (!draggable || isResizing || isRotating) return;
    if (!isDragging) return 'grab';
    return 'grabbing';
  }, [draggable, isResizing, isRotating, isDragging]);

  const resizeCursors: any = useMemo(() => {
    if (!resizable || isDragging || isRotating) return {};
    return getResizeCursors(rotationDeg);
  }, [resizable, isDragging, isRotating, rotationDeg]);

  const rotateCursor = useMemo((): CSSProperties['cursor'] => {
    if (!rotatable || isDragging || isResizing) return;
    if (!isRotating) return 'pointer';
    return 'grabbing';
  }, [rotatable, isDragging, isResizing, isRotating]);

  return (
    <div
      {...htmlProps}
      className={classnames(styles.mainContainer, htmlProps.className)}
      ref={resizableRef}
      style={{
        left,
        top,
        width,
        height,
        overflow: 'visible',
        transform: `rotate(${rotationDeg}deg)`,
        ...htmlProps.style,
      }}
    >
      <Rectangle onDragMouseDown={onDragMouseDown} draggable={draggable} style={{ color, cursor: dragCursor }} />
      {draggable && dragHandler && (
        <MoveHandler
          style={{
            ...dragHandlerPos,
            fill: color,
            cursor: dragCursor,
          }}
          rotationDeg={rotationDeg}
          onDragMouseDown={onDragMouseDown}
        />
      )}
      {resizable && (
        <>
          <ResizeHandler
            style={{ color, left: 0 - offsets.left, top: 0 - offsets.top, cursor: resizeCursors['nw'] }}
            type="nw"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width / 2, top: 0 - offsets.top, color, cursor: resizeCursors['n'] }}
            type="n"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: 0 - offsets.top, color, cursor: resizeCursors['ne'] }}
            type="ne"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: 0 - offsets.left, top: height / 2, color, cursor: resizeCursors['w'] }}
            type="w"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: height / 2, color, cursor: resizeCursors['e'] }}
            type="e"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: 0 - offsets.left, top: height + offsets.top, color, cursor: resizeCursors['sw'] }}
            type="sw"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width / 2, top: height + offsets.top, color, cursor: resizeCursors['s'] }}
            type="s"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: height + offsets.top, color, cursor: resizeCursors['se'] }}
            type="se"
            onResizeMouseDown={onResizeMouseDown}
          />
        </>
      )}
      {rotatable && (
        <RotateHandler
          style={{
            ...rotateHandlerPos,
            fill: color,
            cursor: rotateCursor,
          }}
          rotationDeg={rotationDeg}
          onRotateMouseDown={onRotateMouseDown}
        />
      )}
    </div>
  );
};
