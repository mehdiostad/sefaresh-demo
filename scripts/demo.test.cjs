const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sefaresh-demo-test-'));
for (const name of ['seed', 'api', 'browser']) {
  const source = fs.readFileSync(path.join(__dirname, '../src/demo', name + '.ts'), 'utf8');
  fs.writeFileSync(path.join(dir, name + '.js'), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021, esModuleInterop: true } }).outputText);
}
for (const file of ['menu.json', 'menu-calma.json', 'menu-marya.json']) fs.copyFileSync(path.join(__dirname, '../src/demo', file), path.join(dir, file));
const { createDemoState, DEMO_PHONE, DEMO_OWNER_ID, resolveDemoCafe } = require(path.join(dir, 'seed.js'));
const { demoRequest } = require(path.join(dir, 'api.js'));
const call = (s, path, method = 'GET', body) => demoRequest(s, new URL('https://demo.test/api/' + path), method, body);
const login = s => call(s, 'auth/otp/verify', 'POST', { phone: DEMO_PHONE, code: '123456', name: 'مهمان دمو' });

test.after(() => fs.rmSync(dir, { recursive: true, force: true }));
test('Cafe Elm retains all 71 real menu items and all 10 categories; every English label exists', () => {
  const s = createDemoState(); assert.equal(s.menu.length, 10);
  const items = s.menu.flatMap(c => c.items); assert.equal(items.length, 71);
  items.forEach(i => { assert.ok(i.secondItemName && /[a-z]/i.test(i.secondItemName)); assert.equal(typeof i.price, 'number'); });
  assert.ok(s.menu.some(c => c.items.some(i => !i.available)));
});
test('OTP rejects wrong codes and accepts Persian digits with no service calls', async () => {
  const s = createDemoState();
  assert.equal((await call(s, 'auth/otp/verify', 'POST', { phone: DEMO_PHONE, code: '000000' })).status, 400);
  assert.equal(s.customer, null);
  const good = await call(s, 'auth/otp/verify', 'POST', { phone: '۰۹۰۰۰۰۰۰۰۰۰', code: '۱۲۳۴۵۶', name: 'مهمان دمو' });
  assert.equal(good.status, 200); assert.equal(s.customer.role, 'customer');
});
test('category and item CRUD, reorder, English labels and visitor isolation', async () => {
  const a = createDemoState(), b = createDemoState();
  const category = (await call(a, 'categories', 'POST', { title: 'دستهٔ نمونه' })).data;
  const item = (await call(a, 'items', 'POST', { categoryId: category._id, itemName: 'قهوه تست', price: 85000, secondItemName: 'Test Coffee' })).data;
  assert.equal(item.secondItemName, 'Test Coffee');
  await call(a, 'items/' + item._id, 'PUT', { price: '95000', available: false });
  assert.equal((await call(a, 'items/' + item._id)).data.price, 95000);
  await call(a, 'categories/' + category._id, 'PATCH', { pageNumber: 1 });
  await call(a, 'items/' + item._id, 'DELETE'); assert.equal((await call(a, 'items/' + item._id)).status, 404);
  await call(a, 'categories/' + category._id, 'DELETE'); assert.equal(a.menu.length, 10);
  assert.equal(b.menu.length, 10); assert.equal(b.customer, null); assert.equal(b.menu.flatMap(c => c.items).length, 71);
});
test('orders require demo login; creation is local, coupon reservation prevents reuse; status points are idempotent', async () => {
  const s = createDemoState(); const body = { items: [{ id: '68713779a9b7f9804efef3a4', name: 'آمریکانو', price: 110000, qty: 2 }], customer: { table: 5 }, appliedCouponId: 'demo-coupon-1' };
  assert.equal((await call(s, 'orders', 'POST', body)).status, 401);
  await login(s); const created = await call(s, 'orders', 'POST', body);
  assert.equal(created.status, 201); assert.equal(created.event.name, 'new-order'); assert.equal(created.data.total, 217800);
  assert.equal((await call(s, 'orders', 'POST', body)).status, 400);
  const before = s.customers[0].points;
  const delivered = await call(s, 'orders/' + created.data._id, 'PATCH', { status: 'delivered' });
  assert.equal(s.customers[0].points, before + delivered.data.earnedPoints);
  await call(s, 'orders/' + created.data._id, 'PATCH', { status: 'delivered' });
  assert.equal(s.customers[0].points, before + delivered.data.earnedPoints);
  await call(s, 'orders/' + created.data._id, 'PATCH', { status: 'cancelled' });
  assert.equal(s.customers[0].points, before); assert.equal(s.coupons[0].status, 'active');
  assert.ok((await call(s, 'orders?phonenumber=' + DEMO_PHONE)).data.some(o => o._id === created.data._id));
});
test('loyalty redemption spends points once and issues a usable coupon', async () => {
  const s = createDemoState(); await login(s);
  const body = { customerId: s.customer.id, userId: DEMO_OWNER_ID, rewardId: 'demo-reward-coffee' };
  const r = await call(s, 'loyalty/redeem', 'POST', body);
  assert.equal(r.status, 200); assert.equal(r.data.newPoints, 80); assert.equal(r.data.coupon.type, 'freeItem');
  assert.equal((await call(s, 'loyalty/redeem', 'POST', body)).status, 400);
  assert.equal(s.customers[0].points, 80);
});
test('reports reconcile delivered orders and respect dates and empty filters', async () => {
  const s = createDemoState(); const from = new Date(Date.now() - 7 * 86400000).toISOString(), to = new Date().toISOString();
  const response = await call(s, `reports/sales?from=${from}&to=${to}`);
  const orders = s.orders.filter(o => o.status === 'delivered' && o.createdAt >= from && o.createdAt <= to);
  assert.equal(response.data.summary.totalOrders, orders.length);
  response.data.items.forEach(i => assert.ok(/[\u0600-\u06ff]/.test(i._id), "sales API must retain the item-name contract"));
  assert.equal(response.data.summary.totalRevenue, orders.reduce((a, o) => a + o.total, 0));
  assert.equal(response.data.chartData.reduce((a, d) => a + d.sales, 0), response.data.summary.totalRevenue);
  const items = (await call(s, `reports/items?from=${from}&to=${to}`)).data;
  assert.equal(items.summary.totalItemsSold, items.items.reduce((a, i) => a + i.totalQty, 0));
  const empty = (await call(s, 'reports/sales?from=2100-01-01&to=2100-01-02')).data;
  assert.equal(empty.summary.totalRevenue, 0); assert.deepEqual(empty.chartData, []);
});
test('payment simulation stays on site and reset restores seed', async () => {
  const s = createDemoState();
  const p = await call(s, 'zibal/request', 'POST', { plan: 'gold' });
  assert.ok(p.data.payUrl.startsWith('/dashboard/')); assert.equal(p.data.demo, true);
  s.menu = []; await call(s, 'demo/reset', 'POST'); assert.equal(s.menu.length, 10);
});


