import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './components/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/style.css';
import { store, persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>
);