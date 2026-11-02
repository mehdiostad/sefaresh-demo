// Compatibility for retained UI imports. Production authentication is deliberately absent.
import type { AuthOptions } from "next-auth";
export const authOptions: AuthOptions = { providers: [], session: { strategy: "jwt" } };
