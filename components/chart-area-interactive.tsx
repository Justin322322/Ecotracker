"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useCarbonEmissions } from "@/hooks/use-carbon-data"
import { ChartSkeleton } from "@/components/ui/loading-skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  emissions: {
    label: "Carbon Emissions",
    color: "#4ADE80", // Primary green
  },
  transportation: {
    label: "Transportation",
    color: "#22C55E", // Darker green
  },
  energy: {
    label: "Energy",
    color: "#16A34A", // Even darker green
  },
} satisfies ChartConfig


export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const { data: chartData, isLoading, error } = useCarbonEmissions(timeRange)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    if (!chartData) return [];
    
    return chartData.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date("2024-05-30")
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    });
  }, [chartData, timeRange])

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-destructive">Error loading chart data</CardTitle>
          <CardDescription>Please try refreshing the page</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Carbon Emissions Tracking</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Daily CO₂ emissions for the last month
          </span>
          <span className="@[540px]/card:hidden">Daily CO₂ (kg)</span>
        </CardDescription>
        <div className="mt-2 w-full md:absolute md:right-4 md:top-4 md:mt-0 md:w-auto">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden w-full md:w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-0 pr-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData} margin={isMobile ? { left: -8, right: 0 } : undefined}>
            <defs>
              <linearGradient id="fillEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#4ADE80"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#4ADE80"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTransportation" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#22C55E"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#22C55E"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#16A34A"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#16A34A"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value}kg`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  className="bg-black/90 border-white/20 text-white"
                />
              }
            />
            <Area
              dataKey="energy"
              type="natural"
              fill="url(#fillEnergy)"
              stroke="#16A34A"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="transportation"
              type="natural"
              fill="url(#fillTransportation)"
              stroke="#22C55E"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
