import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./store.js"
import "./index.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<Provider store={store}>
			<Toaster position="bottom-center" />
			<App />
		</Provider>
	</BrowserRouter>
)
