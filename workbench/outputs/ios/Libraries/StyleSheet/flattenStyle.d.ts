import { $TypeOf } from "flow2dts-flow-types-polyfill";
// @flow
import type { DangerouslyImpreciseStyle } from "./StyleSheet";
import type { DangerouslyImpreciseStyleProp } from "./StyleSheet";
declare function flattenStyle(style: null | undefined | DangerouslyImpreciseStyleProp): null | undefined | DangerouslyImpreciseStyle;
declare const $f2tExportDefault: $TypeOf<typeof flattenStyle>;
export default $f2tExportDefault;