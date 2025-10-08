"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A temperature line chart"

const chartData = [
  { date: "2024-04-01", temperature: 18 },
  { date: "2024-04-02", temperature: 19 },
  { date: "2024-04-03", temperature: 20 },
  { date: "2024-04-04", temperature: 22 },
  { date: "2024-04-05", temperature: 24 },
  { date: "2024-04-06", temperature: 25 },
  { date: "2024-04-07", temperature: 23 },
  { date: "2024-04-08", temperature: 26 },
  { date: "2024-04-09", temperature: 28 },
  { date: "2024-04-10", temperature: 27 },
  { date: "2024-04-11", temperature: 25 },
  { date: "2024-04-12", temperature: 24 },
  { date: "2024-04-13", temperature: 26 },
  { date: "2024-04-14", temperature: 28 },
  { date: "2024-04-15", temperature: 30 },
  { date: "2024-04-16", temperature: 29 },
  { date: "2024-04-17", temperature: 27 },
  { date: "2024-04-18", temperature: 25 },
  { date: "2024-04-19", temperature: 24 },
  { date: "2024-04-20", temperature: 26 },
  { date: "2024-04-21", temperature: 28 },
  { date: "2024-04-22", temperature: 30 },
  { date: "2024-04-23", temperature: 29 },
  { date: "2024-04-24", temperature: 27 },
  { date: "2024-04-25", temperature: 25 },
  { date: "2024-04-26", temperature: 24 },
  { date: "2024-04-27", temperature: 26 },
  { date: "2024-04-28", temperature: 28 },
  { date: "2024-04-29", temperature: 30 },
  { date: "2024-04-30", temperature: 29 },
  { date: "2024-05-01", temperature: 27 },
  { date: "2024-05-02", temperature: 25 },
  { date: "2024-05-03", temperature: 24 },
  { date: "2024-05-04", temperature: 26 },
  { date: "2024-05-05", temperature: 28 },
  { date: "2024-05-06", temperature: 30 },
  { date: "2024-05-07", temperature: 29 },
  { date: "2024-05-08", temperature: 27 },
  { date: "2024-05-09", temperature: 25 },
  { date: "2024-05-10", temperature: 24 },
  { date: "2024-05-11", temperature: 26 },
  { date: "2024-05-12", temperature: 28 },
  { date: "2024-05-13", temperature: 30 },
  { date: "2024-05-14", temperature: 29 },
  { date: "2024-05-15", temperature: 27 },
  { date: "2024-05-16", temperature: 25 },
  { date: "2024-05-17", temperature: 24 },
  { date: "2024-05-18", temperature: 26 },
  { date: "2024-05-19", temperature: 28 },
  { date: "2024-05-20", temperature: 30 },
  { date: "2024-05-21", temperature: 29 },
  { date: "2024-05-22", temperature: 27 },
  { date: "2024-05-23", temperature: 25 },
  { date: "2024-05-24", temperature: 24 },
  { date: "2024-05-25", temperature: 26 },
  { date: "2024-05-26", temperature: 28 },
  { date: "2024-05-27", temperature: 30 },
  { date: "2024-05-28", temperature: 29 },
  { date: "2024-05-29", temperature: 27 },
  { date: "2024-05-30", temperature: 25 },
  { date: "2024-05-31", temperature: 24 },
  { date: "2024-06-01", temperature: 26 },
  { date: "2024-06-02", temperature: 28 },
  { date: "2024-06-03", temperature: 30 },
  { date: "2024-06-04", temperature: 29 },
  { date: "2024-06-05", temperature: 27 },
  { date: "2024-06-06", temperature: 25 },
  { date: "2024-06-07", temperature: 24 },
  { date: "2024-06-08", temperature: 26 },
  { date: "2024-06-09", temperature: 28 },
  { date: "2024-06-10", temperature: 30 },
  { date: "2024-06-11", temperature: 29 },
  { date: "2024-06-12", temperature: 27 },
  { date: "2024-06-13", temperature: 25 },
  { date: "2024-06-14", temperature: 24 },
  { date: "2024-06-15", temperature: 26 },
  { date: "2024-06-16", temperature: 28 },
  { date: "2024-06-17", temperature: 30 },
  { date: "2024-06-18", temperature: 29 },
  { date: "2024-06-19", temperature: 27 },
  { date: "2024-06-20", temperature: 25 },
  { date: "2024-06-21", temperature: 24 },
  { date: "2024-06-22", temperature: 26 },
  { date: "2024-06-23", temperature: 28 },
  { date: "2024-06-24", temperature: 30 },
  { date: "2024-06-25", temperature: 29 },
  { date: "2024-06-26", temperature: 27 },
  { date: "2024-06-27", temperature: 25 },
  { date: "2024-06-28", temperature: 24 },
  { date: "2024-06-29", temperature: 26 },
  { date: "2024-06-30", temperature: 28 },
]

const chartConfig = {
  temperature: {
    label: "ტემპერატურა",
    color: "hsl(45, 93%, 47%)", // Yellow-400 color to match theme
  },
} satisfies ChartConfig

export function ChartTemperatureLine() {
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
        <CardTitle>ტემპერატურის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            ბოლო 3 თვის ტემპერატურის მონაცემები
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
          <LineChart
            accessibilityLayer
            data={filteredData}
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
            <Line
              dataKey="temperature"
              type="natural"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          ამ თვეში 5.2%-ით გაზრდა <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          ბოლო 6 თვის ტემპერატურის მონაცემები
        </div>
      </CardFooter>
    </Card>
  )
}
