"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns-jalali";
import separate from "@/utils/number";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowUpDown, CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoyaltyCustomers from "@/components/Dashboard/Loyalty/LoyaltyCustomers/LoyaltyCustomers";
import { IconWand } from "@tabler/icons-react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HourlySalesChart } from "@/components/Dashboard/Charts/HourlySalesChart";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const { data: session, status } = useSession();

  const [from, setFrom] = useState(() =>
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .slice(0, 16),
  );
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 16));

  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [hourlySales, setHourlySales] = useState<any[]>([]);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemsReport, setItemsReport] = useState<any | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const sortedItems =
    itemsReport?.items && Array.isArray(itemsReport.items)
      ? [...itemsReport.items].sort((a: any, b: any) => {
          if (!sortConfig) return 0;

          let aVal = a[sortConfig.key];
          let bVal = b[sortConfig.key];

          if (sortConfig.key === "lastOrderAt") {
            aVal = aVal ? new Date(aVal).getTime() : 0;
            bVal = bVal ? new Date(bVal).getTime() : 0;
          }

          if (typeof aVal === "string" && typeof bVal === "string") {
            const cmp = aVal.localeCompare(bVal, "fa");
            return sortConfig.direction === "asc" ? cmp : -cmp;
          }

          aVal = typeof aVal === "number" ? aVal : 0;
          bVal = typeof bVal === "number" ? bVal : 0;
          const cmp = aVal - bVal;
          return sortConfig.direction === "asc" ? cmp : -cmp;
        })
      : [];

  const fetchSales = async () => {
    if (!from || !to || !session?.user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reports/sales?from=${encodeURIComponent(
          new Date(from).toISOString(),
        )}&to=${encodeURIComponent(new Date(to).toISOString())}&userId=${
          session.user.id
        }`,
      );
      const json = await res.json();
      setSummary(json.summary);
      setChartData(json.chartData);
      setHourlySales(json.hourlySales);
      setCategoriesData(json.categories);
      setItemsData(json.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsReport = async () => {
    if (!from || !to || !session?.user?.id) return;
    setItemsLoading(true);
    try {
      const res = await fetch(
        `/api/reports/items?from=${encodeURIComponent(
          new Date(from).toISOString(),
        )}&to=${encodeURIComponent(new Date(to).toISOString())}&userId=${
          session.user.id
        }`,
      );
      const json = await res.json();
      setItemsReport(json);
    } catch (e) {
      console.error("Error fetching items report:", e);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchSales();
      fetchItemsReport();
    }
  }, [status]);

  const chartConfig = {
    sales: {
      label: "میزان فروش",
      color: "var(--chart-1)",
    },
    date: {
      label: "تاریخ",
      color: "red",
    },
  } satisfies ChartConfig;

  if (status === "loading")
    return (
      <div className="flex justify-center items-center w-full min-h-screen flex-col gap-4">
        <div className="spinner"></div>
        <p className="text-white" dir="rtl">
          لطفا صبر کنید...
        </p>
      </div>
    );
  const handleApplyFilter = () => {
    fetchSales();
    fetchItemsReport();
  };
  const itemsChartConfig = {
    totalRevenue: {
      label: "درآمد آیتم‌ها",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;
  const topItems = itemsReport?.itemsTop || [];

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };
  return (
    <Tabs defaultValue="overview" className="w-full space-y-6" dir="rtl">
      <div className="flex justify-between w-full flex-col md:flex-row gap-2">
        <div className="flex flex-col md:flex-row gap-2 col-span-1">
          <h1 className="text-2xl font-semibold">گزارش فروش</h1>
          <div className="flex gap-2 whitespace-nowrap items-center ">
            <span>از</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button className="w-full">
                  <CalendarIcon />
                  {from ? (
                    <span className="flex" dir="rtl">
                      {format(from, "PPP")}
                    </span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto">
                <Calendar
                  dir="rtl"
                  mode="single"
                  selected={new Date(from)}
                  onSelect={(date) => {
                    setFrom(new Date(date!).toDateString());
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2 items-center">
            <span>تا</span>
            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                <Button className="w-full">
                  <CalendarIcon />
                  {to ? (
                    <span className="flex" dir="rtl">
                      {format(to, "PPP")}
                    </span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto">
                <Calendar
                  dir="rtl"
                  mode="single"
                  selected={new Date(to)}
                  onSelect={(date) => {
                    setTo(new Date(date!).toDateString());
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={handleApplyFilter}
            disabled={loading || itemsLoading}
          >
            {loading || itemsLoading ? "در حال بارگذاری..." : "اعمال فیلتر"}
          </Button>
        </div>
        <TabsList className="flex justify-start gap-2 overflow-x-auto">
          <TabsTrigger value="overview">در یک نگاه</TabsTrigger>
          <p className="text-xs">در حال تکمیل...</p>
          {}
          {}
        </TabsList>
      </div>

      <TabsContent value="overview">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col  md:grid md:grid-cols-2 gap-6 items-center  col-span-4 max-h-screen overflow-hidden   w-full">
              {/* Summary Cards */}
              <div className="flex flex-col md:grid md:grid-cols-3  gap-4 md:col-span-5">
                <Card className="bg-gradient-to-tr from-purple-800 to-blue-800">
                  <CardContent className="flex w-full  h-full p-4 items-center justify-between">
                    <p className="font-bold">مجموع درآمد</p>
                    {separate(summary?.totalRevenue) || "-"} تومان
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-tr from-sky-800 to-blue-800">
                  <CardContent className="flex w-full h-full p-4  items-center justify-between">
                    <p className="font-bold">تعداد سفارش</p>
                    {separate(summary?.totalOrders) || "-"}
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-tr from-blue-800 to-purple-800">
                  <CardContent className="flex w-full h-full p-4 items-center  justify-between">
                    <p className="font-bold">میانگین هر سفارش</p>
                    {separate(summary?.avgOrderValue.toFixed(0)) || "-"} تومان
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2  gap-4">
              {/* Line chart daily income + pie top items */}
              <div className=" flex flex-col md:flex-row p-2 bg-black/20 rounded-lg justify-between gap-2 col-span-4 items-center w-full  md:max-h-[300px]">
                <div className="flex justify-center items-center w-full h-full">
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full flex justify-center items-center"
                  >
                    <LineChart
                      className="flex justify-center items-center w-full"
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => format(value, "PPP")}
                      />
                      <YAxis
                        dataKey="sales"
                        tickFormatter={(value) => separate(value)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        formatter={(value) => `میزان فروش: ${separate(value)}`}
                      />
                      <defs>
                        <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-sessionCount)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-sessionCount)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-sales)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-sales)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Line
                        dataKey="sales"
                        type="natural"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>

                <div className="flex items-center justify-center w-full h-full overflow-auto">
                  {itemsData.length ? (
                    <ResponsiveContainer>
                      <ChartContainer
                        config={chartConfig}
                        className="w-full h-full flex justify-center items-center overflow-auto"
                      >
                        <PieChart width={120} height={120}>
                          <Pie
                            data={itemsData.slice(0, 5)}
                            dataKey="totalRevenue"
                            nameKey="_id"
                            outerRadius={window.innerWidth < 600 ? 80 : 130}
                            labelLine={false}
                            label={({
                              cx,
                              cy,
                              midAngle,
                              outerRadius,
                              percent,
                              _id,
                              index,
                            }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = outerRadius;
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);

                              const item = itemsData[index];
                              return (
                                <text
                                  x={x > cx ? x + 50 : x - 50}
                                  y={y < cy ? y + 6 : y - 12}
                                  fill="#fff"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  fontSize={14}
                                >
                                  <tspan>
                                    {_id} - {separate(item.count!)} عدد
                                  </tspan>
                                  <tspan
                                    x={x}
                                    dy={20}
                                    className="shadow-lg font-semibold mt-2 "
                                  >
                                    {separate((percent * 100).toFixed(1))}%
                                  </tspan>
                                </text>
                              );
                            }}
                          >
                            {itemsData.map((entry: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${(index % 6) + 1}))`}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      داده‌ای برای نمایش وجود ندارد.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-5 w-full gap-4 col-span-4">
                <div className="flex flex-col col-span-1 gap-4 max-h-80 no-scrollbar overflow-hidden  rounded-2xl shadow-lg  ">
                  <Table>
                    <TableHeader className="bg-secondary sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="px-4 py-2 text-right">
                          آیتم
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                          تعداد فروش
                        </TableHead>
                        <TableHead className="px-4 py-2 text-right">
                          درآمد
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="z-0 max-h-32 no-scrollbar  overflow-y-auto">
                      {itemsData.map((i: any, idx: number) => (
                        <TableRow key={i._id}>
                          <TableCell className="px-4 py-2">{i._id}</TableCell>
                          <TableCell className="px-4 py-2">{i.count}</TableCell>
                          <TableCell className="px-4 py-2">
                            {separate(i.totalRevenue.toFixed(0))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex w-full overflow-auto  max-h-80 col-span-3 gap-4 justify-center items-center">
                  <HourlySalesChart hourlySales={hourlySales} />
                </div>
                <div className="col-span-1 max-h-80">
                  <div className="flex flex-col gap-2 h-full overflow-auto ">
                    <div className="flex items-center gap-2 text-lg font-bold mb-4">
                      <IconWand />
                      <p className="text-transparent  bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                        تحلیل هوشمندانه فروش
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm leading-relaxed">
                      {summary && (
                        <>
                          {itemsData?.length > 0 && (
                            <p className="p-1 rounded-lg bg-gradient-to-bl from-green-700 to bg-green-950">
                              💰 پرفروش‌ترین آیتم شما در این بازه{" "}
                              <span className="font-bold text-primary">
                                {itemsData[0]._id}
                              </span>{" "}
                              بوده با مجموع فروش{" "}
                              <span className="font-bold">
                                {separate(itemsData[0].totalRevenue)} تومان
                              </span>
                              .
                            </p>
                          )}

                          {summary?.totalOrders > 0 && (
                            <p className="p-1 rounded-lg bg-gradient-to-bl from-blue-700 to bg-blue-950">
                              📦 در این بازه زمانی، در مجموع{" "}
                              <span className="font-bold">
                                {separate(summary.totalOrders)}
                              </span>{" "}
                              سفارش ثبت شده و میانگین ارزش هر سفارش{" "}
                              <span className="font-bold">
                                {separate(summary.avgOrderValue.toFixed(0))}{" "}
                                تومان
                              </span>{" "}
                              بوده.
                            </p>
                          )}

                          {chartData?.length > 0 && (
                            <>
                              <p className="p-1 rounded-lg bg-gradient-to-bl from-purple-700 to bg-purple-950">
                                📈 بیشترین فروش در{" "}
                                <span className="font-bold text-primary">
                                  {format(
                                    chartData[chartData.length - 1]?.date,
                                    "PPP",
                                  )}
                                </span>{" "}
                                اتفاق افتاده.
                              </p>
                              <p className="p-1 rounded-lg bg-gradient-to-bl from-red-700 to bg-red-950">
                                📉 کمترین فروش در{" "}
                                <span className="font-bold text-primary">
                                  {format(chartData[0]?.date, "PPP")}
                                </span>{" "}
                                بوده.
                              </p>
                            </>
                          )}

                          {!summary?.totalOrders && (
                            <p className="text-gray-300">
                              هنوز سفارشی در این بازه ثبت نشده تا بینش داده شود.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </TabsContent>

      {/* <TabsContent value="categories">
        {itemsLoading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        ) : !itemsReport ? (
          <p className="text-sm text-muted-foreground">
            هنوز گزارشی برای آیتم‌ها وجود ندارد.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-gradient-to-tr from-emerald-800 to-emerald-600">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    تعداد کل آیتم‌های فروخته‌شده
                  </p>
                  <p className="text-xl font-bold">
                    {separate(itemsReport.summary.totalItemsSold || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-tr from-sky-800 to-sky-600">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-medium">آیتم‌های پولی</p>
                  <p className="text-xl font-bold">
                    {separate(itemsReport.summary.totalPaidItems || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-tr from-purple-800 to-purple-600">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-medium">آیتم‌های رایگان</p>
                  <p className="text-xl font-bold">
                    {separate(itemsReport.summary.totalFreeItems || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-tr from-orange-800 to-orange-600">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    مجموع تخفیف‌ها / رایگان‌ها
                  </p>
                  <p className="text-xl font-bold">
                    {separate(
                      Math.max(
                        0,
                        (itemsReport.summary.baseRevenue || 0) -
                          (itemsReport.summary.totalRevenue || 0)
                      )
                    )}{" "}
                    تومان
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className=" flex flex-col md:grid md:grid-cols-3 items-center h-full gap-4">
              <Card className="col-span-2 w-full">
                <CardContent className="w-full">
                  <ChartContainer
                    config={itemsChartConfig}
                    className="w-full h-72"
                    style={{ height: Math.max(topItems.length * 36, 260) }}
                  >
                    <BarChart
                      accessibilityLayer
                      data={itemsReport.items.slice(0, 10)}
                      layout="vertical"
                      margin={{
                        top: 8,
                        right: 16,
                        left: 80,
                        bottom: 8,
                      }}
                      barCategoryGap={12}
                    >
                      <XAxis type="number" dataKey="totalRevenue" hide />

                      <YAxis
                        dataKey="itemName"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={120}
                        tickMargin={70}
                        tickFormatter={(value: string) =>
                          value && value.length > 18
                            ? value.slice(0, 18) + "…"
                            : value
                        }
                      />

                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        formatter={(value) =>
                          `${separate(value as number)} تومان`
                        }
                      />

                      <Bar
                        dataKey="totalRevenue"
                        radius={50}
                        barSize={28}
                        fill="var(--color-totalRevenue)"
                      >
                        {itemsReport.items.map((entry: any, index: number) => (
                          <Cell
                            key={entry.itemId ?? index}
                            fill={`hsl(var(--chart-${
                              ((index % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6
                            }))`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className=" space-y-2 text-sm leading-relaxed">
                  {itemsReport.items.length > 0 && (
                    <p className="p-2 rounded-lg bg-gradient-to-br from-green-700 to-green-950">
                      🏆 پرفروش‌ترین آیتم شما{" "}
                      <span className="font-bold text-primary">
                        {itemsReport.items[0].itemName}
                      </span>{" "}
                      است با مجموع فروش{" "}
                      <span className="font-bold">
                        {separate(itemsReport.items[0].totalQty)} عدد
                      </span>{" "}
                      و درآمد{" "}
                      <span className="font-bold">
                        {separate(itemsReport.items[0].totalRevenue)} تومان
                      </span>
                      .
                    </p>
                  )}

                  {itemsReport.items.length > 0 && (
                    <p className="p-2 rounded-lg bg-gradient-to-br from-blue-700 to-blue-950">
                      📦 در این بازه{" "}
                      <span className="font-bold">
                        {separate(itemsReport.summary.totalItemsSold || 0)}
                      </span>{" "}
                      آیتم فروخته شده که{" "}
                      <span className="font-bold">
                        {separate(itemsReport.summary.totalPaidItems || 0)}
                      </span>{" "}
                      عدد آن پولی و{" "}
                      <span className="font-bold">
                        {separate(itemsReport.summary.totalFreeItems || 0)}
                      </span>{" "}
                      عدد رایگان بوده.
                    </p>
                  )}

                  {itemsReport.items.length === 0 && (
                    <p className="text-muted-foreground">
                      در این بازه زمانی آیتمی فروخته نشده است.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-transparent border-none">
              <CardContent className="max-h-[450px] w-full p-1 overflow-auto rounded-sm">
                <Table className="rounded-lg">
                  <TableHeader className="bg-secondary sticky top-0 z-1 text-right rounded-lg">
                    <TableRow className="rounded-lg text-right">
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("itemName")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          آیتم
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("totalQty")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          تعداد کل
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("paidQty")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          پولی / رایگان
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("totalRevenue")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          درآمد (تومان)
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("avgQtyPerOrder")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          میانگین در هر سفارش
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 text-right"
                          onClick={() => handleSort("lastOrderAt")}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                          آخرین سفارش
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedItems.map((i: any) => (
                      <TableRow key={i.itemId}>
                        <TableCell className="font-medium">
                          {i.itemName}
                          {i.secondItemName && (
                            <span className="block text-xs text-muted-foreground">
                              {i.secondItemName}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>{separate(i.totalQty)}</TableCell>

                        <TableCell>
                          <span className="text-emerald-300">
                            {separate(i.paidQty)}
                          </span>{" "}
                          /{" "}
                          <span className="text-amber-300">
                            {separate(i.freeQty)}
                          </span>
                        </TableCell>

                        <TableCell>{separate(i.totalRevenue)} تومان</TableCell>

                        <TableCell>
                          {i.avgQtyPerOrder ? i.avgQtyPerOrder.toFixed(2) : "-"}
                        </TableCell>

                        <TableCell>
                          {i.lastOrderAt
                            ? format(new Date(i.lastOrderAt), "PPP")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent> */}

      {/* <TabsContent value="loyalty">
        <div className="flex flex-col items-center justify-center">
          <LoyaltyCustomers userId={session?.user.id} />
        </div>
      </TabsContent> */}
    </Tabs>
  );
};

export default Page;
