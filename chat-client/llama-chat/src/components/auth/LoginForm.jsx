import React from 'react'
import { Link } from 'react-router-dom'
import Joi from 'joi-browser'
import Card from '../common/Card'
import Form from '../common/Form'
import authService from '../../services/authService'
import { ReactComponent as WelcomeLogo } from '../media/welcomeLogo.svg'

class LoginForm extends Form {
  state = {
    data: { username: '', password: '' },
    errors: {},
  }

  schema = {
    username: Joi.string().required().label('Username'),
    password: Joi.string().required().label('Password'),
  }

  doSubmit = async () => {
    try {
      const { data } = this.state
      await authService.login(data.username, data.password)

      const { state } = this.props.location
      window.location = state ? state.from.pathname : '/'
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors }
        errors.username = ex.response.data
        this.setState({ errors })
      }
    }
  }

  render() {
    return <Card content={this.renderLogin()} />
  }

  renderLogin = () => {
    return (
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <WelcomeLogo className="animation" />
        </div>
        <div className="col-md-8">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput('username', 'Username')}
            {this.renderInput('password', 'Password', 'password')}
            {this.renderSignUpLink()}
          </form>
        </div>
      </div>
    )
  }

  renderSignUpLink() {
    return (
      <div className="text-center">
        {this.renderButton('Login')}
        <p>
          Don't have an account? <Link to={'/signup'}>Sign up!</Link>
        </p>
      </div>
    )
  }

  calcLlamaEyeballCoordination = () => {
    const { x: x1, y: y1 } = this.getElementCenterCoordination('eye1')
    const { x: x2, y: y2 } = this.getElementCenterCoordination('eye2')
    const coordination = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
    this.setState({ llamaEyeballCoordinatoin: coordination })
  }

  getElementCenterCoordination = (elementId) => {
    const { top, bottom, right, left } = document
      .getElementById(elementId)
      .getBoundingClientRect()
    const x = (right + left) / 2
    const y = (top + bottom) / 2
    return { x, y }
  }

  handleMouseMoveAnimation = ({ clientX, clientY }) => {
    const { x, y } = this.state.llamaEyeballCoordinatoin
    const x_dif = clientX - x
    const y_dif = clientY - y

    const distance = Math.sqrt(x_dif ** 2 + y_dif ** 2)
    const cos = x_dif / distance
    const sin = y_dif / distance
    const degree = (Math.acos(cos) * 180) / Math.PI
    let degreeStr = degree.toString() + 'deg'
    if (sin < 0) {
      degreeStr = '-' + degreeStr
    }
    const root = document.querySelector(':root')

    root.style.setProperty('--llama-eye-deg', degreeStr)
  }

  componentDidMount() {
    authService.logout()
    this.calcLlamaEyeballCoordination()
    document.addEventListener('mousemove', this.handleMouseMoveAnimation)
    window.addEventListener('resize', this.calcLlamaEyeballCoordination)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMoveAnimation)
    window.removeEventListener('resize', this.calcLlamaEyeballCoordination)
  }
}

export default LoginForm
