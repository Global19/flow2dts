import { $TypeOf } from "flow2dts-flow-types-polyfill";
import $2 from "react";
import type { ViewStyleProp } from "../../StyleSheet/StyleSheet";
import type { ColorValue } from "../../StyleSheet/StyleSheet";
declare type Props = Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  readonly children: $2.Node;

  /**
  * An ID which is used to associate this `InputAccessoryView` to
  * specified TextInput(s).
  */
  nativeID?: null | undefined | string;
  style?: null | undefined | ViewStyleProp;
  backgroundColor?: null | undefined | ColorValue;
}>;
declare class InputAccessoryView extends $2.Component<Props> {
  render(): $2.Node;
}
declare const $f2tExportDefault: $TypeOf<typeof InputAccessoryView>;
export default $f2tExportDefault;