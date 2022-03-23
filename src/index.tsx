import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalStyle } from './styles';

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <Router>
      <Routes>
        <Route element={<App />} path={'/'} />
      </Routes>
    </Router>
  </StrictMode>,
  document.getElementById('root')
);
