import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/items/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/items/"!</div>
}
