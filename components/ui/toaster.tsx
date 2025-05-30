import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      expand={true}
      richColors
      closeButton
    />
  )
} 