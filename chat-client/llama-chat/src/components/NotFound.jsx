import React, { Component } from 'react'
import Card from './common/Card'
import Animation from './common/Animation'
import animation from './media/llama_sad.json'

class NotFound extends Component {
  render() {
    return <Card content={this.renderNotFound()} />
  }

  renderNotFound() {
    return (
      <div className="row justify-content-center text-center">
        <div className="col-md-8">
          <Animation animation={animation} />
        </div>
        <div className="col-md-8 m-3">
          <h1>404</h1>
          <p>Oops! Page not found.</p>
        </div>
      </div>
    )
  }
}

export default NotFound
