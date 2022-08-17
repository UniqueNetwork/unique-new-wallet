import { useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useApi } from '@app/hooks';

import App from './App';
import { ProtectedRoute } from './ProtectedRoute';
import { MY_TOKENS_TABS_ROUTE, NETWORK_ROUTE, ROUTE } from './routes';
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

const NetworkGuard = () => {
  const params = useParams<{ network: string }>();
  const { currentChain } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // проверка, что введено только название чейна http://localhost:3000/OPAL/
    const isOnlyChainName = location.pathname.split('/').filter(Boolean).length === 1;
    // проверка, что чейн не действительный
    const isNotExistChain = currentChain.network.toUpperCase() !== params.network;

    if (isNotExistChain || isOnlyChainName) {
      navigate(
        `/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`,
        {
          replace: true,
        },
      );
    }
  }, [currentChain.network, location.pathname, navigate, params.network]);

  return <Outlet />;
};

export const AppRoutes = () => {
  const { currentChain } = useApi();
  const pRoutes = useMemo(() => routeBuilder(protectedRoutes, true), []);
  const sRoutes = useMemo(() => routeBuilder(sharedRoutes), []);

  return (
    <Router>
      <Routes>
        <Route element={<App />} path={routes.base}>
          <Route
            index={true}
            element={
              <Navigate
                replace={true}
                to={`/${currentChain.network}/${ROUTE.MY_TOKENS}/${MY_TOKENS_TABS_ROUTE.NFT}`}
              />
            }
          />
          <Route path={NETWORK_ROUTE} element={<NetworkGuard />}>
            {pRoutes}
            {sRoutes}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
