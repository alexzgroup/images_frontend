const eventBus = new Comment("event-bus");

export type GenerateStatistic = {
    total: number;
};

type EventsDefinition = {
    USER_SUBSCRIBE: GenerateStatistic;
    USER_UNSUBSCRIBE: GenerateStatistic;
};

export type CustomEventsType = keyof EventsDefinition;

export function publish<T extends CustomEventsType>(
    eventName: T,
    payload?: EventsDefinition[T],
): void {
    const event = payload
        ? new CustomEvent(eventName, {detail: payload})
        : new CustomEvent(eventName);
    eventBus.dispatchEvent(event);
}

type Unsubscribe = () => void;

function isCustomEvent(event: Event): event is CustomEvent {
    return "detail" in event;
}

export function subscribe<T extends CustomEventsType>(
    eventName: T,
    handlerFn: (payload: EventsDefinition[T]) => void,
): Unsubscribe {
    const eventHandler = (event: Event) => {
        if (isCustomEvent(event)) {
            const eventPayload: EventsDefinition[T] = event.detail;
            handlerFn(eventPayload);
        }
    };
    eventBus.addEventListener(eventName, eventHandler);
    return () => {
        eventBus.removeEventListener(eventName, eventHandler);
    };
}
