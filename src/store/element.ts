import { Instance, types } from "mobx-state-tree";

export const ElementAttrs = {
  id: "",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  scaleX: 1,
  scaleY: 1,
  outerRadius: 40,
  innerRadius: 20,
  rotation: 0,
  fill: '#228B22',
  numPoints: 5,
  isDragging: false,
  isSelected: false
};

export type ElementAttrsType = typeof ElementAttrs;

export const Element = types
  .model(
    "Element",
    ElementAttrs
  )
  .actions((self) => ({
      set(attrs: Partial<ElementAttrsType>) {
        Object.assign(self, attrs);
      },
      select() {
        Object.assign(self, {isSelected: true});
      },
      deselect() {
        Object.assign(self, {isSelected: false})
      }
  }));

export type ElementType = Instance<typeof Element>;
