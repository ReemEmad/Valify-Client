import React from "react"
import "./App.css"

import Login from "./Login"
import { Route, Switch, Redirect } from "react-router-dom"
import AppForm from "./AppForm"
import theme from "./theme"
import { ThemeProvider } from "@material-ui/core"

function App() {
  // let upload = (e) => {
  //   e.preventDefault()
  //   console.log("upload")
  // }
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          {/* <h2>Hello, So you want to open an account?</h2> */}
        </header>

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
        </Switch>
      </div>
    </ThemeProvider>
  )
}

export default App
