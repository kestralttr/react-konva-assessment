import React from 'react'
import { Star, Transformer } from "react-konva";
import { ElementType, Element } from "../store/element";
import { observer } from "mobx-react-lite";

interface StarProps {
  element: ElementType;
  selectNewStar: Function;
  deselectAllStars: Function,
  transformerHidden: boolean
}

let TR_COLORS: {
  borderStroke: string,
  anchorStroke: string,
  anchorFill: string
}

TR_COLORS = {
  borderStroke: 'purple',
  anchorStroke: 'grey',
  anchorFill: 'cyan'
}

export function StarElementImpl(props: StarProps) {
  const { element, selectNewStar, deselectAllStars, transformerHidden } = props;

  const shapeRef = React.useRef<any>(null);
  const trRef = React.useRef<any>(null);

  if (trRef.current) {
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer().batchDraw();
  }

  return (
    <React.Fragment>
      <Star
        ref={shapeRef}
        onClick={(e) => {
          deselectAllStars()
          selectNewStar(element.id)
          trRef?.current?.nodes([shapeRef.current]);
          trRef?.current?.getLayer().batchDraw();
        }}
        id={element.id}
        x={element.x}
        y={element.y}
        outerRadius={element.outerRadius}
        innerRadius={element.innerRadius}
        width={element.width}
        height={element.height}
        scaleX={element.scaleX}
        scaleY={element.scaleY}
        rotation={element.rotation}
        numPoints={element.numPoints}
        fill={element.fill}
        draggable
        isDragging={element.isDragging}
        onDragStart={(e) => {
          element.set({
            isDragging: true
          })
        }}
        onDragEnd={(e) => {
          element.set({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y()
          })
        }}
        onTransformEnd={e => {
          const node = shapeRef?.current;
          const scaleX = node?.scaleX();
          const scaleY = node?.scaleY();
          const rotation = node?.rotation()

          element.set({
            ...props,
            x: node?.x(),
            y: node?.y(),
            rotation: rotation,
            scaleX: scaleX,
            scaleY: scaleY
          });
        }}
      />
      {element.isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox: any, newBox: any) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          borderEnabled={true}
          borderStrokeWidth={4}
          borderStroke={transformerHidden ? 'transparent' : TR_COLORS.borderStroke}
          anchorStroke={transformerHidden ? 'transparent' : TR_COLORS.anchorStroke}
          anchorFill={transformerHidden ? 'transparent' : TR_COLORS.anchorFill}
          centeredScaling={true}
        />
      )}
    </React.Fragment>
  );
}

export const StarElement = observer(StarElementImpl);
