# React Resizable Box

![npm](https://img.shields.io/npm/v/@dantecoder/react-resizablebox) ![NPM](https://img.shields.io/npm/l/@dantecoder/react-resizablebox)

A resizable, draggable, rotatable React widget.

Tested on React 17.0.2.

## installation

```bash
npm install --save @dantecoder/react-resizablebox
```

## Usage

```tsx
import React from 'react';
import { ResizableBox } from '@dantecoder/react-resizablebox';
import { OnDragHandler, OnResizeHandler, OnRotateHandler } from '@dantecoder/react-resizablebox/dist/cjs/types';

const App = () => {
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
    <div>
      <ResizableBox
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
```

## Props

| Prop                | Type                   | Default | Description                                                                                                                                                                                                      |
| ------------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`             | `number`               | -       | The width of the resizable.                                                                                                                                                                                      |
| `height`            | `number`               | -       | The height of the resizable.                                                                                                                                                                                     |
| `left`              | `number`               | -       | The left position of the resizable.                                                                                                                                                                              |
| `top`               | `number`               | -       | The top position of the resizable.                                                                                                                                                                               |
| `rotationDeg?`      | `number`               | `0`     | The rotation of the resizable in degrees.                                                                                                                                                                        |
| `scale?`            | `number`               | `1`     | The drag and resize scale. This value scales the mouse movement.                                                                                                                                                 |
| `color?`            | `string`               | -       | Color to apply to the rectangle and resize handlers.                                                                                                                                                             |
| `svgFilter?`        | `string`               | -       | Filter to apply to the rotate and drag handlers.                                                                                                                                                                 |
| `draggable?`        | `boolean`              | `true`  | Enable/Disable the drag event. This also disables the drag handler.                                                                                                                                              |
| `dragHandler?`      | `boolean`              | `false` | Enable/Disable the drag handler.                                                                                                                                                                                 |
| `dragHandlerDeg?`   | `number`               | `180`   | The position of the drag handler measured in degrees relative to the resizable box vertical axis if relativeHandlers is true, or measured from the parent container vertical axis if relativeHandlers is false.  |
| `resizable?`        | `boolean`              | `true`  | Enable/Disable the resize handlers.                                                                                                                                                                              |
| `aspectRatio?`      | `boolean \| number`    | `false` | Boolean: Lock/Unlock aspect ratio. Number: Lock aspect ratio with the provided aspect ratio.                                                                                                                     |
| `rotatable?`        | `boolean`              | `true`  | Enable/Disable the rotate handler.                                                                                                                                                                               |
| `snapAngle?`        | `boolean \| number`    | `45`    | Boolean: Disables angle snap on rotation. Number: Sets the snap angle while rotating and holding shift key.                                                                                                      |
| `rotateHandlerDeg?` | `number`               | `0`     | The position of the drag handler measured in degrees relative to the resizable box vertical axis if relativeHandlers is true, or measured from the parent container vertical axis if relativeHandlers is false.  |
| `minWidth?`         | `number`               | `10`    | Minimun resizable width.                                                                                                                                                                                         |
| `minHeight?`        | `number`               | `10`    | Minimum resizable height.                                                                                                                                                                                        |
| `handlersOffset?`   | `number`               | `20`    | The space between the resizable box and the rotate and drag handlers.                                                                                                                                            |
| `handlersSpaceOut?` | `number`               | `50`    | The minimum width/height where the handlers start spacing out.                                                                                                                                                   |
| `relativeHandlers?` | `boolean`              | `true`  | if true, dragHandlerDeg and rotateHandlerDeg will be measured relative to the resizable box, else, they will be measured from the parent container.                                                              |
| `onDragStart?`      | `OnDragStartHandler`   | -       | Executed just before the first onDrag.                                                                                                                                                                           |
| `onDrag?`           | `OnDragHandler`        | -       | Executed when dragging.                                                                                                                                                                                          |
| `onDragEnd?`        | `OnDragEndHandler`     | -       | Executed after the last onDrag event.                                                                                                                                                                            |
| `onResizeStart?`    | `OnResizeStartHandler` | -       | Executed just before the first onResize.                                                                                                                                                                         |
| `onResize?`         | `OnResizeHandler`      | -       | Executed when resizing.                                                                                                                                                                                          |
| `onResizeEnd?`      | `OnResizeEndHandler`   | -       | Executed after the last onResize event.                                                                                                                                                                          |
| `onRotateStart?`    | `OnRotateStartHandler` | -       | Executed just before the first onRotate.                                                                                                                                                                         |
| `onRotate?`         | `OnRotateHandler`      | -       | Executed when rotating.                                                                                                                                                                                          |
| `onRotateEnd?`      | `OnRotateEndHandler`   | -       | Executed after the last onRotate event.                                                                                                                                                                          |

## Event Handlers

All event handlers except the `On<event>StartHandler` handlers will create an event that can have the following properties:

| Property     | Description                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| `style`      | The `left`, `top`, or `width` and `height` properties that can be applied to an object. Useful in most cases. |
| `delta`      | The current event change of the `left`, `top`, or `width` and `height` properties.                            |
| `totalDelta` | The total change of the `left`, `top`, or `width` and `height` properties since the "start" event.            |

The types used in each property are the following:

| Type        | Definition                          |
| ----------- | ----------------------------------- |
| `StylePos`  | `{ left: number; top: number }`     |
| `StyleSize` | `{ width: number; height: number }` |
| `StyleRot`  | `{ rotationDeg: number }`           |
| `DeltaPos`  | `{ x: number; y: number }`          |
| `DeltaSize` | `{ w: number; h: number }`          |
| `DeltaRot`  | `{ deg: number }`                   |

| Handler                | Event                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `OnDragStartHandler`   | -                                                                                                |
| `OnDragHandler`        | `{ style: StylePos; delta: DeltaPos; totalDelta: DeltaPos }`                                     |
| `OnDragEndHandler`     | `{ style: StylePos; totalDelta: DeltaPos }`                                                      |
| `OnResizeStartHandler` | -                                                                                                |
| `OnResizeHandler`      | `{ style: StylePos & StyleSize; delta: DeltaPos & DeltaSize; totalDelta: DeltaPos & DeltaSize }` |
| `OnResizeEndHandler`   | `{ style: StylePos & StyleSize; totalDelta: DeltaPos & DeltaSize }`                              |
| `OnRotateStartHandler` | -                                                                                                |
| `OnRotateHandler`      | `{ style: StyleRot; delta: DeltaRot; totalDelta: DeltaRot }`                                     |
| `OnRotateEndHandler`   | `{ style: StyleRot; totalDelta: DeltaRot }`                                                      |
