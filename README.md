# React + Konva Assessment

## Commands

`yarn` - Install dependencies

`yarn dev` - Run development environment

`yarn build` - Bundle complete application

## Functionality

Stars can be dragged

Any given star can be selected with a Konva transfomer via a click

- Visual appearance of the transformer has been updated to have a purple border and blue anchor points
- Clicking the background deselects a previously selected star  

A toolbar component with the following features has been added that includes the following features:

- A text node that shows the id of the currently selected star
- A slider that adjusts the number of points for the currently selected star
- A text node that displays the number of points for the currently selected star
- A input that adjusts the fill color of the currently selected star
- A button to download the currently selected star's data as JSON
- A button to allow uploading of a correctly formatted JSON file, which will update the currently selected star with the data supplied by the JSON file, and allow for further editing
- A button that shows a black & white preview of the artboard
- A button that hides the black & white preview of the artboard (if currently shown)

Saving & loading JSON will save/load the following data for a given star:

- Position
- Rotation
- Scale
- Fill
- Number of Points

Upon generation of the preview:

- A black and white image (rendered via Konva custom filter - no CSS) will appear in the bottom right corner of the artboard.
- The black and white image will exclude the following items from the render (assuming they are present when the render is performed):
  - The Konva Transformer box
  - A previously rendered preview image
