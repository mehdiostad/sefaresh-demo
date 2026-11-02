import { DEMO_CHANGE_EVENT, DEMO_ORDER_EVENT, readDemoState } from "@/demo/browser";

// Local event bridge retains the existing subscription interface, without Pusher credentials.
export const getPusherClient = () => {
  const cleanups = new Set<() => void>();
  return {
    subscribe: (_channelName: string) => {
      const handlers = new Map<Function, EventListener>();
      return {
        bind: (event: string, handler: (data: OrderEvent) => void) => {
          const listener: EventListener = e => {
            const detail = (e as CustomEvent).detail;
            if (detail?.name === event) handler(detail.data);
          };
          handlers.set(handler, listener); window.addEventListener(DEMO_ORDER_EVENT, listener);
          cleanups.add(() => window.removeEventListener(DEMO_ORDER_EVENT, listener));
        },
        unbind: (_event: string, handler: Function) => {
          const listener = handlers.get(handler);
          if (listener) window.removeEventListener(DEMO_ORDER_EVENT, listener);
          handlers.delete(handler);
        },
      };
    },
    unsubscribe: (_name: string) => { cleanups.forEach(fn => fn()); cleanups.clear(); },
    disconnect: () => { cleanups.forEach(fn => fn()); cleanups.clear(); },
  };
};
