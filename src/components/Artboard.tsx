import { useEffect, useRef, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Layer, Stage, Image } from "react-konva";
import Konva from 'konva'
import { StarElement } from "../elements/StarElement";
import { useStore } from "../store/design";
import { ElementType, Element } from "../store/element";
import { Toolbar } from "./Toolbar";
import useImage from 'use-image'


function ArtboardImpl() {
  const [showPreview, setShowPreview] = useState(false)
  const [previewURL, setPreviewURL] = useState('')
  const [readyForPreview, setReadyForPreview] = useState(false)
  const { elements } = useStore();
  let [image] = useImage(previewURL)

  const mainLayerRef = useRef<Konva.Layer>(null)
  const previewRef = useRef<Konva.Image>(null)

  useEffect(() => {
    previewRef?.current?.cache()
  }, [image])

  useEffect(() => {
    if (readyForPreview) {
      setPreviewURL(mainLayerRef?.current?.toDataURL() || '')
      setShowPreview(true)
      resolveAfterPreview()
    }
  },[readyForPreview])

  function removePreview() {
    setShowPreview(false)
    setPreviewURL('')
  }

  function renderPreview() {
    prepareForPreview()
  }

  function selectNewStar(id: string) {
    elements.forEach((element) => {
      element.id === id ? element.select() : element.deselect()
    })
  }

  function deselectAllStars() {
    elements.forEach((element) => {
      element.deselect()
    })
  }

  function filterForSelectedElement() {
    let selectedElement: (ElementType | null) = null
    elements.forEach((element) => {
      if (element.isSelected) {
        selectedElement = element
      }
    })
    return selectedElement
  }

  function prepareForPreview() {
    setReadyForPreview(true)
  }

  function resolveAfterPreview() {
    setReadyForPreview(false)
  }

  function CustomBlackAndWhiteFilter(imageData: {data: Uint8ClampedArray}) {
    const pixels = imageData?.data?.length
    console.log(imageData)
    for (var i = 0; i < pixels - 4; i += 4) {
      if (imageData.data[i+3] > 0) {
        imageData.data[i] = 0;
        imageData.data[i+1] = 0;
        imageData.data[i+2] = 0;
        imageData.data[i+3] = 255;
      } else {
        imageData.data[i] = 255;
        imageData.data[i+1] = 255;
        imageData.data[i+2] = 255;
        imageData.data[i+3] = 255;
      }
    }
  }

  return (
    <>
      <Toolbar
        selectedElement={filterForSelectedElement()}
        renderPreview={renderPreview}
        removePreview={removePreview}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={(e) => {
          e.target === e.target.getStage() ? deselectAllStars() : null
        }}
      >
        <Layer
          ref={mainLayerRef}
        >
          {elements.map((element) => (
            <StarElement
              element={element}
              key={element.id}
              selectNewStar={selectNewStar}
              deselectAllStars={deselectAllStars}
              transformerHidden={readyForPreview}
            />
          ))}
        </Layer>
        <Layer>
          {
            showPreview && 
            <Image
              image={image}
              ref={previewRef}
              x={window.innerWidth - (window.innerWidth / 5 + 50)}
              y={window.innerHeight - (window.innerHeight / 5 + 50)}
              width={window.innerWidth / 5}
              height={window.innerHeight / 5}
              filters={[CustomBlackAndWhiteFilter]}
              strokeWidth={2}
              stroke={"000"}
            />
          }
        </Layer>
      </Stage>
    </>
  );
}

export const Artboard = observer(ArtboardImpl);
