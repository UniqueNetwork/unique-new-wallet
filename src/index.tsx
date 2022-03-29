import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalStyle } from './styles';
import { Accounts } from './pages';

import './styles/variables.scss';

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <Router>
      <Routes>
        <Route element={<App />} path={'/'}>
          <Route element={<Accounts />} path={'accounts'} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
  document.getElementById('root')
);
