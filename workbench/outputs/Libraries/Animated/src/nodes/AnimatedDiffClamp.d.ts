import { $TypeOf } from "flow2dts-flow-types-polyfill";
// @flow
declare var AnimatedInterpolation: $TypeOf<typeof $2>;
import $2 from "./AnimatedInterpolation";
declare var AnimatedNode: $TypeOf<typeof $3>;
import $3 from "./AnimatedNode";
declare var AnimatedWithChildren: $TypeOf<typeof $4>;
import $4 from "./AnimatedWithChildren";
import { InterpolationConfigType } from "./AnimatedInterpolation";
declare class AnimatedDiffClamp extends $1 {
  constructor: (a: AnimatedNode, min: number, max: number) => void;
  __makeNative: () => void;
  interpolate: (config: InterpolationConfigType) => AnimatedInterpolation;
  __getValue: () => number;
  __attach: () => void;
  __detach: () => void;
  __getNativeConfig: () => any;
}
declare var $1: $TypeOf<typeof AnimatedWithChildren>;
declare const $f2tExportDefault: $TypeOf<typeof AnimatedDiffClamp>;
export default $f2tExportDefault;