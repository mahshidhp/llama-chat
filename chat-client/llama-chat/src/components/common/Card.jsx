import React, { Component } from 'react'

class Card extends Component {
  render() {
    return (
      <div className="container-fluid gradient-bg h-100">
        <div className="row justify-content-center h-100 mx-2">
          <div className="col-sm-6 card p-4 my-auto">{this.props.content}</div>
        </div>
      </div>
    )
  }
}

export default Card
