import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const pyodide = await window.loadPyodide();
await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");
await micropip.install('numpy');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

export { pyodide }