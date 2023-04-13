import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck,
  faCheckDouble,
  faClock,
  faExclamation,
} from '@fortawesome/free-solid-svg-icons'

const statuses = {
  unsent: <FontAwesomeIcon icon={faClock} />,
  sent: <FontAwesomeIcon icon={faCheck} />,
  seen: <FontAwesomeIcon icon={faCheckDouble} />,
  err: <FontAwesomeIcon icon={faExclamation} />,
}

class ChatDialogue extends Component {
  render() {
    const { sender, text, status, created_at } = this.props.message
    const { myUsername } = this.props
    const time = new Date(created_at * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return sender === myUsername
      ? this.renderMyMsg(text, time, status)
      : this.renderOthersMsg(text, time)
  }

  renderMyMsg = (text, time, status = 'sent') => {
    return (
      <div className="row justify-content-end">
        <div className="col-8 msg msg-from-me p-2 m-3 shadow-sm">
          <p>{text}</p>
          <p className="msg-info text-end m-0">
            {time}
            {' - '}
            {statuses[status]}
          </p>
        </div>
      </div>
    )
  }

  renderOthersMsg = (text, time) => {
    return (
      <div className="row">
        <div className="col-8 msg msg-from-others p-2 m-3 shadow-sm">
          <p>{text}</p>
          <p className="msg-info text-end m-0">{time}</p>
        </div>
      </div>
    )
  }
}

export default ChatDialogue
