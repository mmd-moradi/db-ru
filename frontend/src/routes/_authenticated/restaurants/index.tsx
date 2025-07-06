import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/restaurants/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/restaurants/"!</div>
}
