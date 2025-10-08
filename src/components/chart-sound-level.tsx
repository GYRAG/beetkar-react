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

export const description = "A sound level area chart"

const chartData = [
  { date: "2024-04-01", soundLevel: 42 },
  { date: "2024-04-02", soundLevel: 45 },
  { date: "2024-04-03", soundLevel: 38 },
  { date: "2024-04-04", soundLevel: 48 },
  { date: "2024-04-05", soundLevel: 52 },
  { date: "2024-04-06", soundLevel: 46 },
  { date: "2024-04-07", soundLevel: 41 },
  { date: "2024-04-08", soundLevel: 49 },
  { date: "2024-04-09", soundLevel: 54 },
  { date: "2024-04-10", soundLevel: 47 },
  { date: "2024-04-11", soundLevel: 43 },
  { date: "2024-04-12", soundLevel: 39 },
  { date: "2024-04-13", soundLevel: 46 },
  { date: "2024-04-14", soundLevel: 51 },
  { date: "2024-04-15", soundLevel: 55 },
  { date: "2024-04-16", soundLevel: 50 },
  { date: "2024-04-17", soundLevel: 44 },
  { date: "2024-04-18", soundLevel: 42 },
  { date: "2024-04-19", soundLevel: 37 },
  { date: "2024-04-20", soundLevel: 45 },
  { date: "2024-04-21", soundLevel: 49 },
  { date: "2024-04-22", soundLevel: 53 },
  { date: "2024-04-23", soundLevel: 48 },
  { date: "2024-04-24", soundLevel: 44 },
  { date: "2024-04-25", soundLevel: 41 },
  { date: "2024-04-26", soundLevel: 38 },
  { date: "2024-04-27", soundLevel: 45 },
  { date: "2024-04-28", soundLevel: 50 },
  { date: "2024-04-29", soundLevel: 54 },
  { date: "2024-04-30", soundLevel: 49 },
  { date: "2024-05-01", soundLevel: 44 },
  { date: "2024-05-02", soundLevel: 41 },
  { date: "2024-05-03", soundLevel: 37 },
  { date: "2024-05-04", soundLevel: 45 },
  { date: "2024-05-05", soundLevel: 49 },
  { date: "2024-05-06", soundLevel: 53 },
  { date: "2024-05-07", soundLevel: 48 },
  { date: "2024-05-08", soundLevel: 44 },
  { date: "2024-05-09", soundLevel: 41 },
  { date: "2024-05-10", soundLevel: 38 },
  { date: "2024-05-11", soundLevel: 45 },
  { date: "2024-05-12", soundLevel: 50 },
  { date: "2024-05-13", soundLevel: 54 },
  { date: "2024-05-14", soundLevel: 49 },
  { date: "2024-05-15", soundLevel: 44 },
  { date: "2024-05-16", soundLevel: 41 },
  { date: "2024-05-17", soundLevel: 37 },
  { date: "2024-05-18", soundLevel: 45 },
  { date: "2024-05-19", soundLevel: 49 },
  { date: "2024-05-20", soundLevel: 53 },
  { date: "2024-05-21", soundLevel: 48 },
  { date: "2024-05-22", soundLevel: 44 },
  { date: "2024-05-23", soundLevel: 41 },
  { date: "2024-05-24", soundLevel: 38 },
  { date: "2024-05-25", soundLevel: 45 },
  { date: "2024-05-26", soundLevel: 50 },
  { date: "2024-05-27", soundLevel: 54 },
  { date: "2024-05-28", soundLevel: 49 },
  { date: "2024-05-29", soundLevel: 44 },
  { date: "2024-05-30", soundLevel: 41 },
  { date: "2024-05-31", soundLevel: 37 },
  { date: "2024-06-01", soundLevel: 45 },
  { date: "2024-06-02", soundLevel: 49 },
  { date: "2024-06-03", soundLevel: 53 },
  { date: "2024-06-04", soundLevel: 48 },
  { date: "2024-06-05", soundLevel: 44 },
  { date: "2024-06-06", soundLevel: 41 },
  { date: "2024-06-07", soundLevel: 38 },
  { date: "2024-06-08", soundLevel: 45 },
  { date: "2024-06-09", soundLevel: 50 },
  { date: "2024-06-10", soundLevel: 54 },
  { date: "2024-06-11", soundLevel: 49 },
  { date: "2024-06-12", soundLevel: 44 },
  { date: "2024-06-13", soundLevel: 41 },
  { date: "2024-06-14", soundLevel: 37 },
  { date: "2024-06-15", soundLevel: 45 },
  { date: "2024-06-16", soundLevel: 49 },
  { date: "2024-06-17", soundLevel: 53 },
  { date: "2024-06-18", soundLevel: 48 },
  { date: "2024-06-19", soundLevel: 44 },
  { date: "2024-06-20", soundLevel: 41 },
  { date: "2024-06-21", soundLevel: 38 },
  { date: "2024-06-22", soundLevel: 45 },
  { date: "2024-06-23", soundLevel: 50 },
  { date: "2024-06-24", soundLevel: 54 },
  { date: "2024-06-25", soundLevel: 49 },
  { date: "2024-06-26", soundLevel: 44 },
  { date: "2024-06-27", soundLevel: 41 },
  { date: "2024-06-28", soundLevel: 37 },
  { date: "2024-06-29", soundLevel: 45 },
  { date: "2024-06-30", soundLevel: 49 },
]

const chartConfig = {
  soundLevel: {
    label: "ხმის დონე",
    color: "hsl(45, 93%, 47%)", // Yellow-400 color to match theme
  },
} satisfies ChartConfig

export function ChartSoundLevel() {
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
        <CardTitle>ხმის დონის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            ბოლო 3 თვის ხმის დონის მონაცემები
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
          <AreaChart
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="soundLevel"
              type="natural"
              fill="var(--color-soundLevel)"
              fillOpacity={0.4}
              stroke="var(--color-soundLevel)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              ამ თვეში 2.8%-ით გაზრდა <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              ბოლო 6 თვის ხმის დონის მონაცემები
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
