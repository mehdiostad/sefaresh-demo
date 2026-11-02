"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import useSWR, { useSWRConfig } from "swr";

import { CardContent, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import separate from "@/utils/number";
import { fetcher } from "@/lib/fetcher";

const chartConfig = {
  sessionCount: {
    label: "تعداد افراد",
    color: "hsl(var(--chart-1))",
  },
  totalCount: {
    label: "کل بازدیدها",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AppAreaChart({ username }: { username: string }) {
  const {
    data: areaChartData,
    isLoading,
    error,
  } = useSWR(`/api/stats/areachart?username=${username}`, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateIfStale: true,
    revalidateOnFocus: true,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CardTitle className="flex items-center">بازدید های روزانه</CardTitle>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-4">
          خطا در دریافت اطلاعات،لطفا منتظر بمانید.
        </div>
      ) : (
        <CardContent>
          <ChartContainer className="max-h-[340px] w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={areaChartData}
              margin={{ left: 12, right: 12 }}
              className="max-h-full"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => separate(value.split("-")[0])}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient
                  id="fillSessionCount"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                <linearGradient id="fillTotalCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-totalCount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-totalCount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="sessionCount"
                type="natural"
                fill="url(#fillSessionCount)"
                fillOpacity={0.4}
                stroke="var(--color-sessionCount)"
                stackId="a"
              />
              <Area
                dataKey="totalCount"
                type="natural"
                fill="url(#fillTotalCount)"
                fillOpacity={0.4}
                stroke="var(--color-totalCount)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      )}
    </div>
  );
}
