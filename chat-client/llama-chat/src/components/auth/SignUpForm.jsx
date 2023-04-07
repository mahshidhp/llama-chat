import React from 'react'
import { Link } from 'react-router-dom'
import Joi from 'joi-browser'
import Card from '../common/Card'
import Form from '../common/Form'
import Animation from '../common/Animation'
import userService from '../../services/userService'
import authService from '../../services/authService'
import animation from '../media/llama_hi.json'

class SignUpForm extends Form {
  state = {
    data: { username: '', password: '' },
    errors: {},
  }

  schema = {
    username: Joi.string().required().min(5).label('Username'),
    password: Joi.string().required().min(5).label('Password'),
  }

  componentDidMount() {
    authService.logout()
  }

  doSubmit = async () => {
    try {
      const { data: jwt } = await userService.signup(this.state.data)
      authService.loginWithJwt(jwt)
      window.location = '/'
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors }
        errors.username = ex.response.data
        this.setState({ errors })
      }
    }
  }

  render() {
    return <Card content={this.renderSignUp()} />
  }

  renderSignUp() {
    return (
      <div className="row justify-content-center">
        <div className="col-md-10">
          <Animation animation={animation} />
        </div>
        <div className="col-md-8">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput('username', 'Username')}
            {this.renderInput('password', 'Password', 'password')}
            {this.renderLoginLink()}
          </form>
        </div>
      </div>
    )
  }

  renderLoginLink() {
    return (
      <div className="text-center">
        {this.renderButton('Sign up')}
        <p>
          Already have an account? <Link to={'/login'}>Log in!</Link>
        </p>
      </div>
    )
  }
}

export default SignUpForm
