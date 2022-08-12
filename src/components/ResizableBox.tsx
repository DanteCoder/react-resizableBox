import React, { CSSProperties, MouseEventHandler, useRef } from 'react';
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

export interface ResizableBoxProps {
  width: number;
  height: number;
  left: number;
  top: number;
  rotationDeg?: number;
  scale?: number;
  style?: CSSProperties;
  color?: CSSProperties['color'];
  svgFilter?: CSSProperties['filter'];
  className?: string;
  draggable?: boolean;
  dragHandler?: boolean;
  resizable?: boolean;
  aspectRatio?: boolean | number;
  rotatable?: boolean;
  snapAngle?: number | boolean;
  minWidth?: number;
  minHeight?: number;
  handlersSpaceOut?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: MouseEventHandler<HTMLDivElement>;
  onMouseOver?: VoidFunction;
  onMouseLeave?: VoidFunction;
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
    style,
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
  } = props;

  const resizableRef = useRef<HTMLDivElement>(null);
  const onDragMouseDown = useDrag({
    styles: { left, top },
    scale,
    onDragStart: props.onDragStart,
    onDrag: props.onDrag,
    onDragEnd: props.onDragEnd,
  });
  const onResizeMouseDown = useResize({
    styles: { left, top, width, height, rotationDeg },
    scale,
    minHeight,
    minWidth,
    aspectRatio,
    onResizeStart: props.onResizeStart,
    onResize: props.onResize,
    onResizeEnd: props.onResizeEnd,
  });
  const onRotateMouseDown = useRotate({
    styles: { top, left, width, height, rotationDeg },
    resizableRef,
    snapAngle,
    onRotateStart: props.onRotateStart,
    onRotate: props.onRotate,
    onRotateEnd: props.onRotateEnd,
  });

  const offsets = {
    left: width < handlersSpaceOut ? (handlersSpaceOut - width) / 2 : 0,
    top: height < handlersSpaceOut ? (handlersSpaceOut - height) / 2 : 0,
  };

  return (
    <div
      ref={resizableRef}
      className={classnames(styles.mainContainer, props.className)}
      style={{
        left,
        top,
        overflow: 'visible',
        transform: rotationDeg ? `rotate(${rotationDeg}deg)` : undefined,
        ...style,
      }}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
    >
      <Rectangle
        onDragMouseDown={onDragMouseDown}
        draggable={draggable}
        height={height}
        width={width}
        style={{ color }}
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
      />
      {draggable && dragHandler && (
        <MoveHandler
          onDragMouseDown={onDragMouseDown}
          left={width / 2}
          top={20 + height + offsets.top}
          rotationDeg={rotationDeg}
          svgFilter={svgFilter}
        />
      )}
      {resizable && (
        <>
          <ResizeHandler color={color} type="nw" onResizeMouseDown={onResizeMouseDown} left={0 - offsets.left} top={0 - offsets.top} />
          <ResizeHandler color={color} type="n" onResizeMouseDown={onResizeMouseDown} left={width / 2} top={0 - offsets.top} />
          <ResizeHandler color={color} type="ne" onResizeMouseDown={onResizeMouseDown} left={width + offsets.left} top={0 - offsets.top} />
          <ResizeHandler color={color} type="w" onResizeMouseDown={onResizeMouseDown} left={0 - offsets.left} top={height / 2} />
          <ResizeHandler color={color} type="e" onResizeMouseDown={onResizeMouseDown} left={width + offsets.left} top={height / 2} />
          <ResizeHandler color={color} type="sw" onResizeMouseDown={onResizeMouseDown} left={0 - offsets.left} top={height + offsets.top} />
          <ResizeHandler color={color} type="s" onResizeMouseDown={onResizeMouseDown} left={width / 2} top={height + offsets.top} />
          <ResizeHandler color={color} type="se" onResizeMouseDown={onResizeMouseDown} left={width + offsets.left} top={height + offsets.top} />
        </>
      )}
      {rotatable && (
        <RotateHandler
          onRotateMouseDown={onRotateMouseDown}
          left={width / 2}
          top={-20 - offsets.top}
          rotationDeg={rotationDeg}
          svgFilter={svgFilter}
        />
      )}
    </div>
  );
};
