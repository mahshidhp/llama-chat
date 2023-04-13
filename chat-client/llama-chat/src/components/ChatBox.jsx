import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faSmile } from '@fortawesome/free-regular-svg-icons'
import EmojiPicker from 'emoji-picker-react'
import ChatDialogue from './common/ChatDialogue'
import authService from '../services/authService'

class ChatBox extends Component {
  state = { page: 1, showEmojiPicker: false }

  componentDidMount = () => {
    this.scrollToBottom()
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages, unsentMessages } = this.props
    if (
      prevProps.messages.length !== messages.length ||
      prevProps.unsentMessages.length !== unsentMessages.length
    ) {
      this.scrollToBottom()
    }
  }

  render() {
    return (
      <div className="scrollable px-0">
        <div className="position-absolute top-0 w-100">
          {this.renderHeader()}
        </div>
        <div className="position-absolute w-100 chat-box">
          {this.renderChat()}
        </div>
        {this.state.showEmojiPicker && (
          <div
            className="position-absolute emoji-picker"
            onMouseLeave={this.toggleEmojiPicker}
          >
            {this.renderEmojiPicker()}
          </div>
        )}
        <div className="position-absolute bottom-0 w-100">
          {this.renderSendMsgForm()}
        </div>
      </div>
    )
  }

  renderHeader = () => {
    const { onShowProfile, contactUsername, status } = this.props
    return (
      <div className="chat-box-header row align-items-center px-1 py-2 w-100 m-0 shadow-sm">
        <div className="col-1 align-items-start px-2">
          {this.renderBackBtn()}
        </div>
        <div className="col-11 px-3">
          <h5 onClick={onShowProfile} className="my-0 cursor-pointer">
            {contactUsername}
          </h5>
          <p className="my-0 inbox-status">{status}</p>
        </div>
      </div>
    )
  }

  renderBackBtn = () => {
    return (
      <button
        className="btn cursor-pointer"
        onClick={this.props.onShowContacts}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="xl"
          style={{ color: '#000' }}
        />
      </button>
    )
  }

  renderChat = () => {
    const myUsername = authService.getCurrentUser()
    return (
      <div className="scrollable w-100 mx-0 px-2" id="chat-box">
        {this.props.messages.map((msg) => (
          <ChatDialogue key={msg.id} message={msg} myUsername={myUsername} />
        ))}
        {this.props.unsentMessages.map((msg) => (
          <ChatDialogue
            key={msg.created_at}
            message={msg}
            myUsername={myUsername}
          />
        ))}
      </div>
    )
  }

  renderSendMsgForm = () => {
    return (
      <form onSubmit={this.sendMsg}>
        <div className="chat-box-form row align-items-center py-2 w-100 m-0 justify-content-center ">
          <div className="col-1 text-center px-0">
            <FontAwesomeIcon
              icon={faSmile}
              size="xl"
              style={{ color: '#22282770' }}
              className="cursor-pointer"
              onClick={this.toggleEmojiPicker}
            />
          </div>
          <div className="col-8">
            <input
              className="form-control"
              value={this.props.messageDraft}
              onChange={this.props.onMsgChange}
              placeholder="type message..."
            />
          </div>
          <div className="col-2 px-0 mx-0">{this.renderSendBtn()}</div>
        </div>
      </form>
    )
  }

  toggleEmojiPicker = () => {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }

  renderEmojiPicker = () => {
    return (
      <EmojiPicker
        onEmojiClick={this.props.onAddEmoji}
        height={350}
        previewConfig={{ showPreview: false }}
      />
    )
  }

  renderSendBtn = () => {
    return (
      <button type="submit" className="send-btn">
        <FontAwesomeIcon icon={faPaperPlane} style={{ color: '#FFF' }} />
      </button>
    )
  }

  scrollToBottom = () => {
    const chatBox = document.getElementById('chat-box')
    chatBox.scrollTop = chatBox.scrollHeight
  }

  sendMsg = (e) => {
    e.preventDefault()
    this.props.onMsgSend()
  }
}

export default ChatBox
