"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fetcher } from "@/lib/fetcher";
import { useDashboardData } from "@/stores/useDashboardData";
import separate from "@/utils/number";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useSWR from "swr";

const chartConfig = {
  you: {
    label: "منوی شما",
    color: "hsl(var(--chart-3))",
  },
  others: {
    label: "منوی دیگران",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const AppBarChart = () => {
  const user = useDashboardData((s) => s.user);
  // const [isLoading, setIsLoading] = useState(false);
  // const [barChartData, setBarChartData] = useState<
  //   { day: string; you: number; others: string }[]
  // >([]);
  const {
    data: barChartData,
    isLoading,
    error,
  } = useSWR(`/api/stats/barchart?username=${user?.username}`, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });
  return (
    <div className="h-full w-full flex flex-col gap-1">
      <CardTitle>مقایسه بازدید روزانه شما با میانگین بقیه کافه ها</CardTitle>
      {error ? (
        <div className="text-red-500 text-center mt-4">
          خطا در دریافت اطلاعات،لطفا منتظر بمانید.
        </div>
      ) : isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="spinner" />
        </div>
      ) : (
        <ChartContainer config={chartConfig} className=" max-h-[350px] w-full">
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => separate(value.split("-")[0])}
              tick={{ fill: "var(--text-secondary)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="you" fill="var(--color-you)" radius={4} />
            <Bar dataKey="others" fill="var(--color-others)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default AppBarChart;
