import React, { Component } from 'react'
import { Player, Controls } from '@lottiefiles/react-lottie-player'

class Animation extends Component {
  state = {}
  render() {
    return (
      <Player
        autoplay
        loop
        src={this.props.animation}
        className="animation"
      ></Player>
    )
  }
}

export default Animation
