// @flow
import { TurboModule } from "../TurboModule/RCTExport";
interface Spec extends TurboModule {
  readonly notifyTaskFinished: (taskId: number) => void;
  readonly notifyTaskRetry: (taskId: number) => Promise;
}
export type { Spec };
declare export default null | undefined | Spec;