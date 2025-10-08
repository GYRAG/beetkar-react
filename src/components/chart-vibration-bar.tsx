"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
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

export const description = "A vibration bar chart"

const chartData = [
  { date: "2024-04-01", vibration: 1.8 },
  { date: "2024-04-02", vibration: 2.1 },
  { date: "2024-04-03", vibration: 1.9 },
  { date: "2024-04-04", vibration: 2.3 },
  { date: "2024-04-05", vibration: 2.5 },
  { date: "2024-04-06", vibration: 2.2 },
  { date: "2024-04-07", vibration: 1.7 },
  { date: "2024-04-08", vibration: 2.4 },
  { date: "2024-04-09", vibration: 2.6 },
  { date: "2024-04-10", vibration: 2.3 },
  { date: "2024-04-11", vibration: 2.1 },
  { date: "2024-04-12", vibration: 1.9 },
  { date: "2024-04-13", vibration: 2.2 },
  { date: "2024-04-14", vibration: 2.4 },
  { date: "2024-04-15", vibration: 2.7 },
  { date: "2024-04-16", vibration: 2.5 },
  { date: "2024-04-17", vibration: 2.3 },
  { date: "2024-04-18", vibration: 2.1 },
  { date: "2024-04-19", vibration: 1.8 },
  { date: "2024-04-20", vibration: 2.2 },
  { date: "2024-04-21", vibration: 2.4 },
  { date: "2024-04-22", vibration: 2.6 },
  { date: "2024-04-23", vibration: 2.5 },
  { date: "2024-04-24", vibration: 2.3 },
  { date: "2024-04-25", vibration: 2.1 },
  { date: "2024-04-26", vibration: 1.9 },
  { date: "2024-04-27", vibration: 2.2 },
  { date: "2024-04-28", vibration: 2.4 },
  { date: "2024-04-29", vibration: 2.6 },
  { date: "2024-04-30", vibration: 2.5 },
  { date: "2024-05-01", vibration: 2.3 },
  { date: "2024-05-02", vibration: 2.1 },
  { date: "2024-05-03", vibration: 1.9 },
  { date: "2024-05-04", vibration: 2.2 },
  { date: "2024-05-05", vibration: 2.4 },
  { date: "2024-05-06", vibration: 2.6 },
  { date: "2024-05-07", vibration: 2.5 },
  { date: "2024-05-08", vibration: 2.3 },
  { date: "2024-05-09", vibration: 2.1 },
  { date: "2024-05-10", vibration: 1.9 },
  { date: "2024-05-11", vibration: 2.2 },
  { date: "2024-05-12", vibration: 2.4 },
  { date: "2024-05-13", vibration: 2.6 },
  { date: "2024-05-14", vibration: 2.5 },
  { date: "2024-05-15", vibration: 2.3 },
  { date: "2024-05-16", vibration: 2.1 },
  { date: "2024-05-17", vibration: 1.9 },
  { date: "2024-05-18", vibration: 2.2 },
  { date: "2024-05-19", vibration: 2.4 },
  { date: "2024-05-20", vibration: 2.6 },
  { date: "2024-05-21", vibration: 2.5 },
  { date: "2024-05-22", vibration: 2.3 },
  { date: "2024-05-23", vibration: 2.1 },
  { date: "2024-05-24", vibration: 1.9 },
  { date: "2024-05-25", vibration: 2.2 },
  { date: "2024-05-26", vibration: 2.4 },
  { date: "2024-05-27", vibration: 2.6 },
  { date: "2024-05-28", vibration: 2.5 },
  { date: "2024-05-29", vibration: 2.3 },
  { date: "2024-05-30", vibration: 2.1 },
  { date: "2024-05-31", vibration: 1.9 },
  { date: "2024-06-01", vibration: 2.2 },
  { date: "2024-06-02", vibration: 2.4 },
  { date: "2024-06-03", vibration: 2.6 },
  { date: "2024-06-04", vibration: 2.5 },
  { date: "2024-06-05", vibration: 2.3 },
  { date: "2024-06-06", vibration: 2.1 },
  { date: "2024-06-07", vibration: 1.9 },
  { date: "2024-06-08", vibration: 2.2 },
  { date: "2024-06-09", vibration: 2.4 },
  { date: "2024-06-10", vibration: 2.6 },
  { date: "2024-06-11", vibration: 2.5 },
  { date: "2024-06-12", vibration: 2.3 },
  { date: "2024-06-13", vibration: 2.1 },
  { date: "2024-06-14", vibration: 1.9 },
  { date: "2024-06-15", vibration: 2.2 },
  { date: "2024-06-16", vibration: 2.4 },
  { date: "2024-06-17", vibration: 2.6 },
  { date: "2024-06-18", vibration: 2.5 },
  { date: "2024-06-19", vibration: 2.3 },
  { date: "2024-06-20", vibration: 2.1 },
  { date: "2024-06-21", vibration: 1.9 },
  { date: "2024-06-22", vibration: 2.2 },
  { date: "2024-06-23", vibration: 2.4 },
  { date: "2024-06-24", vibration: 2.6 },
  { date: "2024-06-25", vibration: 2.5 },
  { date: "2024-06-26", vibration: 2.3 },
  { date: "2024-06-27", vibration: 2.1 },
  { date: "2024-06-28", vibration: 1.9 },
  { date: "2024-06-29", vibration: 2.2 },
  { date: "2024-06-30", vibration: 2.4 },
]

const chartConfig = {
  vibration: {
    label: "ვიბრაცია",
    color: "hsl(45, 93%, 47%)", // Yellow-400 color to match theme
  },
} satisfies ChartConfig

export function ChartVibrationBar() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>ვიბრაციის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            ბოლო 3 თვის ვიბრაციის მონაცემები
          </span>
          <span className="@[540px]/card:hidden">ბოლო 3 თვე</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">ბოლო 3 თვე</ToggleGroupItem>
            <ToggleGroupItem value="30d">ბოლო 30 დღე</ToggleGroupItem>
            <ToggleGroupItem value="7d">ბოლო 7 დღე</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="ბოლო 3 თვე" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                ბოლო 3 თვე
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                ბოლო 30 დღე
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                ბოლო 7 დღე
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("ka-GE", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="vibration" fill="var(--color-vibration)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          ამ თვეში 3.1%-ით გაზრდა <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          ბოლო 6 თვის ვიბრაციის მონაცემები
        </div>
      </CardFooter>
    </Card>
  )
}
