import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"

export function SiteHeader() {
  const navigate = useNavigate();
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Beetkar Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="dark:text-foreground"
            >
              ← Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
