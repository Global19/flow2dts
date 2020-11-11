// @flow
import type { HostComponent } from "../../Renderer/shims/ReactNativeTypes";
import type { TextInputNativeCommands } from "./TextInputNativeCommands";
declare type NativeType = HostComponent<unknown>;
declare type NativeCommands = TextInputNativeCommands<NativeType>;
declare var Commands: NativeCommands;
export { Commands };
declare const $f2tExportDefault: HostComponent<unknown>;
export default $f2tExportDefault;