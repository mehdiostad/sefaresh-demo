import CardList from "@/components/Dashboard/CardList/CardList";
import { AppAreaChart } from "@/components/Dashboard/Charts/AppAreaChart";
import AppBarChart from "@/components/Dashboard/Charts/AppBarChart";
import { AppPieChart } from "@/components/Dashboard/Charts/AppPieChart";
import OrdersLive from "@/components/Dashboard/Orders/OrdersLive/OrdersLive";
import QRCode from "@/components/Dashboard/QRcode/QrCode";
import { authOptions } from "@/lib/authOptions";
import { getDemoSession as getServerSession } from "@/demo/server";

const page = async () => {
  const session = await getServerSession(authOptions);
  const username = session?.user.role === "admin" ? session?.user.username : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 no-scrollbar xl:h-[800px]">
      <div className="dark:bg-muted/10 bg-muted/60 p-4 rounded-lg lg:col-span-2  xl:col-span-1 2xl:col-span-2 max-h-[400px] overflow-auto">
        <AppBarChart />
      </div>
      <div className="dark:bg-muted/10 bg-muted/60  rounded-lg max-h-[400px] overflow-auto no-scrollbar">
      <OrdersLive ownerId={username || ""} />
        {/* <QRCode
          menuUrl={`${process.env.BASE_URL}/${session?.user.username}`}
          userId={session?.user?.id || ""}
        /> */}
      </div>
      <div className="dark:bg-muted/10 bg-muted/60 p-4 rounded-lg max-h-[400px] overflow-auto">
        <AppPieChart username={username || ""} />
      </div>
      <div className="dark:bg-muted/10 bg-muted/60  rounded-lg max-h-[400px] overflow-auto no-scrollbar">
        <CardList title="همه آیتم های شما" />
      </div>
      <div className="dark:bg-muted/10 bg-muted/60 p-4 rounded-lg max-h-[400px] overflow-auto lg:col-span-2  xl:col-span-1 2xl:col-span-2">
        <AppAreaChart username={username || ""} />
      </div>
      <div className="dark:bg-muted/10 bg-muted/60 rounded-lg max-h-[400px] overflow-auto no-scrollbar">
        <CardList title="همه صفحات شما" />
      </div>
    </div>
  );
};

export default page;
