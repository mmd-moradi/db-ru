import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/lockers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/lockers/"!</div>
}
