import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartTemperatureLine } from "@/components/chart-temperature-line"
import { ChartVibrationBar } from "@/components/chart-vibration-bar"
import { ChartSoundLevel } from "@/components/chart-sound-level"
import { ChartHiveHealth } from "@/components/chart-hive-health"
import { ChartGasResistance } from "@/components/chart-gas-resistance"
import { ChartPressure } from "@/components/chart-pressure"
import { AIInsightsCard } from "@/components/ai-insights-card"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ThermalCameraStream } from "@/components/thermal-camera-stream"
import { InlineLoader } from "@/components/page-loader"
import { useComponentLoading } from "@/hooks/useLoading"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function DashboardPage() {
  const { isLoading, startLoading, stopLoading } = useComponentLoading();

  // Example function to trigger loading when needed (e.g., on data refresh)
  const handleRefreshData = () => {
    startLoading('Refreshing dashboard data...');
    // Simulate API call
    setTimeout(() => {
      stopLoading();
    }, 2000);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <AIInsightsCard />
              </div>
              <div className="px-4 lg:px-6">
                <ChartHiveHealth />
              </div>
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <ChartAreaInteractive />
                  <ChartTemperatureLine />
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <ChartVibrationBar />
                  <ChartSoundLevel />
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <ChartGasResistance />
                  <ChartPressure />
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <ThermalCameraStream src="http://localhost:8080/mjpeg" />
              </div>
              {/* <DataTable data={data} /> */}
              
              {/* Example: Button to trigger loading */}
              <div className="px-4 lg:px-6">
                <button 
                  onClick={handleRefreshData}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
              
              <InlineLoader isLoading={isLoading} message="Loading dashboard data..." />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
