"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "ტენიანობის ინტერაქტიული გრაფიკი"

const chartData = [
  { date: "2024-04-01", humidity: 65, target: 70 },
  { date: "2024-04-02", humidity: 68, target: 70 },
  { date: "2024-04-03", humidity: 72, target: 70 },
  { date: "2024-04-04", humidity: 69, target: 70 },
  { date: "2024-04-05", humidity: 66, target: 70 },
  { date: "2024-04-06", humidity: 71, target: 70 },
  { date: "2024-04-07", humidity: 74, target: 70 },
  { date: "2024-04-08", humidity: 67, target: 70 },
  { date: "2024-04-09", humidity: 70, target: 70 },
  { date: "2024-04-10", humidity: 73, target: 70 },
  { date: "2024-04-11", humidity: 68, target: 70 },
  { date: "2024-04-12", humidity: 65, target: 70 },
  { date: "2024-04-13", humidity: 69, target: 70 },
  { date: "2024-04-14", humidity: 72, target: 70 },
  { date: "2024-04-15", humidity: 75, target: 70 },
  { date: "2024-04-16", humidity: 67, target: 70 },
  { date: "2024-04-17", humidity: 64, target: 70 },
  { date: "2024-04-18", humidity: 71, target: 70 },
  { date: "2024-04-19", humidity: 73, target: 70 },
  { date: "2024-04-20", humidity: 68, target: 70 },
  { date: "2024-04-21", humidity: 66, target: 70 },
  { date: "2024-04-22", humidity: 70, target: 70 },
  { date: "2024-04-23", humidity: 74, target: 70 },
  { date: "2024-04-24", humidity: 67, target: 70 },
  { date: "2024-04-25", humidity: 65, target: 70 },
  { date: "2024-04-26", humidity: 69, target: 70 },
  { date: "2024-04-27", humidity: 72, target: 70 },
  { date: "2024-04-28", humidity: 75, target: 70 },
  { date: "2024-04-29", humidity: 68, target: 70 },
  { date: "2024-04-30", humidity: 64, target: 70 },
  { date: "2024-05-01", humidity: 71, target: 70 },
  { date: "2024-05-02", humidity: 73, target: 70 },
  { date: "2024-05-03", humidity: 67, target: 70 },
  { date: "2024-05-04", humidity: 65, target: 70 },
  { date: "2024-05-05", humidity: 69, target: 70 },
  { date: "2024-05-06", humidity: 72, target: 70 },
  { date: "2024-05-07", humidity: 74, target: 70 },
  { date: "2024-05-08", humidity: 68, target: 70 },
  { date: "2024-05-09", humidity: 66, target: 70 },
  { date: "2024-05-10", humidity: 70, target: 70 },
  { date: "2024-05-11", humidity: 73, target: 70 },
  { date: "2024-05-12", humidity: 75, target: 70 },
  { date: "2024-05-13", humidity: 67, target: 70 },
  { date: "2024-05-14", humidity: 64, target: 70 },
  { date: "2024-05-15", humidity: 71, target: 70 },
  { date: "2024-05-16", humidity: 69, target: 70 },
  { date: "2024-05-17", humidity: 72, target: 70 },
  { date: "2024-05-18", humidity: 68, target: 70 },
  { date: "2024-05-19", humidity: 65, target: 70 },
  { date: "2024-05-20", humidity: 74, target: 70 },
  { date: "2024-05-21", humidity: 70, target: 70 },
  { date: "2024-05-22", humidity: 67, target: 70 },
  { date: "2024-05-23", humidity: 69, target: 70 },
  { date: "2024-05-24", humidity: 73, target: 70 },
  { date: "2024-05-25", humidity: 75, target: 70 },
  { date: "2024-05-26", humidity: 68, target: 70 },
  { date: "2024-05-27", humidity: 66, target: 70 },
  { date: "2024-05-28", humidity: 71, target: 70 },
  { date: "2024-05-29", humidity: 74, target: 70 },
  { date: "2024-05-30", humidity: 67, target: 70 },
  { date: "2024-05-31", humidity: 64, target: 70 },
  { date: "2024-06-01", humidity: 70, target: 70 },
  { date: "2024-06-02", humidity: 73, target: 70 },
  { date: "2024-06-03", humidity: 75, target: 70 },
  { date: "2024-06-04", humidity: 68, target: 70 },
  { date: "2024-06-05", humidity: 66, target: 70 },
  { date: "2024-06-06", humidity: 69, target: 70 },
  { date: "2024-06-07", humidity: 72, target: 70 },
  { date: "2024-06-08", humidity: 74, target: 70 },
  { date: "2024-06-09", humidity: 67, target: 70 },
  { date: "2024-06-10", humidity: 65, target: 70 },
  { date: "2024-06-11", humidity: 71, target: 70 },
  { date: "2024-06-12", humidity: 73, target: 70 },
  { date: "2024-06-13", humidity: 75, target: 70 },
  { date: "2024-06-14", humidity: 68, target: 70 },
  { date: "2024-06-15", humidity: 66, target: 70 },
  { date: "2024-06-16", humidity: 70, target: 70 },
  { date: "2024-06-17", humidity: 74, target: 70 },
  { date: "2024-06-18", humidity: 67, target: 70 },
  { date: "2024-06-19", humidity: 64, target: 70 },
  { date: "2024-06-20", humidity: 72, target: 70 },
  { date: "2024-06-21", humidity: 69, target: 70 },
  { date: "2024-06-22", humidity: 73, target: 70 },
  { date: "2024-06-23", humidity: 75, target: 70 },
  { date: "2024-06-24", humidity: 68, target: 70 },
  { date: "2024-06-25", humidity: 66, target: 70 },
  { date: "2024-06-26", humidity: 71, target: 70 },
  { date: "2024-06-27", humidity: 74, target: 70 },
  { date: "2024-06-28", humidity: 67, target: 70 },
  { date: "2024-06-29", humidity: 65, target: 70 },
  { date: "2024-06-30", humidity: 70, target: 70 },
]

const chartConfig = {
  humidity: {
    label: "ტენიანობა",
    color: "hsl(45, 93%, 47%)", // Yellow-400 color to match theme
  },
  target: {
    label: "სამიზნე",
    color: "hsl(0, 0%, 50%)", // Gray color for target line
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
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
        <CardTitle>ტენიანობის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            ბოლო 3 თვის ტენიანობის მონაცემები
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-target)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-target)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ka-GE", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="target"
              type="natural"
              fill="url(#fillTarget)"
              stroke="var(--color-target)"
              stackId="a"
            />
            <Area
              dataKey="humidity"
              type="natural"
              fill="url(#fillHumidity)"
              stroke="var(--color-humidity)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              ამ თვეში 3.1%-ით გაზრდა <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              ბოლო 6 თვის ტენიანობის მონაცემები
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
