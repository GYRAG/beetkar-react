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

  // Use live data from sensor
  const filteredData = chartDataFromSensor;

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
