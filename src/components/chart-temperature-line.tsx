"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
        temperature: reading.temperature,
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
        <CardTitle>ტემპერატურის გრაფიკი</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            რეალურ დროში ტემპერატურის მონაცემები
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
        )}
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
