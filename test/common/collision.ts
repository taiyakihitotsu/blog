import type Cion from "@taiyakihitotsu/cion";
import type { IsEqual } from "type-fest";
import type { IsTwoDimCollide } from "@/engine/collision.js";

const Collide0Ok: true = {} as IsEqual<
  "true",
  Cion.Lisp<`(${IsTwoDimCollide} [0 50] [10 60] [0 50] [10 60])`>
>;
const Collide1Ok: true = {} as IsEqual<
  "false",
  Cion.Lisp<`(${IsTwoDimCollide} [0 50] [10 60] [0 50] [50 60])`>
>;
const Collide2Ok: true = {} as IsEqual<
  "true",
  Cion.Lisp<`(${IsTwoDimCollide} [0 50] [10 60] [0 50] [49 60])`>
>;
