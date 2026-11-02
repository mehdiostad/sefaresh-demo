import menu from "./menu.json";
import calmaMenu from "./menu-calma.json";
import maryaMenu from "./menu-marya.json";

export const DEMO_OTP = "123456";
export const DEMO_USERNAME = "cafe_elm";
export const DEMO_OWNER_ID = "686fdd23a9b7f9804efef2b8";
export const DEMO_PHONE = "09000000000";
export const DEMO_NOTICE =
  "نسخهٔ دموی بازسازی‌شده با داده‌های نمونه؛ سرویس اصلی دیگر فعال نیست.";
// The loose document shape matches the existing MongoDB/API contracts at the demo boundary.
export type DemoDocument = Record<string, any>;
export interface DemoState {
  version: number;
  user: DemoDocument;
  menu: DemoDocument[];
  orders: DemoDocument[];
  customers: DemoDocument[];
  coupons: DemoDocument[];
  redemptions: DemoDocument[];
  customer: DemoDocument | null;
  assets: Record<string, string>;
}
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export const DEMO_CAFES = [
  {
    username: DEMO_USERNAME,
    id: DEMO_OWNER_ID,
    name: "کافه علم",
    theme: "cafe_elm",
    menuLogo: "cafe-elm.svg",
    menu,
    address: "تهران، باغ کتاب، طبقهٔ اول — اطلاعات نمایشی",
    aliases: ["cafeelm", "cafe-elm", "elm", "demo"],
  },
  {
    username: "cafe_calma",
    id: "687e85b717e533442f533458",
    name: "کافه کالما",
    theme: "cafe_calma",
    menuLogo: "/demo/item-placeholder.svg",
    menu: calmaMenu,
    address: "کافه کالما — اطلاعات نمایشی",
    aliases: ["calma", "cafecalma", "cafe-calma"],
  },
  {
    username: "cafe_marya",
    id: "686e5a02465e77aeb2cd8709",
    name: "کافه ماریا",
    theme: "forest",
    menuLogo: "/demo/item-placeholder.svg",
    menu: maryaMenu,
    address: "کافه ماریا — اطلاعات نمایشی",
    aliases: [
      "marya",
      "maria",
      "cafemarya",
      "cafe-marya",
      "cafe_maria",
      "cafemaria",
      "cafe-maria",
    ],
  },
] as const;
export function resolveDemoCafe(name?: string | null) {
  if (!name) return DEMO_CAFES[0];
  return DEMO_CAFES.find(
    (c) =>
      c.username === name ||
      c.id === name ||
      (c.aliases as readonly string[]).includes(name),
  );
}
export const isDemoUsername = (name?: string | null) => !!resolveDemoCafe(name);

