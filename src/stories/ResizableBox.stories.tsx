import React from 'react';
import { useState } from 'react';
import { ResizableBox, ResizableBoxProps } from '../components/ResizableBox';

export default {
  component: ResizableBox,
};

export const SimpleUseCase = () => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [left, setLeft] = useState(100);
  const [top, setTop] = useState(100);
  const [angle, setAngle] = useState(0);

  const onDragHandler: ResizableBoxProps['onDrag'] = (e) => {
    setLeft((prev) => prev + e.deltaX);
    setTop((prev) => prev + e.deltaY);
  };

  const onResizeHandler: ResizableBoxProps['onResize'] = (e) => {
    setLeft(e.left);
    setTop(e.top);
    setWidth(e.width);
    setHeight(e.height);
  };

  const onRotateHandler: ResizableBoxProps['onRotate'] = (e) => {
    setAngle(e);
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
