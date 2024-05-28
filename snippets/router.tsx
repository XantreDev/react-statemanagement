import React from 'react'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
  useSearch,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" search={{ product: 'televizor' }} className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

// #region snippet
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    const { product } = useSearch({
      from: '/about'
    })
    return <div className="p-2">
      Hello from About! {product}
      <Link to='/about' search={{
        product: `new${product}`
      }}>new</Link>
    </div>
  },
  validateSearch: (search) => {
    return {
      product: String(search) || 'pomogator',
    }
  },
})
// #endregion snippet

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const App = () => <RouterProvider router={router} />