"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
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

export const description = "ფუტკრის ჯანმრთელობის ინდიკატორიშ"

const chartData = [
  { 
    status: "ჯანმრთელი", 
    score: 100, 
    fill: "hsl(120, 60%, 50%)", // Green for healthy
    description: "ყველა ინდიკატორი ნორმალურ დიაპაზონშია"
  },
  { 
    status: "გაფრთხილება", 
    score: 0, 
    fill: "hsl(30, 80%, 60%)", // Orange for warning
    description: "ზოგიერთი ინდიკატორი საყურადღებოა"
  },
  { 
    status: "რისკში", 
    score: 0, 
    fill: "hsl(0, 70%, 60%)", // Red for at risk
    description: "საჭიროა დაუყოვნებელი ზრუნვა"
  },
]

const chartConfig = {
  score: {
    label: "ქულა",
  },
  ჯანმრთელი: {
    label: "ჯანმრთელი",
    color: "hsl(120, 60%, 50%)",
  },
  გაფრთხილება: {
    label: "გაფრთხილება", 
    color: "hsl(30, 80%, 60%)",
  },
  რისკში: {
    label: "რისკში",
    color: "hsl(0, 70%, 60%)",
  },
} satisfies ChartConfig

export function ChartHiveHealth() {
  const totalScore = chartData.reduce((sum, item) => sum + item.score, 0)
  const healthPercentage = Math.round((chartData[0].score / totalScore) * 100)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>ფუტკრის ჯანმრთელობის სკორი</CardTitle>
        <CardDescription>ბოლო 24 საათის მონაცემები</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(value) => value}
                formatter={(value, name) => [
                  `${value}%`,
                  name
                ]}
              />}
            />
            <Pie 
              data={chartData} 
              dataKey="score" 
              nameKey="status"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={2}
              stroke="#fff"
            />
          </PieChart>
        </ChartContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{healthPercentage}%</div>
            <div className="text-sm text-muted-foreground">ჯანმრთელი</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          ამ თვეში 2.3%-ით გაზრდა <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          ბოლო 6 თვის ჯანმრთელობის ინდიკატორები
        </div>
      </CardFooter>
    </Card>
  )
}
