import { clone, createDemoState, DEMO_OTP, DEMO_USERNAME, DemoDocument, DemoState, resolveDemoCafe } from "./seed";

export interface DemoReply { status: number; data: any; event?: { name: string; data: any }; }
export const digits = (s: unknown) => String(s ?? "").replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const notFound = () => ({ status: 404, data: { success: false, error: "اطلاعات پیدا نشد", message: "اطلاعات پیدا نشد" } });
const invalid = (message: string, status = 400) => ({ status, data: { success: false, error: message, message } });
const ok = (data: any, status = 200): DemoReply => ({ status, data: clone(data) });
export const allItems = (s: DemoState): DemoDocument[] => s.menu.flatMap(c => c.items);
function customerFor(s: DemoState, phone: string, name = "مهمان دمو") {
  let customer = s.customers.find(c => c.phone === phone);
  if (!customer) { customer = { _id: uid("demo-customer"), fullname: name, phone, points: 160 }; customer.id = customer._id; s.customers.push(customer); }
  return customer;
}
function customerSummary(s: DemoState, c: DemoDocument) {
  const orders = s.orders.filter(o => o.customer.phone === c.phone);
  const redemptions = s.redemptions.filter(r => r.customerId === c._id);
  const history = [...orders.filter(o => o.earnedPoints).map(o => ({ type: "earned", points: o.earnedPoints, createdAt: o.createdAt })), ...redemptions.map(r => ({ ...r, type: "spent", points: -r.pointsUsed }))].sort((a: DemoDocument, b: DemoDocument) => b.createdAt.localeCompare(a.createdAt));
  return { ...c, totalOrders: orders.length, totalSpent: orders.filter(o => o.status === "delivered").reduce((a, o) => a + o.total, 0), earnedPoints: orders.reduce((a, o) => a + (o.earnedPoints || 0), 0), redeemedPoints: redemptions.reduce((a, r) => a + r.pointsUsed, 0), netPoints: c.points, history };
}
function report(s: DemoState, q: URLSearchParams, kind: string) {
  const from = q.get("from") ? new Date(q.get("from")!).getTime() : 0;
  const to = q.get("to") ? new Date(q.get("to")!).getTime() : Infinity;
  const orders = s.orders.filter(o => o.status === (q.get("status") || "delivered") && new Date(o.createdAt).getTime() >= from && new Date(o.createdAt).getTime() <= to);
  const byDate: Record<string, number> = {}, byHour: Record<string, DemoDocument> = {}, byItem: Record<string, DemoDocument> = {}, byCategory: Record<string, DemoDocument> = {}, byCoupon: Record<string, DemoDocument> = {};
  let totalRevenue = 0, baseRevenue = 0;
  for (const order of orders) {
    totalRevenue += order.total; baseRevenue += order.baseTotal;
    const date = order.createdAt.slice(0, 10), hour = new Date(order.createdAt).getHours();
    byDate[date] = (byDate[date] || 0) + order.total;
    byHour[hour] ||= { hour, totalRevenue: 0, orderCount: 0 };
    byHour[hour].totalRevenue += order.total; byHour[hour].orderCount++;
    const couponId = typeof order.appliedCouponId === "object" ? order.appliedCouponId?._id : order.appliedCouponId;
    const couponKey = couponId || "none";
    byCoupon[couponKey] ||= { _id: couponId || null, ordersCount: 0, totalRevenue: 0 };
    byCoupon[couponKey].ordersCount++; byCoupon[couponKey].totalRevenue += order.total;
    for (const item of order.items) {
      const meta = allItems(s).find(i => i._id === item.id || i.itemName.trim() === item.name.trim());
      const category = s.menu.find(c => c._id === meta?.categoryId);
      const key = meta?._id || item.id;
      byItem[key] ||= { _id: key, itemId: key, name: item.name, nameFromOrder: item.name, itemName: meta?.itemName || item.name, secondItemName: meta?.secondItemName || "", categoryName: category?.title || "سایر", categoryId: category?._id || "other", available: meta?.available ?? true, count: 0, totalQty: 0, freeQty: 0, paidQty: 0, totalRevenue: 0, ordersCount: 0, timesOrdered: 0, avgQtyPerOrder: 0, firstOrderAt: order.createdAt, lastOrderAt: order.createdAt };
      const row = byItem[key]; row.count += item.qty; row.totalQty += item.qty; row[item.free ? "freeQty" : "paidQty"] += item.qty; row.totalRevenue += item.free ? 0 : item.price * item.qty; row.ordersCount++; row.timesOrdered++; row.avgQtyPerOrder = row.totalQty / row.ordersCount;
      if (order.createdAt < row.firstOrderAt) row.firstOrderAt = order.createdAt;
      if (order.createdAt > row.lastOrderAt) row.lastOrderAt = order.createdAt;
      const ck = category?._id || "other";
      byCategory[ck] ||= { _id: ck, name: category?.title || "سایر", count: 0, totalRevenue: 0 };
      byCategory[ck].count += item.qty; byCategory[ck].totalRevenue += item.price * item.qty;
    }
  }
  const items = Object.values(byItem).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const chartData = Object.entries(byDate).map(([date, sales]) => ({ date, sales })).sort((a, b) => a.date.localeCompare(b.date));
  const sortedDays = [...chartData].sort((a, b) => b.sales - a.sales);
  const summary = { totalRevenue, baseRevenue, totalOrders: orders.length, avgOrderValue: orders.length ? totalRevenue / orders.length : 0, totalItemsSold: items.reduce((a, i) => a + i.totalQty, 0), totalFreeItems: items.reduce((a, i) => a + i.freeQty, 0), totalPaidItems: items.reduce((a, i) => a + i.paidQty, 0) };
  const outputItems = kind === "sales" ? items.map(i => ({ ...i, _id: i.name })) : items;
  return { summary, items: outputItems, chartData, categories: Object.values(byCategory), hourlySales: Object.values(byHour).sort((a, b) => a.hour - b.hour), topDay: sortedDays[0] || null, bottomDay: sortedDays[sortedDays.length - 1] || null, topItem: outputItems[0] || null, coupons: Object.values(byCoupon) };
}

