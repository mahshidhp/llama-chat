import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import SignUpForm from './components/auth/SignUpForm'
import Logout from './components/auth/Logout'
import MainPage from './components/MainPage'
import NotFound from './components/NotFound'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={LoginForm} />
        <Route path="/logout" component={Logout} />
        <Route path="/signup" component={SignUpForm} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/" exact component={MainPage} />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}

export default App
