import { createDemoState, DemoDocument, DemoState, DEMO_USERNAME, DEMO_CAFES, resolveDemoCafe } from "./seed";
import { demoRequest } from "./api";

export const DEMO_STORAGE_KEY = "sefaresh-resume-demo-v1";
export const DEMO_CHANGE_EVENT = "sefaresh:demo-change";
export const DEMO_ORDER_EVENT = "sefaresh:demo-order";
const memory = new Map<string, DemoState>();
let installed = false;
const memoryOnly = new Set<string>();
let queue = Promise.resolve();

export function currentDemoUsername() {
  if (typeof window === "undefined") return DEMO_USERNAME;
  const firstSegment = decodeURIComponent(window.location.pathname.split("/")[1] || "");
  return resolveDemoCafe(firstSegment)?.username || DEMO_USERNAME;
}
export function demoStorageKey(username: string = currentDemoUsername()) {
  const cafe = resolveDemoCafe(username) || DEMO_CAFES[0];
  // Preserve the first demo's existing Cafe Elm data when upgrading.
  return cafe.username === DEMO_USERNAME ? DEMO_STORAGE_KEY : `${DEMO_STORAGE_KEY}:${cafe.username}`;
}
export function readDemoState(username: string = currentDemoUsername()): DemoState {
  const cafe = resolveDemoCafe(username) || DEMO_CAFES[0];
  if (typeof window === "undefined") return createDemoState(new Date(), cafe.username);
  const key = demoStorageKey(cafe.username);
  if (memoryOnly.has(key) && memory.has(key)) return memory.get(key)!;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 1 && parsed.user?._id === cafe.id && Array.isArray(parsed.menu) && Array.isArray(parsed.orders) && Array.isArray(parsed.customers) && Array.isArray(parsed.coupons)) return parsed;
    }
  } catch { /* Storage may be disabled or stale; the in-memory demo still works. */ }
  if (!memory.has(key)) memory.set(key, createDemoState(new Date(), cafe.username));
  return memory.get(key)!;
}
function writeDemoState(state: DemoState, resource?: string) {
  const key = demoStorageKey(state.user.username);
  memory.set(key, state);
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { memoryOnly.add(key); /* Keep changes in memory when storage is unavailable. */ }
  window.dispatchEvent(new CustomEvent(DEMO_CHANGE_EVENT, { detail: { resource, username: state.user.username } }));
}
export function resetDemo() {
  for (const cafe of DEMO_CAFES) writeDemoState(createDemoState(new Date(), cafe.username), "reset");
  window.location.assign("/");
}
export async function demoSignIn() {
  window.dispatchEvent(new CustomEvent(DEMO_CHANGE_EVENT, { detail: { resource: "auth" } }));
  return { ok: !!readDemoState().customer, error: null };
}
export async function demoSignOut(options?: { callbackUrl?: string; redirect?: boolean }) {
  const state = readDemoState(); state.customer = null; writeDemoState(state, "auth");
  if (options?.redirect !== false) window.location.assign(options?.callbackUrl || "/");
}
async function fileDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file);
  });
}
/** Same-origin mock transport; install before descendant effects can fetch. */
export function installDemoTransport() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const inputUrl = input instanceof Request ? input.url : String(input);
    const url = new URL(inputUrl, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/api/")) return nativeFetch(input, init);
    const requestUsername = currentDemoUsername();
    const run = async () => {
      if (init?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
      let body: DemoDocument = {};
      const raw = init?.body ?? (input instanceof Request && !["GET", "HEAD"].includes(method) ? await input.clone().text() : undefined);
      try {
        if (typeof raw === "string" && raw) body = JSON.parse(raw);
        const cafeName = url.searchParams.get("username") || body.username ||
          ((url.searchParams.get("userId") || body.userId) ? resolveDemoCafe(url.searchParams.get("userId") || body.userId)?.username : undefined);
        const state = readDemoState(cafeName || requestUsername);
        if (url.pathname.replace(/\/$/, "") === "/api/uploadImage") {
          if (!(raw instanceof FormData)) throw new Error("تصویری انتخاب نشده است.");
          const file = raw.get("file");
          if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) throw new Error("یک تصویر کوچک‌تر از ۲ مگابایت انتخاب کنید.");
          const data = await fileDataUrl(file), id = raw.get("id"), field = String(raw.get("selectedImg") || "img"), folder = raw.get("folder");
          if (!["img", "menuLogo", "qrcode", "bottomLeftImage", "bottomRightImage", "topDrawrerImage"].includes(field)) throw new Error("فیلد تصویر نامعتبر است.");
          const row = ["userLogos", "qr_codes"].includes(String(folder)) ? state.user : folder === "items" ? state.menu.flatMap(c => c.items).find(i => i._id === id) : state.menu.find(c => c._id === id);
          if (!row) throw new Error("اطلاعات پیدا نشد.");
          row[field] = data; writeDemoState(state, "uploadImage"); return Response.json(row);
        }
        if (url.pathname === "/api/generate_qr") {
          const data = typeof raw === "string" ? JSON.parse(raw) : {};
          const QRCode = await import("qrcode");
          const image = await QRCode.toDataURL(data.url || `${window.location.origin}/${currentDemoUsername()}`);
          return Response.json({ image });
        }
        if (typeof raw === "string" && raw) body = JSON.parse(raw);
        const reply = await demoRequest(state, url, method, body);
        if (method !== "GET" && method !== "HEAD" && reply.status < 400) writeDemoState(state, url.pathname.split("/")[2]);
        if (reply.event) window.dispatchEvent(new CustomEvent(DEMO_ORDER_EVENT, { detail: reply.event }));
        return Response.json(reply.data, { status: reply.status, headers: { "Cache-Control": "no-store", "X-Demo": "true" } });
      } catch (e) {
        return Response.json({ success: false, error: e instanceof Error ? e.message : "خطای داده‌های دمو", message: e instanceof Error ? e.message : "خطای داده‌های دمو" }, { status: 400 });
      }
    };
    const result = queue.then(run, run);
    queue = result.then(() => undefined, () => undefined);
    return result;
  };
}
