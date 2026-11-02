"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { useEffect, useState, useMemo, useCallback } from "react";
import { format } from "date-fns-jalali";

import separate from "@/utils/number";

import {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import useSWR from "swr";

type MonthlyDataItem = { y: number };
type PieChartData = {
  monthlyData: MonthlyDataItem[];
  thisWeekData?: MonthlyDataItem[];
  lastWeekData?: MonthlyDataItem[];
  dailyData?: MonthlyDataItem[];
  changePercent: number;
};

const staticChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
  safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  edge: { label: "Edge", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const calculateChangePercent = (
  last: MonthlyDataItem[] = [],
  current: MonthlyDataItem[] = []
): number => {
  if (current.length === 0 && last.length === 0) return 0;
  if (current.length === 0) return -100;
  if (last.length === 0) return 100;

  const sum = (arr: MonthlyDataItem[]) =>
    arr.reduce((acc, cur) => acc + cur.y, 0);
  const currentSum = sum(current);
  const lastSum = sum(last);
  return ((currentSum - lastSum) / (currentSum + lastSum)) * 100;
};

function getTotalVisitors(data: PieChartData, view: "this-month" | "today") {
  const source =
    view === "this-month" ? data.monthlyData : data.dailyData || [];
  return source.reduce((acc, cur) => acc + cur.y, 0);
}

function PieChartSection({
  value,
  data,
  isLoading,
}: {
  value: "this-month" | "today";
  data: PieChartData;
  isLoading: boolean;
}) {
  const total = useMemo(() => getTotalVisitors(data, value), [data, value]);

  return (
    <div className={isLoading ? "h-full" : ""}>
      <CardContent className="flex-1 pb-0 h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="spinner" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <Pie
                data={staticChartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }: { viewBox?: any }) => {
                    const cx = viewBox?.cx;
                    const cy = viewBox?.cy;
                    if (cx && cy) {
                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={cx}
                            y={cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {separate(total)}
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 24}
                            className="fill-muted-foreground"
                          >
                            بازدید
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      {!isLoading && value === "this-month" && data.changePercent !== 0 && (
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.changePercent > 0 ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
            <span className="text-sm font-medium">
              {separate(data.changePercent.toFixed(0))}%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            نسبت به هفته گذشته
          </span>
        </CardFooter>
      )}
    </div>
  );
}

export function AppPieChart({ username }: { username: string }) {
  const [value, setValue] = useState<"this-month" | "today">("this-month");

  const { data: fetchedData, isLoading } = useSWR(
    `/api/stats/piechart?username=${username}`,
    async (url) => {
      const res = await fetch(url);
      const result = await res.json();
      const changePercent = calculateChangePercent(
        result.lastWeekData,
        result.thisWeekData
      );
      return {
        monthlyData: result.monthlyData,
        dailyData: result.dailyData,
        changePercent,
      } satisfies PieChartData;
    },
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  const data: PieChartData = fetchedData ?? {
    monthlyData: [],
    changePercent: 0,
  };

  return (
    <Tabs defaultValue="this-month" className="h-full">
      <div className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
          <TabsList>
            <TabsTrigger
              value="this-month"
              onClick={() => setValue("this-month")}
            >
              <CardTitle>بازدید این ماه شما</CardTitle>
            </TabsTrigger>
            <TabsTrigger value="today" onClick={() => setValue("today")}>
              <CardTitle>بازدید امروز شما</CardTitle>
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <TabsContent value="this-month" className="h-full">
          <PieChartSection
            value="this-month"
            data={data}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="today" className="h-full">
          <PieChartSection value="today" data={data} isLoading={isLoading} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
