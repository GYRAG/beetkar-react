"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useSensorData } from "@/hooks/useSensorData"
import type { TimeRange } from "@/services/sensorService"
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
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<TimeRange>("24h")
  
  const { historicalData, isLoading, setTimeRange: updateSensorRange } = useSensorData({
    pollingInterval: 5000,
    enablePolling: true,
    initialRange: "24h",
  })

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1h")
      updateSensorRange("1h")
    }
  }, [isMobile, updateSensorRange])

  // Convert sensor data to chart format
  const chartDataFromSensor = React.useMemo(() => {
    return historicalData.map((reading) => {
      // Parse the UTC timestamp and convert to local time
      const utcDate = new Date(reading.timestamp + 'Z'); // Add 'Z' to indicate UTC
      return {
        date: utcDate.toISOString(),
        humidity: reading.humidity,
      };
    })
  }, [historicalData])

  // Use live data if available, otherwise fallback to static data
  const filteredData = chartDataFromSensor.length > 0 ? chartDataFromSensor : chartData.filter((item) => {
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

  const handleTimeRangeChange = (newRange: string) => {
    const range = newRange as TimeRange
    setTimeRange(range)
    updateSensorRange(range)
  }

  return (
    <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
      <CardHeader>
        <CardTitle>ტენიანობის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            რეალურ დროში ტენიანობის მონაცემები
          </span>
          <span className="@[540px]/card:hidden">რეალურ დროში</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="15m">15 წუთი</ToggleGroupItem>
            <ToggleGroupItem value="1h">1 საათი</ToggleGroupItem>
            <ToggleGroupItem value="24h">24 საათი</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 დღე</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="24 საათი" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="15m" className="rounded-lg">
                15 წუთი
              </SelectItem>
              <SelectItem value="1h" className="rounded-lg">
                1 საათი
              </SelectItem>
              <SelectItem value="24h" className="rounded-lg">
                24 საათი
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 დღე
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading && filteredData.length === 0 ? (
          <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
            მონაცემების ჩატვირთვა...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[200px] w-full items-center justify-center text-muted-foreground">
            მონაცემები ხელმისაწვდომი არ არის
          </div>
        ) : (
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
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-humidity)"
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
                if (timeRange === '15m' || timeRange === '1h') {
                  return date.toLocaleTimeString("ka-GE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                } else if (timeRange === '24h') {
                  return date.toLocaleTimeString("ka-GE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                } else {
                  return date.toLocaleDateString("ka-GE", {
                    month: "short",
                    day: "numeric",
                  })
                }
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
              dataKey="humidity"
              type="natural"
              fill="url(#fillHumidity)"
              stroke="var(--color-humidity)"
            />
          </AreaChart>
        </ChartContainer>
        )}
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
