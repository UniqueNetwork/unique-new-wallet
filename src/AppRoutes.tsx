import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import { Accounts } from './pages';
import { NewCollection } from './pages/NewCollection';

export const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<App />} path={'/'}>
        <Route element={<Accounts />} path={'accounts'} />
        <Route element={<NewCollection />} path={'new-collection/*'} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;