import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import * as process from 'process'

import store from 'redux/store'

import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

window.process = process

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)