export function createDemoState(
  now = new Date(),
  username = DEMO_USERNAME,
): DemoState {
  const cafe = resolveDemoCafe(username) || DEMO_CAFES[0];
  const ago = (days: number, hours = 0) =>
    new Date(now.getTime() - days * 86400000 - hours * 3600000).toISOString();
  const user: DemoDocument = {
    _id: cafe.id,
    id: cafe.id,
    username: cafe.username,
    email: "demo@example.com",
    role: "admin",
    multiLang: true,
    menuName: cafe.name,
    menuLogo: cafe.menuLogo,
    menuId: `demo-menu-${cafe.username}`,
    isOnboarded: true,
    phone: DEMO_PHONE,
    address: cafe.address,
    description: DEMO_NOTICE,
    createdAt: ago(180),
    theme: cafe.theme,
    plan: "gold",
    isPlanActive: true,
    planExpiresAt: new Date(now.getTime() + 365 * 86400000).toISOString(),
    loyalty: {
      isActive: true,
      pointRate: 10000,
      rewards: [
        {
          _id: "demo-reward-discount",
          title: "۱۰ درصد تخفیف سفارش",
          requiredPoints: 50,
          type: "discount",
          value: 10,
          isActive: true,
          expiresAt: null,
        },
        {
          _id: "demo-reward-coffee",
          title: "یک قهوه مهمان ما",
          requiredPoints: 80,
          type: "freeItem",
          value:
            cafe.menu
              .flatMap((c) => c.items)
              .find((i) => i.available && i.price > 0)?._id || "",
          isActive: true,
          expiresAt: null,
        },
      ],
    },
  };
  const customers = [
    "مهمان دمو",
    "سارا احمدی",
    "علی رضایی",
    "نگار محمدی",
    "آرمان کریمی",
    "مریم حسینی",
  ].map((fullname, i) => ({
    _id: `demo-customer-${i}`,
    id: `demo-customer-${i}`,
    fullname,
    phone: `0900000000${i}`,
    points: 160 + i * 25,
  }));
  const fullMenu: DemoDocument[] = clone(cafe.menu);
  if (cafe.username === "cafe_marya") {
    // Exclude the three obvious development/test entries from the public resume demo.
    const testIds = new Set([
      "68cebfe04933874e574aeb1d",
      "68ceadb54933874e574ae720",
      "68ceacb34933874e574ae708",
    ]);
    fullMenu.forEach((c) => {
      c.items = c.items.filter((i: DemoDocument) => !testIds.has(i._id));
    });
  }
  if (cafe.username === "cafe_calma") {
    // These available coffee rows have price=0 in the export; use explicit mock prices.
    const demoPrices: Record<string, number> = {
      امریکن: 95000,
      لته: 110000,
      کورتادو: 100000,
      کاپوچینو: 110000,
      "کارامل ماکیاتو": 135000,
      موکا: 135000,
    };
    fullMenu
      .flatMap((c) => c.items)
      .forEach((i) => {
        if (i.available && i.price === 0 && demoPrices[i.itemName]) {
          i.originalPrice = 0;
          i.price = demoPrices[i.itemName];
          i.demoPrice = true;
        }
      });
  }
  const sellable = fullMenu
    .flatMap((c) => c.items)
    .filter((i) => i.available && i.price > 0);
  const orders: DemoDocument[] = [];
  for (let day = 0; day < 30; day++) {
    for (let n = 0; n < 3 + (day % 4); n++) {
      const customer = customers[(day + n) % customers.length];
      const chosen = [
        sellable[(day * 3 + n) % sellable.length],
        sellable[(day + n * 5 + 2) % sellable.length],
      ];
      const orderItems = chosen.map((i, k) => ({
        id: i._id,
        _id: i._id,
        name: i.itemName,
        price: i.price,
        qty: k === 0 ? 2 : 1,
        img: i.img,
        categoryId: i.categoryId,
        free: false,
      }));
      const baseTotal =
        orderItems.reduce((sum, i) => sum + i.price * i.qty, 0) *
        (user.theme === "cafe_elm" ? 1.1 : 1);
      const status =
        day === 0
          ? ["pending", "preparing", "ready"][n % 3]
          : day % 9 === 0 && n === 0
            ? "cancelled"
            : "delivered";
      orders.push({
        _id: `demo-order-${day}-${n}`,
        orderId: 1400 + orders.length,
        userId: cafe.id,
        username: cafe.username,
        user: clone(user),
        customer: {
          name: customer.fullname,
          phone: customer.phone,
          table: String(n + 1),
        },
        items: orderItems,
        baseTotal: Math.round(baseTotal),
        total: Math.round(baseTotal),
        status,
        earnedPoints:
          status === "delivered"
            ? Math.floor(baseTotal / user.loyalty.pointRate)
            : 0,
        redeemedPoints: 0,
        createdAt: ago(day, n * 2 + 0.2),
        note: n === 1 ? "لطفاً بدون شکر آماده شود." : "",
      });
    }
  }
  const coupons = [
    {
      _id: "demo-coupon-1",
      code: "DEMO10",
      customerId: customers[0]._id,
      userId: cafe.id,
      type: "discount",
      value: 10,
      status: "active",
      source: "campaign",
      isActive: true,
      createdAt: ago(1),
      expiresAt: new Date(now.getTime() + 365 * 86400000).toISOString(),
    },
  ];
  return {
    version: 1,
    user,
    menu: fullMenu,
    orders,
    customers,
    coupons,
    redemptions: [],
    customer: null,
    assets: {},
  };
}
export function dashboardUser(state: DemoState): IDashboardUser {
  return {
    ...clone(state.user),
    menuLogo: imageUrl(state.user.menuLogo, "userLogos", state),
  } as IDashboardUser;
}
export function imageUrl(
  name?: string,
  folder = "items",
  state?: DemoState,
): string {
  if (!name) return "/demo/item-placeholder.svg";
  if (/^(data:|blob:|https?:\/\/|\/)/.test(name)) return name;
  const path = `/demo-assets/${folder}/${name}`;
  return state?.assets[path] || path;
}
