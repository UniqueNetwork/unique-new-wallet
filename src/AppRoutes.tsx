import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import { MenuRoute, RouteItem, routes } from './routesConfig';

const { menuRoutes, otherRoutes } = routes;

export const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<App />} path={routes.base}>
        { menuRoutes.map((menuRoute: MenuRoute) => (
          <Route element={menuRoute.component}
            index={menuRoute.index}
            key={`${menuRoute.name}${menuRoute.path}`}
            path={menuRoute.path}
          >
            { menuRoute.children?.map((menuChild: MenuRoute) => (
              <Route
                element={menuChild.component}
                key={`${menuChild.name}${menuChild.path}`}
                path={`${menuRoute.path}${menuChild.path}`}
              />
            ))}
          </Route>
        ))}
        { otherRoutes.map((otherRoute: RouteItem) => (
          <Route
            element={otherRoute.component}
            key={`${otherRoute.name}${otherRoute.path}`}
            path={`${otherRoute.path}`}
          >
            {otherRoute?.children?.map((childRoute1) => (
              <Route
                element={childRoute1.component}
                key={`${childRoute1.name}${childRoute1.path}`}
                path={`${otherRoute.path}${childRoute1.path}`}
              >
                {childRoute1?.children?.map((childRoute2: RouteItem) => (
                  <Route
                    element={childRoute2.component}
                    key={`${childRoute2.name}${childRoute2.path}`}
                    path={`${otherRoute.path}${childRoute1.path}${childRoute2.path}`}
                  />
                ))}
              </Route>
            ))}
          </Route>
        ))}
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;