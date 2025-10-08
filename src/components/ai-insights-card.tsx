"use client"

import { Brain, AlertTriangle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AIInsightsCard() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">AI ინსაითები</CardTitle>
        </div>
        <CardDescription>
          ხელოვნური ინტელექტის ანალიზი და რეკომენდაციები
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-orange-700 dark:text-orange-300">
              ფუტკრის ჯგუფი #3-ის ვიბრაციის ნიმუში
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              ემთხვევა ცნობილ ტკიპის ქცევას 82% დარწმუნებით.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
