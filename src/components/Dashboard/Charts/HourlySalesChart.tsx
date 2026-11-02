"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import separate from "@/utils/number";

type HourlySalesData = {
  hour: number;
  totalRevenue: number;
  orderCount: number;
}[];

interface HourlySalesChartProps {
  hourlySales: HourlySalesData;
}

const chartConfig = {
  totalRevenue: {
    label: "درآمد (تومان)",
    color: "hsl(var(--chart-5))",
  },
  orderCount: {
    label: "تعداد سفارش",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function HourlySalesChart({ hourlySales }: HourlySalesChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("totalRevenue");

  const total = React.useMemo(
    () => ({
      totalRevenue: hourlySales.reduce(
        (acc, curr) => acc + curr.totalRevenue,
        0
      ),
      orderCount: hourlySales.reduce((acc, curr) => acc + curr.orderCount, 0),
    }),
    [hourlySales]
  );

  return (
    <Card className="py-3 w-full max-h-80 flex flex-col">
      <CardContent className="px-4 sm:px-6 w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            پیک ساعات فروش
          </p>

          <Tabs
            defaultValue="totalRevenue"
            value={activeChart}
            onValueChange={(v) =>
              setActiveChart(v as keyof typeof chartConfig)
            }
          >
            <TabsList className="grid grid-cols-2 bg-transparent border rounded-md">
              <TabsTrigger
                value="totalRevenue"
                className="data-[state=active]:bg-primary/10 text-xs px-3 py-1"
              >
                بر اساس درآمد
              </TabsTrigger>
              <TabsTrigger
                value="orderCount"
                className="data-[state=active]:bg-primary/10 text-xs px-3 py-1"
              >
                بر اساس تعداد سفارش
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={hourlySales}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis tickFormatter={(value)=> separate(value)} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[120px]"
                  nameKey={activeChart}
                  labelFormatter={(hour) => `${hour}`}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={"hsl(var(--chart-2))"}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

      
      </CardContent>
    </Card>
  );
}
