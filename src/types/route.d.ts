import { RouteObject } from 'react-router-dom';

export interface RouteMeta {
  title?: string;
  description?: string;
  // add any other meta fields you want here
}

export interface AppRouteObject extends RouteObject {
  meta?: RouteMeta;
  children?: AppRouteObject[]; // for nested routes
}
