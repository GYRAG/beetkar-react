"use client"

import { Camera } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const description = "თერმული კამერის პირდაპირი ტრანსლაცია"

export function ThermalCameraPlaceholder() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-orange-500" />
          <CardTitle>თერმული კამერის პირდაპირი ტრანსლაცია</CardTitle>
        </div>
        <CardDescription>
          მალე დაემატება - პირდაპირი თერმული გამოსახულების ნახვა
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex items-center justify-center h-[250px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <div className="text-center space-y-3">
            <Camera className="h-12 w-12 text-gray-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                თერმული კამერა
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                პირდაპირი ტრანსლაცია მალე იქნება ხელმისაწვდომი
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
