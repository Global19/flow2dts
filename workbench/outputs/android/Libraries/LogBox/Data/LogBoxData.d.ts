// @flow
import * as React from "react";
import LogBoxLog from "./LogBoxLog";
import type { LogLevel } from "./LogBoxLog";
import type { Message } from "./parseLogBoxLog";
import type { Category } from "./parseLogBoxLog";
import type { ComponentStack } from "./parseLogBoxLog";
import type { ExtendedExceptionData } from "./parseLogBoxLog";
import type { ExtendedError } from "../../Core/Devtools/parseErrorStack";
declare type LogBoxLogs = Set<LogBoxLog>;
declare type LogData = Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  level: LogLevel;
  message: Message;
  category: Category;
  componentStack: ComponentStack;
}>;
declare type Observer = ($f2t1: Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  logs: LogBoxLogs;
  isDisabled: boolean;
  selectedLogIndex: number;
}>) => void;
declare type IgnorePattern = string | RegExp;
declare type Subscription = Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  unsubscribe: () => void;
}>;
declare type WarningInfo =
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  finalFormat: string;
  forceDialogImmediately: boolean;
  suppressDialog_LEGACY: boolean;
  suppressCompletely: boolean;
  monitorEvent: string | null;
  monitorListVersion: number;
  monitorSampleRate: number;
};
declare type WarningFilter = (format: string) => WarningInfo;
declare type AppInfo = Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  appVersion: string;
  engine: string;
  onPress?: null | undefined | (() => void);
}>;
declare function reportLogBoxError(error: ExtendedError, componentStack?: string): void;
declare function isLogBoxErrorMessage(message: string): boolean;
declare function isMessageIgnored(message: string): boolean;
declare function addLog(log: LogData): void;
declare function addException(error: ExtendedExceptionData): void;
declare function symbolicateLogNow(log: LogBoxLog): void;
declare function retrySymbolicateLogNow(log: LogBoxLog): void;
declare function symbolicateLogLazy(log: LogBoxLog): void;
declare function clear(): void;
declare function setSelectedLog(proposedNewIndex: number): void;
declare function clearWarnings(): void;
declare function clearErrors(): void;
declare function dismiss(log: LogBoxLog): void;
declare function setWarningFilter(filter: WarningFilter): void;
declare function setAppInfo(info: () => AppInfo): void;
declare function getAppInfo(): null | undefined | AppInfo;
declare function checkWarningFilter(format: string): WarningInfo;
declare function addIgnorePatterns(patterns: ReadonlyArray<IgnorePattern>): void;
declare function setDisabled(value: boolean): void;
declare function isDisabled(): boolean;
declare function observe(observer: Observer): Subscription;
declare type SubscribedComponent = React.AbstractComponent<Readonly<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{
  logs: ReadonlyArray<LogBoxLog>;
  isDisabled: boolean;
  selectedLogIndex: number;
}>>;
declare function withSubscription(WrappedComponent: SubscribedComponent): React.AbstractComponent<
/*[FLOW2DTS - Warning] This type was an exact object type in the original Flow source.*/
{}>;
export type { LogBoxLogs };
export type { LogData };
export type { Observer };
export type { IgnorePattern };
export type { Subscription };
export type { WarningInfo };
export type { WarningFilter };
export { reportLogBoxError };
export { isLogBoxErrorMessage };
export { isMessageIgnored };
export { addLog };
export { addException };
export { symbolicateLogNow };
export { retrySymbolicateLogNow };
export { symbolicateLogLazy };
export { clear };
export { setSelectedLog };
export { clearWarnings };
export { clearErrors };
export { dismiss };
export { setWarningFilter };
export { setAppInfo };
export { getAppInfo };
export { checkWarningFilter };
export { addIgnorePatterns };
export { setDisabled };
export { isDisabled };
export { observe };
export { withSubscription };