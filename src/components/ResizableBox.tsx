import React, { CSSProperties, MouseEventHandler, useMemo, useRef } from 'react';
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
    resizable = true,
    aspectRatio,
    rotatable = true,
    snapAngle = 45,
    minWidth,
    minHeight,
    handlersSpaceOut = 50,
  } = props;
  const leftOffset = width < handlersSpaceOut ? (handlersSpaceOut - width) / 2 : 0;
  const topOffset = height < handlersSpaceOut ? (handlersSpaceOut - height) / 2 : 0;

  const resizableRef = useRef<HTMLDivElement>(null);

  const [, isDragging, onDragMouseDown] = useDrag({
    styles: {
      left,
      top,
    },
    scale,
    onDragStart: props.onDragStart,
    onDrag: props.onDrag,
    onDragEnd: props.onDragEnd,
  });
  const [, onResizeMouseDown] = useResize({
    styles: {
      left,
      top,
      width,
      height,
      rotationDeg,
    },
    scale,
    minHeight,
    minWidth,
    aspectRatio: !aspectRatio ? false : aspectRatio,
    onResizeStart: props.onResizeStart,
    onResize: props.onResize,
    onResizeEnd: props.onResizeEnd,
  });
  const [, onRotateMouseDown] = useRotate({
    styles: {
      top,
      left,
      width,
      height,
      rotationDeg,
    },
    resizableRef,
    snapAngle,
    onRotateStart: props.onRotateStart,
    onRotate: props.onRotate,
    onRotateEnd: props.onRotateEnd,
  });

  const statefulStyle: CSSProperties = useMemo(
    () => ({
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [isDragging]
  );

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
        onMouseDown={onDragMouseDown}
        draggable={draggable}
        isDragging={isDragging}
        height={height}
        width={width}
        style={{ ...statefulStyle, color }}
        onClick={props.onClick}
        onDoubleClick={props.onDoubleClick}
      />
      {props.dragHandler && (
        <MoveHandler
          onMouseDown={onDragMouseDown}
          draggable={draggable}
          isDragging={isDragging}
          left={width / 2}
          top={20 + height + topOffset}
          rotationDeg={rotationDeg}
          svgFilter={svgFilter}
        />
      )}
      {resizable && (
        <>
          <ResizeHandler color={color} type="nw" onMouseDown={onResizeMouseDown} left={0 - leftOffset} top={0 - topOffset} />
          <ResizeHandler color={color} type="n" onMouseDown={onResizeMouseDown} left={width / 2} top={0 - topOffset} />
          <ResizeHandler color={color} type="ne" onMouseDown={onResizeMouseDown} left={width + leftOffset} top={0 - topOffset} />
          <ResizeHandler color={color} type="w" onMouseDown={onResizeMouseDown} left={0 - leftOffset} top={height / 2} />
          <ResizeHandler color={color} type="e" onMouseDown={onResizeMouseDown} left={width + leftOffset} top={height / 2} />
          <ResizeHandler color={color} type="sw" onMouseDown={onResizeMouseDown} left={0 - leftOffset} top={height + topOffset} />
          <ResizeHandler color={color} type="s" onMouseDown={onResizeMouseDown} left={width / 2} top={height + topOffset} />
          <ResizeHandler color={color} type="se" onMouseDown={onResizeMouseDown} left={width + leftOffset} top={height + topOffset} />
        </>
      )}
      {rotatable && (
        <RotateHandler onMouseDown={onRotateMouseDown} left={width / 2} top={-20 - topOffset} rotationDeg={rotationDeg} svgFilter={svgFilter} />
      )}
    </div>
  );
};
