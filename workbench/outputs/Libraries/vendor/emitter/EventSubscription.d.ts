// @flow
import EventSubscriptionVendor from "./EventSubscriptionVendor";
declare class EventSubscription {
  eventType: string;
  key: number;
  subscriber: EventSubscriptionVendor;

  /**
   * @param {EventSubscriptionVendor} subscriber the subscriber that controls
   *   this subscription.
   */
  constructor: (subscriber: EventSubscriptionVendor) => void;

  /**
   * Removes this subscription from the subscriber that controls it.
   */
  remove: () => void;
}
declare const $f2tExportDefault: typeof EventSubscription;
export default $f2tExportDefault;