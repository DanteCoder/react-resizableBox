import React from 'react';
import { useState } from 'react';
import { ResizableBox, ResizableBoxProps } from '../components/ResizableBox';
import { OnDragHandler, OnResizeHandler, OnRotateHandler } from '../types';

export default {
  component: ResizableBox,
};

export const SimpleUseCase = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [angle, setAngle] = useState(0);

  const onDragHandler: OnDragHandler = (e) => {
    setLeft(e.style.left);
    setTop(e.style.top);
  };

  const onResizeHandler: OnResizeHandler = (e) => {
    setLeft(e.style.left);
    setTop(e.style.top);
    setWidth(e.style.width);
    setHeight(e.style.height);
  };

  const onRotateHandler: OnRotateHandler = (e) => {
    setAngle(e.style.rotationDeg);
  };

  return (
    <div style={{ width: '1920px', height: '1080px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          width,
          height,
          top,
          left,
          transform: `rotate(${angle}deg)`,
          backgroundColor: 'lavender',
        }}
      ></div>
      <ResizableBox
        color={'red'}
        svgFilter={'invert(10%) sepia(96%) saturate(3906%) hue-rotate(241deg) brightness(99%) contrast(161%)'}
        dragHandler={true}
        width={width}
        height={height}
        left={left}
        top={top}
        rotationDeg={angle}
        onDrag={onDragHandler}
        onResize={onResizeHandler}
        onRotate={onRotateHandler}
      />
    </div>
  );
};
