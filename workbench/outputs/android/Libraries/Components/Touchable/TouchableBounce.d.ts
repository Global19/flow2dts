import { $TypeOf } from "flow2dts-flow-types-polyfill";
import { $Diff } from "utility-types";
// @flow
import type { ViewStyleProp } from "../../StyleSheet/StyleSheet";
import TouchableWithoutFeedback$f2tTypeof from "./TouchableWithoutFeedback";
declare type TouchableWithoutFeedback = $TypeOf<typeof TouchableWithoutFeedback$f2tTypeof>;
import { Animated } from "react-native";
import * as React from "react";
declare type Props = Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
React.ElementConfig<TouchableWithoutFeedback> & {
  onPressAnimationComplete?: null | undefined | (() => void);
  onPressWithCompletion?: null | undefined | ((callback: () => void) => void);
  releaseBounciness?: null | undefined | number;
  releaseVelocity?: null | undefined | number;
  style?: null | undefined | ViewStyleProp;
  hostRef: React.Ref<$TypeOf<typeof Animated.View>>;
}>;
declare const $f2tExportDefault: React.AbstractComponent<Readonly<$Diff<Props,
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  hostRef: unknown;
}>>>;
export default $f2tExportDefault;