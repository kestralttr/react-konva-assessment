import { Instance, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { randomInRange } from "../util/randomInRange";
import { Element } from "./element";

function generateElementsInitialState() {
  const initialState = [];

  for (let i = 0; i < 10; i++) {
    initialState.push({
      id: `id-${i}`,
      x: randomInRange(window.innerWidth),
      y: randomInRange(window.innerHeight),
      width: 80,
      height: 80,
      scaleX: 1,
      scaleY: 1,
      outerRadius: 40,
      innerRadius: 20,
      rotation: 0,
      fill: '#228B22',
      numPoints: 5,
      isDragging: false,
      isSelected: false
    });
  }
  return initialState;
}

export const Store = types.model("Store", {
  elements: types.array(Element)
});

export type StoreType = Instance<typeof Store>;

const store = Store.create({
  elements: generateElementsInitialState()
});

export default store;

export const StoreContext = createContext<StoreType>(store);

export const useStore = () => useContext(StoreContext);
