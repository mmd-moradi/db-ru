import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/employees/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/employees/"!</div>
}
