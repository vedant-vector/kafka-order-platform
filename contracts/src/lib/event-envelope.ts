import { EventName } from './event-names';

export interface EventEnvelope<TData> {
  event: EventName;
  data: TData;
}