/** Pure demo adapter shared by browser storage and read-only HTTP fallbacks. No external services. */
export async function demoRequest(s: DemoState, url: URL, method = "GET", body: DemoDocument = {}): Promise<DemoReply> {
  const path = decodeURIComponent(url.pathname).replace(/\/+$/, ""), parts = path.split("/").slice(2), q = url.searchParams;
  const [resource, id, subId] = parts;
  if (resource === "auth") {
    if (id === "session") return ok(s.customer ? { user: s.customer, expires: "2099-01-01T00:00:00.000Z" } : {});
    if (id === "otp") {
      const phone = digits(body.phone);
      if (!/^09\d{9}$/.test(phone)) return invalid("شمارهٔ نمونهٔ معتبر وارد کنید؛ 09000000000");
      if (subId === "send") return ok({ success: true, demo: true, message: `کد دمو: ${DEMO_OTP} — پیامکی ارسال نمی‌شود.` });
      if (subId === "verify") {
        if (digits(body.code) !== DEMO_OTP) return invalid("کد دمو 123456 است.");
        const c = customerFor(s, phone, String(body.name || "مهمان دمو"));
        s.customer = { id: c._id, fullname: String(body.name || c.fullname), phone, role: "customer" };
        return ok({ success: true, customer: s.customer, demo: true });
      }
    }
    if (id === "signout") { s.customer = null; return ok({ url: "/" }); }
    return invalid("ورود واقعی در نسخهٔ دمو غیرفعال است.");
  }
  if (resource === "user") {
    if (method === "GET") return (!q.get("username") || resolveDemoCafe(q.get("username"))?.id === s.user._id) ? ok({ ok: true, publicUserInfo: s.user }) : notFound();
    const fields = ["menuName", "menuLogo", "phone", "address", "description", "theme", "multiLang", "qrcode"];
    fields.forEach(k => { if (body[k] !== undefined) s.user[k] = body[k]; });
    return ok(s.user);
  }
  if (resource === "full_menu" || resource === "getAll") return (!q.get("username") || resolveDemoCafe(q.get("username"))?.id === s.user._id) ? ok(s.menu) : notFound();
  if (resource === "categories" || resource === "menu" || resource === "page") {
    const category = s.menu.find(c => c._id === id);
    if (method === "GET") return id ? (category ? ok(category) : notFound()) : ok(s.menu);
    if (method === "POST") {
      if (!String(body.title || "").trim()) return invalid("عنوان دسته‌بندی الزامی است.");
      const c = { ...body, _id: uid("demo-category"), userId: s.user._id, items: [], pageNumber: s.menu.length + 1, order: s.menu.length };
      s.menu.push(c); return ok(c, 201);
    }
    if (!category) return notFound();
    if (method === "DELETE") { s.menu = s.menu.filter(c => c._id !== id); s.menu.forEach((c, i) => c.pageNumber = i + 1); return ok({ success: true }); }
    Object.entries(body).forEach(([k, v]) => { if (!["_id", "items", "userId"].includes(k)) category[k] = v; });
    s.menu.sort((a, b) => a.pageNumber - b.pageNumber); return ok(category);
  }
  if (resource === "items" || resource === "item") {
    const item = allItems(s).find(i => i._id === id);
    if (method === "GET") return id ? (item ? ok(item) : notFound()) : ok(allItems(s).filter(i => !q.get("categoryId") || i.categoryId === q.get("categoryId")));
    if (method === "POST") {
      const c = s.menu.find(c => c._id === body.categoryId);
      if (!c) return notFound();
      if (!String(body.itemName || "").trim() || !Number.isFinite(Number(body.price)) || Number(body.price) < 0) return invalid("نام و قیمت معتبر لازم است.");
      const i = { ...body, _id: uid("demo-item"), order: c.items.length + 1, secondItemName: body.secondItemName || "Demo Item", available: body.available ?? true, price: Number(body.price), img: body.img || "" };
      c.items.push(i); return ok(i, 201);
    }
    if (!item) return notFound();
    if (method === "DELETE") { s.menu.forEach(c => c.items = c.items.filter((i: DemoDocument) => i._id !== id)); return ok({ success: true }); }
    Object.entries(body).forEach(([k, v]) => { if (k !== "_id") item[k] = v; });
    if (body.price != null) item.price = Number(body.price);
    if (body.secondaryPrice != null) item.secondaryPrice = Number(body.secondaryPrice);
    return ok(item);
  }
  if (resource === "orders") {
    if (method === "GET") {
      let orders = s.orders;
      if (id) return orders.find(o => o._id === id) ? ok(orders.find(o => o._id === id)) : notFound();
      if (q.get("phonenumber")) {
        const phone = digits(q.get("phonenumber"));
        orders = orders.filter(o => o.customer.phone === phone);
      }
      return ok(orders.map(o => ({ ...o, user: s.user, appliedCouponId: o.appliedCouponId ? s.coupons.find(c => c._id === (o.appliedCouponId?._id || o.appliedCouponId)) || o.appliedCouponId : undefined })).sort((a: DemoDocument, b: DemoDocument) => b.createdAt.localeCompare(a.createdAt)));
    }
    if (method === "POST") {
      if (!s.customer) return invalid("ابتدا با کد دمو وارد شوید.", 401);
      if (!Array.isArray(body.items) || !body.items.length) return invalid("سبد سفارش خالی است.");
      if (body.items.some((i: DemoDocument) => !Number.isInteger(i.qty) || i.qty < 1 || !Number.isFinite(Number(i.price)) || Number(i.price) < 0)) return invalid("آیتم سفارش نامعتبر است.");
      const customer = customerFor(s, s.customer.phone, s.customer.fullname);
      const now = new Date().toISOString();
      let coupon: DemoDocument | undefined;
      if (body.appliedCouponId) {
        coupon = s.coupons.find(c => c._id === body.appliedCouponId && c.customerId === customer._id);
        if (!coupon || coupon.status !== "active" || !coupon.isActive || (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now())) return invalid("کوپن نامعتبر یا استفاده شده است.");
      }
      const baseTotal = Math.round(body.items.reduce((sum: number, i: DemoDocument) => sum + (i.free ? 0 : Number(i.price) * i.qty), 0) * (s.user.theme === "cafe_elm" ? 1.1 : 1));
      const total = coupon?.type === "discount" ? Math.round(baseTotal * (1 - Number(coupon.value) / 100)) : baseTotal;
      const order = { _id: uid("demo-order"), orderId: Math.max(1400, ...s.orders.map(o => o.orderId)) + 1, username: s.user.username, userId: s.user._id, user: clone(s.user), customer: { name: s.customer.fullname, phone: s.customer.phone, table: String(body.customer?.table || "۱") }, items: clone(body.items), baseTotal, total, status: "pending", note: String(body.note || ""), earnedPoints: 0, redeemedPoints: 0, createdAt: now, appliedCouponId: coupon?._id };
      if (coupon) coupon.status = "reserved";
      s.orders.unshift(order);
      return { ...ok(order, 201), event: { name: "new-order", data: order } };
    }
    const order = s.orders.find(o => o._id === id);
    if (!order) return notFound();
    if (!["pending", "preparing", "ready", "delivered", "cancelled"].includes(body.status)) return invalid("وضعیت نامعتبر است.");
    const customer = customerFor(s, order.customer.phone, order.customer.name);
    const previousPoints = Number(order.earnedPoints || 0);
    order.status = body.status;
    order.earnedPoints = body.status === "delivered" ? Math.floor(order.baseTotal / s.user.loyalty.pointRate) : 0;
    customer.points += order.earnedPoints - previousPoints;
    const coupon = s.coupons.find(c => c._id === order.appliedCouponId);
    if (coupon) { coupon.status = order.status === "delivered" ? "used" : order.status === "cancelled" ? "active" : "reserved"; coupon.usedAt = order.status === "delivered" ? new Date().toISOString() : undefined; }
    return ok(order);
  }
  if (resource === "stats") {
    const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return { day: d.toISOString().slice(0, 10).split("-").reverse().join("-"), you: 80 + i * 7 + (i % 3) * 13, others: 64 + (i % 5) * 9, sessionCount: 53 + i * 4, totalCount: 110 + i * 12 }; });
    if (id === "barchart" || id === "areachart") return ok(days);
    const metrics = s.menu.map((c, i) => ({ x: `/${s.user.username}/${c.title}`, y: 50 + (10 - i) * 31 }));
    return ok({ monthlyData: metrics, dailyData: metrics.slice(0, 5).map(m => ({ ...m, y: Math.ceil(m.y / 10) })), thisWeekData: [{ x: "visits", y: 750 }], lastWeekData: [{ x: "visits", y: 620 }] });
  }
  if (resource === "reports") return ok(report(s, q, id));
  if (resource === "loyalty") {
    if (id === "rules") {
      if (method !== "GET") {
        if (body.pointRate !== undefined) s.user.loyalty.pointRate = Number(body.pointRate);
        if (body.isActive !== undefined) s.user.loyalty.isActive = body.isActive;
      }
      return ok({ success: true, loyalty: s.user.loyalty, ...s.user.loyalty });
    }
    if (id === "rewards") {
      if (method === "POST") { const r = { ...body, _id: uid("demo-reward") }; s.user.loyalty.rewards.push(r); return ok({ ...r, reward: r }, 201); }
      if (!subId) return ok({ success: true, rewards: s.user.loyalty.rewards });
      const r = s.user.loyalty.rewards.find((r: DemoDocument) => r._id === subId);
      if (!r) return notFound();
      if (method === "DELETE") s.user.loyalty.rewards = s.user.loyalty.rewards.filter((r: DemoDocument) => r._id !== subId);
      else Object.entries(body).forEach(([k, v]) => { if (k !== "_id") r[k] = v; });
      return ok({ success: true, ...r, reward: r });
    }
    if (id === "customers") return ok({ success: true, customers: s.customers.map(c => customerSummary(s, c)) });
    if (id === "customer") {
      const c = s.customers.find(c => c._id === subId); if (!c) return notFound();
      const summary = customerSummary(s, c);
      return ok({ success: true, customer: c, pointsByCafe: [{ userId: s.user._id, points: c.points, history: summary.history }] });
    }
    if (id === "user") { const c = s.customers.find(c => c._id === subId); return ok({ customerId: subId, userId: s.user._id, points: c?.points || 0 }); }
    if (id === "redeem") {
      const c = s.customers.find(c => c._id === body.customerId);
      const r = s.user.loyalty.rewards.find((r: DemoDocument) => r._id === body.rewardId);
      if (!c || !r) return notFound();
      if (!s.user.loyalty.isActive || !r.isActive) return invalid("جایزه غیرفعال است.");
      if (s.redemptions.some(x => x.customerId === c._id && x.rewardId === r._id)) return invalid("این جایزه قبلاً دریافت شده است.");
      if (c.points < r.requiredPoints) return invalid("امتیاز کافی ندارید.");
      const redemption = { _id: uid("demo-redemption"), customerId: c._id, userId: s.user._id, pointsUsed: r.requiredPoints, rewardId: r._id, rewardTitle: r.title, createdAt: new Date().toISOString() };
      c.points -= r.requiredPoints; s.redemptions.unshift(redemption);
      const coupon = { _id: uid("demo-coupon"), code: `DEMO${s.coupons.length + 1}`, customerId: c._id, userId: s.user._id, source: "loyalty", type: r.type, value: r.value, status: "active", isActive: true, createdAt: redemption.createdAt, expiresAt: r.expiresAt };
      s.coupons.push(coupon); return ok({ success: true, newPoints: c.points, redemption, coupon });
    }
  }
  if (resource === "coupons") {
    if (id === "apply") {
      const coupon = s.coupons.find(c => c.code === body.couponCode && c.status === "active" && c.isActive);
      if (!coupon || coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) return invalid("کوپن نامعتبر یا منقضی است.");
      const order = clone(body.order || {});
      if (coupon.type === "discount") order.totalPrice = Math.round(Number(order.totalPrice) * (1 - Number(coupon.value) / 100));
      return ok({ success: true, order, couponStatus: coupon.status });
    }
    if (!id) return ok(s.coupons.filter(c => !q.get("customerId") || c.customerId === q.get("customerId")));
    const c = s.coupons.find(c => c._id === id); if (!c) return notFound();
    if (method !== "GET") Object.entries(body).forEach(([k, v]) => { if (k !== "_id") c[k] = v; });
    return ok({ success: true, coupon: c });
  }
  if (resource === "zibal") {
    if (id === "request") return ok({ demo: true, payUrl: `/dashboard/payment/callback?trackId=demo&plan=${body.plan === "silver" ? "silver" : "gold"}` });
    s.user.plan = q.get("plan") === "silver" ? "silver" : "gold";
    return ok({ success: true, demo: true, message: "اشتراک نمایشی فعال شد؛ پرداختی انجام نشد." });
  }
  if (resource === "revalidates") return ok({ revalidated: true, demo: true });
  if (resource === "demo" && id === "reset") { Object.assign(s, createDemoState(new Date(), s.user.username)); return ok({ success: true }); }
  return notFound();
}
