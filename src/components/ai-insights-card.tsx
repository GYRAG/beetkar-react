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
          <CardTitle className="text-lg">AI ანალიზი</CardTitle>
        </div>
        <CardDescription>
          ხელოვნური ინტელექტის ანალიზი და რეკომენდაციები
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              ფუტკრის კოლონია  ჯერ ჯერობით ჯამრთელი და აგმაყოფილებს ყველა ნორმებს,თუმცა მალე შეიძლება გახდეს შეწამვლა საჭირო
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
