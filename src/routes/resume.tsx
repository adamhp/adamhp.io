import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <object
      data="Adam Pearce Resume 2026.pdf"
      type="application/pdf"
      className="w-full h-full min-h-[calc(100vh-6rem)]"
    />
  )
}
