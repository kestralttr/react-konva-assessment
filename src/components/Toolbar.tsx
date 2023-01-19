
import React, { ChangeEvent, useRef } from 'react'
import { ElementAttrs, ElementType } from "../store/element";
import { observer } from "mobx-react-lite";

interface ToolbarProps {
    selectedElement: ElementType | null,
    renderPreview: Function,
    removePreview: Function
}

export function ToolbarImpl(props: ToolbarProps) {
    const { selectedElement, renderPreview, removePreview } = props
    const loadJSONInputRef = useRef<HTMLInputElement>(null)
    const imagePreviewRef = useRef<HTMLImageElement>(null)
    if (!selectedElement) return null


    function setNumPoints(newNumPoints: number) {
        selectedElement?.set({
            numPoints: newNumPoints
        })
    }

    function setFillColor(newFillColor: string) {
        selectedElement?.set({
            fill: newFillColor
        })
    }

    function handleSaveJSON() {
        if (!selectedElement) return

        interface ShapeData {
            [key: string]: string | number | boolean
        }

        const shapeData : ShapeData = ElementAttrs
        shapeData.x = selectedElement.x
        shapeData.y = selectedElement.y
        shapeData.rotation = selectedElement.rotation
        shapeData.scaleX = selectedElement.scaleX
        shapeData.scaleY = selectedElement.scaleY
        shapeData.fill = selectedElement.fill
        shapeData.numPoints = selectedElement.numPoints

        const a = document.createElement("a")
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(shapeData)], {
                    type: 'application/json'
                })
        )
        a.download = "shape-data.json"
        a.click()
    } 

    function handleLoadJSONClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        loadJSONInputRef?.current?.click()
    }

    function handleReaderLoad(event: ProgressEvent<FileReader>){
        var obj = JSON.parse(event?.target?.result as string);
        selectedElement?.set({
            x: obj.x,
            y: obj.y,
            rotation: obj.rotation,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            fill: obj.fill,
            numPoints: obj.numPoints
        })
    }

    function handleLoadJSONFile(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        let reader = new FileReader()
        reader.onload = handleReaderLoad
        reader.readAsText(e.target.files![0]);
    }

    function handleRenderPreview() {
        renderPreview(imagePreviewRef.current)
    }

    function handleRemovePreview() {
        removePreview()
    }

    return (
        <>
            <div id="toolbar__container">
                <div className="name__section">
                    <span>Selected Star:</span>
                    <span>{selectedElement.id}</span>
                </div>
                <div className="points-selection__container">
                    <input
                        type="range"
                        max="20"
                        min="2"
                        value={selectedElement.numPoints}
                        onChange={(e) => {
                            setNumPoints(parseInt(e.target.value, 10))
                        }}
                    />
                    <p>
                        <span>Number of points:</span>
                        <span>{selectedElement.numPoints}</span>
                    </p>
                </div>
                <div className="color-selection__container">
                    <input
                        type="color"
                        value={selectedElement.fill}
                        onChange={(e) => {
                            setFillColor(e.target.value)
                        }}
                    />
                </div>
                <div className="save-json__container">
                    <button onClick={handleSaveJSON}>Save JSON</button>
                </div>
                <div className="load-json__container">
                    <input ref={loadJSONInputRef} onChange={handleLoadJSONFile} id="load-json__input" type="file"></input>
                    <button id="load-json__button" onClick={handleLoadJSONClick}>Load JSON</button>
                </div>
                <div className="create-preview__container">
                    <button onClick={handleRenderPreview}>Create Preview</button>
                </div>
                <div className="remove-preview__container">
                    <button onClick={handleRemovePreview}>Remove Preview</button>
                </div>
            </div>
        </>
    )
}

export const Toolbar = observer(ToolbarImpl);