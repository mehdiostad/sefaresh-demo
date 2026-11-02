export const ORDER_CHANNEL = (username: string) => `private-orders-${username}`;
export const ORDER_EVENT = "new-order";
export const pusherServer = { trigger: async (..._args: unknown[]) => undefined };
