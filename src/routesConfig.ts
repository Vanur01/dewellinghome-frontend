import { AppRouteObject } from './types/route';  // import the type you defined

export const routes = [
  {
    path: '/',
    element: <Home />,
    meta: {
      title: 'Home | Dewelling',
      description: 'Best interior design solutions with Dewelling.',
    },
  },
  // more routes...
];
