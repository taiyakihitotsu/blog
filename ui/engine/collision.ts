import type Cion from "@taiyakihitotsu/cion";

// -------------------------------------------------------------------
// [BETA]: This layout system is currently in beta.
// Since `foxp` is a self-developed project, its specifications are
// subject to change. I intend to incorporate those changes and stay
// synchronized with `foxp` as much as possible, so the structures
// defined here may evolve accordingly.
// -------------------------------------------------------------------
// This `layout.ts` file manages all CSS-related layout properties:
//   geometry: x, y, width, height, top, left, right, bottom, padding, margin, etc.
//
// We do not declare these layout values directly in components.
// Some layouts defined here are verified using `foxp`, a compile-time validator,
// to prevent unintentional overlaps.
//
// The collision detection function is designed to be generic rather than
// handling only specific cases. It accepts two values per dimension:
// (x, sizeX) or (y, sizeY).
//
// All CSS properties must be generated from these sets to ensure
// compile-time overlap prevention.
//
// For example:
// - x and sizeX are converted to 'left' and 'width' after passing
//   the collision check (used in `ModalHeaderList.tsx`).
// - x values are separated to generate padding and margin
//   (used in `RoundedContent.tsx`).
//
// Even if we skip collision checks, and technically don't need to
// declare styles via the Layout type, we still define them here to
// centralize layout-related styles and avoid scattering them across files.
// -------------------------------------------------------------------

export type InternalIsOneDimCollide =
  `(fn [left right] (if (> (+ (get left 0) (get left 1)) (get right 0)) true false))`;
export type IsOneDimCollide =
  `(fn [left right] (if (${InternalIsOneDimCollide} left right) (${InternalIsOneDimCollide} right left) false))`;
export type IsTwoDimCollide =
  `(fn [leftx rightx lefty righty] (if (and (${IsOneDimCollide} leftx rightx) (${IsOneDimCollide} lefty righty)) true false))`;

export type IsSeparated =
  `(fn [both] (let [left (get both 0) right (get both 1)] (not (${IsTwoDimCollide} [(:x left) (:sizeX left)] [(:x right) (:sizeX right)] [(:y left) (:sizeY left)] [(:y right) (:sizeY right)]))))`;

export type Layout = { x: number; y: number; sizeX: number; sizeY: number; pos?: "left" | "right" };

export type ComposedLayouts<LayoutsVector extends string> = Extract<
  Cion.Lisp<`(let [nextX (reduce (fn [i x] (+ i (get x :x))) 0 ${LayoutsVector})] {:x nextX :sizeX 1000})`>,
  string
>;

export type IsOverlapContent<
  ButtonLayouts extends string,
  T extends number,
  Layout extends string,
> = Cion.Lisp<`(fn [x] (= x (${IsSeparated} [(get ${ButtonLayouts} ${T}) ${ComposedLayouts<Layout>}])))`>;
