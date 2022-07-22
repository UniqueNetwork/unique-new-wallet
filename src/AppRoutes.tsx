import { useMemo } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import { config } from './config';
import { ProtectedRoute } from './ProtectedRoute';
import { NETWORK_ROUTE, ROUTE } from './routes';
import { RouteItem, routes } from './routesConfig';

const { protectedRoutes, sharedRoutes } = routes;

const routeBuilder = (routes?: RouteItem[], protection?: boolean) => {
  return routes?.map((r) => {
    r.element = protection ? <ProtectedRoute>{r.element}</ProtectedRoute> : r.element;

    return (
      <Route
        element={r.element}
        index={r.index}
        key={`${r.name}${r.path}`}
        path={`${r.path}`}
      >
        {routeBuilder(r.children, false)}
      </Route>
    );
  });
};

export const AppRoutes = () => {
  const pRoutes = useMemo(() => routeBuilder(protectedRoutes, true), []);
  const sRoutes = useMemo(() => routeBuilder(sharedRoutes), []);

  return (
    <Router>
      <Routes>
        <Route element={<App />} path={routes.base}>
          <Route
            index
            element={
              <Navigate to={`/${config.defaultChain.network}/${ROUTE.MY_TOKENS}`} />
            }
          />
          <Route path={`${NETWORK_ROUTE}`}>
            {pRoutes}
            {sRoutes}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
