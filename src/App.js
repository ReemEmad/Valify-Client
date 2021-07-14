import React from "react"
import "./App.css"

import Login from "./Login"
import { Route, Switch } from "react-router-dom"
import AppForm from "./AppForm"
import theme from "./theme"
import { ThemeProvider } from "@material-ui/core"
import Success from "./success"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/Form"
            render={(routeProps) => {
              return <AppForm />
            }}
          />
          <Route
            exact
            path="/"
            render={(routeProps) => {
              return <Login />
            }}
          />
          <Route
            path="*"
            render={(routeProps) => {
              return <Success />
            }}
          />
        </Switch>
      </div>
    </ThemeProvider>
  )
}

export default App