test('Calma and Marya preserve their own real catalogs, themes, aliases and independent orders', async () => {
  const elm = createDemoState();
  const calma = createDemoState(new Date(), 'cafe_calma');
  const marya = createDemoState(new Date(), 'cafe_marya');
  assert.equal(calma.menu.length, 6); assert.equal(calma.menu.flatMap(c => c.items).length, 33);
  assert.equal(marya.menu.length, 5); assert.equal(marya.menu.flatMap(c => c.items).length, 39);
  assert.ok(calma.menu.flatMap(c => c.items).filter(i => i.available).every(i => i.price > 0));
  assert.equal(calma.menu.flatMap(c => c.items).filter(i => i.demoPrice).length, 6);
  assert.ok(!marya.menu.flatMap(c => c.items).some(i => /dfas|asdf|نئنمئمنئم/.test(i.itemName)));
  assert.equal(calma.user.theme, 'cafe_calma'); assert.equal(marya.user.theme, 'cafe_marya');
  assert.equal(resolveDemoCafe('calma').id, calma.user._id);
  assert.equal(resolveDemoCafe('maria').id, marya.user._id);
  assert.equal((await call(elm, 'full_menu?username=cafe_calma')).status, 404);
  assert.equal((await call(calma, 'full_menu?username=calma')).data.length, 6);
  assert.ok(calma.menu.every(c => c.userId === calma.user._id));
  assert.ok(marya.menu.every(c => c.userId === marya.user._id));
  assert.ok(calma.orders.every(o => o.userId === calma.user._id));
  const counts = [elm.orders.length, marya.orders.length];
  await login(calma);
  const item = calma.menu.flatMap(c => c.items).find(i => i.available && i.price > 0);
  const response = await call(calma, 'orders', 'POST', { username: 'calma', items: [{ id: item._id, name: item.itemName, qty: 1, price: item.price }] });
  assert.equal(response.status, 201); assert.equal(response.data.username, 'cafe_calma');
  assert.equal(response.data.userId, calma.user._id); assert.equal(response.data.total, item.price);
  assert.deepEqual([elm.orders.length, marya.orders.length], counts);
  const points = await call(calma, 'loyalty/customer/demo-customer-0');
  assert.equal(points.data.pointsByCafe[0].userId, calma.user._id);
  await call(calma, 'demo/reset', 'POST'); assert.equal(calma.user.username, 'cafe_calma'); assert.equal(calma.menu.length, 6);
});


test('browser transport isolates cafe storage and captures cafe scope before queued requests run', async () => {
  const previousWindow = global.window, previousStorage = global.localStorage;
  const storage = new Map();
  const target = new EventTarget();
  target.location = { pathname: '/cafe_calma', origin: 'https://demo.test', assign() {} };
  target.fetch = async () => { throw new Error('demo API must not call the network'); };
  global.window = target;
  global.localStorage = { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) };
  try {
    const browser = require(path.join(dir, 'browser.js'));
    browser.installDemoTransport();
    const loginRequest = window.fetch('/api/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone: DEMO_PHONE, code: '123456', name: 'مهمان کالما' }) });
    window.location.pathname = '/cafe_marya';
    const result = await loginRequest;
    assert.equal(result.status, 200);
    assert.equal(browser.readDemoState('cafe_calma').customer.fullname, 'مهمان کالما');
    assert.equal(browser.readDemoState('cafe_marya').customer, null);
    assert.equal(browser.readDemoState('cafe_elm').customer, null);
    const menu = await window.fetch('/api/full_menu?username=maria');
    assert.equal((await menu.json()).length, 5);
    assert.notEqual(browser.demoStorageKey('cafe_calma'), browser.demoStorageKey('cafe_marya'));
    assert.equal(browser.readDemoState('cafe_calma').user.menuName, 'کافه کالما');
    assert.equal(browser.readDemoState('maria').user.menuName, 'کافه ماریا');
  } finally {
    global.window = previousWindow; global.localStorage = previousStorage;
  }
});
