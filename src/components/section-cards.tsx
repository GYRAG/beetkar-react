import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useSensorData } from "@/hooks/useSensorData"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCards() {
  const { latestReading, isLoading, isError, lastUpdated } = useSensorData({
    pollingInterval: 5000,
    enablePolling: true,
  });

  // Calculate trend from previous reading (mock for now - can be enhanced)
  const humidityTrend = latestReading ? "+12.5%" : "--";
  const temperatureTrend = latestReading ? "-2°C" : "--";
  const gasTrend = latestReading ? "+5.2 kΩ" : "--";
  const pressureTrend = latestReading ? "+0.01 atm" : "--";
  const vibrationTrend = latestReading ? "+0.1 m/s²" : "--";
  const audioTrend = latestReading ? "+2.3 dBFS" : "--";

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-6">
      {/* Humidity Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            ტენიანობა
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.humidity.toFixed(1)}%
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {humidityTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ოპტიმალური დონე <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ბოლო 6 თვის მონაცემები'}
          </div>
        </CardFooter>
      </Card>

      {/* Temperature Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            ტემპერატურა
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.temperature.toFixed(1)}°C
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              {temperatureTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ოპტიმალური ტემპერატურა <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ფუტკრებისთვის იდეალური'}
          </div>
        </CardFooter>
      </Card>
      {/* Gas Resistance Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            გაზის წინაღობა
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.gas_resistance.toFixed(1)} kΩ
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {gasTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ნორმალური დონე <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ბოლო 6 თვის მონაცემები'}
          </div>
        </CardFooter>
      </Card>

      {/* Pressure Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            წნევა
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.pressure.toFixed(3)} atm
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {pressureTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ნორმალური წნევა <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ბოლო 6 თვის მონაცემები'}
          </div>
        </CardFooter>
      </Card>

      {/* Vibration RMS Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            ვიბრაციის RMS
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.vibration_rms.toFixed(3)} m/s²
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {vibrationTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ნორმალური ვიბრაცია <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ფუტკრების აქტივობა'}
          </div>
        </CardFooter>
      </Card>

      {/* Audio dBFS Card */}
      <Card className="@container/card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
        <CardHeader>
          <CardDescription>
            ხმის დონე
            {lastUpdated && !isLoading && (
              <span className="ml-2 text-xs opacity-60">
                ({new Date(lastUpdated).toLocaleTimeString('ka-GE')})
              </span>
            )}
          </CardDescription>
          {isLoading && !latestReading ? (
            <Skeleton className="h-10 w-24" />
          ) : isError ? (
            <CardTitle className="text-2xl font-semibold text-red-500 @[250px]/card:text-3xl">
              --
            </CardTitle>
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {latestReading?.audio_dbfs.toFixed(1)} dBFS
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {audioTrend}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isError ? (
              <span className="text-red-500">კავშირის შეცდომა</span>
            ) : (
              <>
                ნორმალური ხმის დონე <IconTrendingUp className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {isError ? 'API-სთან დაკავშირება ვერ მოხერხდა' : 'ფუტკრების ხმა'}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
