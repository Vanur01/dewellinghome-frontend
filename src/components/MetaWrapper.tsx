import { useLocation, matchRoutes } from 'react-router-dom';
import { AppRouteObject } from '../types/route';  // import the extended type
import { Helmet } from 'react-helmet-async';
import React from 'react';
import { routes } from '../routesConfig';

const MetaWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const matches = matchRoutes(routes as AppRouteObject[], location);
  const currentRoute = matches?.[matches.length - 1]?.route as AppRouteObject | undefined;

  const title = currentRoute?.meta?.title ?? 'Default Title | Dewelling';
  const description = currentRoute?.meta?.description ?? 'Default description for Dewelling interior design.';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </>
  );
};

export default MetaWrapper;
