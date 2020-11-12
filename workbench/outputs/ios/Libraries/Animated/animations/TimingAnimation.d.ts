import { $TypeOf } from "flow2dts-flow-types-polyfill";
import $2 from "../nodes/AnimatedValue";
import $3 from "../nodes/AnimatedValueXY";
import $1 from "../nodes/AnimatedInterpolation";
import $4 from "./Animation";
import { AnimationConfig } from "./Animation";
import { EndCallback } from "./Animation";
declare type TimingAnimationConfig = AnimationConfig & {
  toValue: number | typeof $2 | {
    x: number;
    y: number;
  } | typeof $3 | typeof $1;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};
declare type TimingAnimationConfigSingle = AnimationConfig & {
  toValue: number | typeof $2 | typeof $1;
  easing?: (value: number) => number;
  duration?: number;
  delay?: number;
};
declare class TimingAnimation extends $4 {
  constructor(config: TimingAnimationConfigSingle);
  __getNativeAnimationConfig(): any;
  start(fromValue: number, onUpdate: (value: number) => void, onEnd: null | undefined | EndCallback, previousAnimation: null | undefined | typeof $4, animatedValue: typeof $2): void;
  onUpdate(): void;
  stop(): void;
}
export type { TimingAnimationConfig };
export type { TimingAnimationConfigSingle };
declare const $f2tExportDefault: $TypeOf<typeof TimingAnimation>;
export default $f2tExportDefault;