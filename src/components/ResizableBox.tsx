import React, { CSSProperties, DetailedHTMLProps, useRef } from 'react';
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
import styles from './ResizableBox.module.css';
import { resizeHandlerCursor } from '../utils';

export interface ResizableBoxProps extends Omit<DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onDrag' | 'onDragEnd'> {
  width: number;
  height: number;
  left: number;
  top: number;
  rotationDeg?: number;
  scale?: number;
  color?: CSSProperties['color'];
  svgFilter?: CSSProperties['filter'];
  draggable?: boolean;
  dragHandler?: boolean;
  resizable?: boolean;
  aspectRatio?: boolean | number;
  rotatable?: boolean;
  snapAngle?: number | boolean;
  minWidth?: number;
  minHeight?: number;
  handlersSpaceOut?: number;
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
    svgFilter,
    draggable = true,
    dragHandler = false,
    resizable = true,
    aspectRatio = false,
    rotatable = true,
    snapAngle = 45,
    minWidth,
    minHeight,
    handlersSpaceOut = 50,
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
  const onResizeMouseDown = useResize({
    styles: { left, top, width, height, rotationDeg },
    scale,
    minHeight,
    minWidth,
    aspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
  });
  const onRotateMouseDown = useRotate({
    styles: { top, left, width, height, rotationDeg },
    resizableRef,
    snapAngle,
    onRotateStart,
    onRotate,
    onRotateEnd,
  });

  const offsets = {
    left: width < handlersSpaceOut ? (handlersSpaceOut - width) / 2 : 0,
    top: height < handlersSpaceOut ? (handlersSpaceOut - height) / 2 : 0,
  };

  const dragCursor = ((): CSSProperties['cursor'] => {
    if (!draggable) return 'auto';
    if (!isDragging) return 'grab';
    return 'grabbing';
  })();

  return (
    <div
      {...htmlProps}
      className={classnames(styles.mainContainer, htmlProps.className)}
      ref={resizableRef}
      style={{
        left,
        top,
        overflow: 'visible',
        transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
        ...htmlProps.style,
      }}
    >
      <Rectangle onDragMouseDown={onDragMouseDown} draggable={draggable} style={{ width, height, color, cursor: dragCursor }} />
      {draggable && dragHandler && (
        <MoveHandler
          style={{
            left: width / 2,
            top: 20 + height + offsets.top,
            filter: svgFilter,
            cursor: dragCursor,
          }}
          rotationDeg={rotationDeg}
          onDragMouseDown={onDragMouseDown}
        />
      )}
      {resizable && (
        <>
          <ResizeHandler
            style={{ color, left: 0 - offsets.left, top: 0 - offsets.top, cursor: resizeHandlerCursor(rotationDeg - 45) }}
            type="nw"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width / 2, top: 0 - offsets.top, color, cursor: resizeHandlerCursor(rotationDeg) }}
            type="n"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: 0 - offsets.top, color, cursor: resizeHandlerCursor(rotationDeg + 45) }}
            type="ne"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: 0 - offsets.left, top: height / 2, color, cursor: resizeHandlerCursor(rotationDeg - 90) }}
            type="w"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: height / 2, color, cursor: resizeHandlerCursor(rotationDeg + 90) }}
            type="e"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: 0 - offsets.left, top: height + offsets.top, color, cursor: resizeHandlerCursor(rotationDeg - 135) }}
            type="sw"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width / 2, top: height + offsets.top, color, cursor: resizeHandlerCursor(rotationDeg + 180) }}
            type="s"
            onResizeMouseDown={onResizeMouseDown}
          />
          <ResizeHandler
            style={{ left: width + offsets.left, top: height + offsets.top, color, cursor: resizeHandlerCursor(rotationDeg + 135) }}
            type="se"
            onResizeMouseDown={onResizeMouseDown}
          />
        </>
      )}
      {rotatable && (
        <RotateHandler
          style={{
            left: width / 2,
            top: -20 - offsets.top,
            filter: svgFilter,
          }}
          rotationDeg={rotationDeg}
          onRotateMouseDown={onRotateMouseDown}
        />
      )}
    </div>
  );
};
