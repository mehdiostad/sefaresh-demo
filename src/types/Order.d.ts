interface OrderEvent {
  _id: string;
  userId:any
  username: string;
  orderId: number;
  baseTotal: number
  total: number;
  user?:{
    menuName:string
    menuLogo:string
    _id:string
    loyalty?:{
      pointRate?:number
      rewards?:IReward[]
    }
  }
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  note?: string;
  customer: { name: string; table?: string; phone: string };
  items: OrderItem[];
  createdAt: string;
  appliedCouponId?:Coupon | string;
  earnedPoints?: number;
  redeemedPoints?: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img?:string
  free?:boolean
}
