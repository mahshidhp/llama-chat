import React, { Component } from 'react'
import { getLastSeenStatus } from '../../util'

class ChatPreview extends Component {
  render() {
    const { username } = this.props.contact
    const notifCount = 0
    return (
      <div
        className="row inbox-item py-4 mx-0 justify-content-center cursor-pointer"
        onClick={() => this.props.onSelectChat(username)}
      >
        <div className="col-2 my-auto align-items-center justify-content-center">
          {this.renderThumnail()}
        </div>
        <div className="col-5 my-auto px-auto">
          {this.renderUsername(username)}
          {this.renderLastSeen()}
        </div>
        <div className="col-2 my-auto px-auto">
          {this.renderNotifBadge(notifCount)}
        </div>
      </div>
    )
  }

  renderThumnail = () => {
    const { username } = this.props.contact
    let initials = username.slice(0, 1)
    return (
      <p className="inbox-initial text-center m-auto">
        {initials.toUpperCase()}
      </p>
    )
  }

  renderUsername = (username) => {
    return <p className="my-0 inbox-name">{username}</p>
  }

  renderLastSeen = () => {
    const { lastSeen } = this.props.contact
    const status = getLastSeenStatus(lastSeen)
    return <p className="my-0 inbox-status">{status}</p>
  }

  renderNotifBadge = (notifCount) => {
    if (notifCount > 0) {
      return (
        <span className="badge badge-pill badge-primary inbox-badge">
          {notifCount}
        </span>
      )
    }
  }
}

export default ChatPreview
