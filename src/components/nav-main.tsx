import { IconCirclePlusFilled, IconPlus, IconX } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}) {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false)
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="ბიტკარი V1-ის დამატატება"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setIsComingSoonOpen(true)}
            >
              <IconCirclePlusFilled />
              <span>ბიტკარი V1-ის დამატატება</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconPlus />
              <span className="sr-only">Add</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      
      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">
              მალე მოვა!
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              ბიტკარი V1-ის დამატების ფუნქცია მალე იქნება ხელმისაწვდომი. 
              გთხოვთ, მოგვიხმოთ მოგვიანებით.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setIsComingSoonOpen(false)}
              className="bg-primary hover:bg-primary/90"
            >
              <IconX className="w-4 h-4 mr-2" />
              დახურვა
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  )
}
