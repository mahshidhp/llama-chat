import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import ChatBox from './ChatBox'
import Profile from './Profile'
import Contacts from './Contacts'
import authService from '../services/authService'
import contactService from '../services/contactService'
import socketService from '../services/socketService'
import MyProfileForm from './MyProfileForm'
import { getLastSeenStatus } from '../util'

class MainPage extends Component {
  state = {
    view: 0,

    contacts: [],
    selectedContact: null,
    searchQuery: '',
    filteredContacts: [],

    messages: [],
    unsentMessages: [],
    unreadMessages: [],
    messageDraft: '',
  }

  componentDidMount = () => {
    this.getContacts()
    socketService.run(
      this.handleMsgSent,
      this.handleMsgReceive,
      this.onLastSeenReceive,
      this.getContactsUsernames,
    )
  }

  getContacts = async () => {
    try {
      const { data: contacts } = await contactService.getContacts()
      this.setState({ contacts, filteredContacts: contacts }, () => {
        this.initializeMessages()
      })
    } catch (error) {
      console.log(error)
    }
  }

  initializeMessages = () => {
    const { contacts } = this.state
    const messages = {}
    const unsentMessages = {}
    const unreadMessages = {}
    for (let i = 0; i < contacts.length; i++) {
      messages[contacts[i].username] = []
      unsentMessages[contacts[i].username] = []
      unreadMessages[contacts[i].username] = 0
    }
    this.setState({ messages, unreadMessages, unsentMessages })
  }

  render() {
    if (!authService.getCurrentUser()) {
      return <Redirect to="/login" />
    }

    return (
      <div
        className="container-fluid h-100 main"
        onKeyDown={(e) => this.handleKeyPress(e)}
        tabIndex="0"
      >
        <MediaQuery minWidth={600}>
          <div className="row justify-content-center h-100 mx-2">
            <div className="card col-md-8 px-0 my-auto app position-relative">
              <div className="scrollable">{this.renderContent()}</div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={600}>
          <div className="row align-items-start h-100">
            {this.renderContent()}
          </div>
        </MediaQuery>
      </div>
    )
  }

  renderContent = () => {
    const { view, selectedContact } = this.state
    if (view === 0) {
      return (
        <Contacts
          contacts={this.state.filteredContacts}
          searchQuery={this.state.searchQuery}
          onSearchQueryChange={this.handleSearchQuery}
          onAddContact={this.handleAddContact}
          onSelectChat={this.handleSelectChat}
          onSelectMyProfile={this.handleSelectMyProfile}
        />
      )
    }
    if (view === 1) {
      return (
        <ChatBox
          messages={this.state.messages[selectedContact]}
          unsentMessages={this.state.unsentMessages[selectedContact]}
          contactUsername={this.state.selectedContact}
          status={getLastSeenStatus(this.getSelectedContact().lastSeen)}
          onShowProfile={this.handleShowProfile}
          onShowContacts={this.handleShowContacts}
          onMsgSend={this.handleMsgSend}
          onMsgChange={this.handleMsgChange}
          onAddEmoji={this.handleAddEmoji}
          messageDraft={this.state.messageDraft}
        />
      )
    }
    if (view === 2) {
      return (
        <Profile
          username={this.state.selectedContact}
          onCloseProfile={this.handleCloseProfile}
        />
      )
    }
    if (view === 3) {
      return <MyProfileForm onCloseMyProfile={this.handleCloseMyProfile} />
    }
  }

  handleSearchQuery = (e) => {
    const searchQuery = e.target.value
    const filteredContacts = this.state.contacts.filter((contact) =>
      contact.username.includes(searchQuery),
    )

    this.setState({ searchQuery, filteredContacts }, () => {
      console.log(searchQuery, filteredContacts)
    })
  }

  handleAddContact = async () => {
    try {
      const username = this.state.searchQuery
      const { data: newContact } = await contactService.addContact(username)
      const contacts = this.state.contacts + [newContact]
      this.setState({ contacts, searchQuery: '' })
    } catch (error) {
      console.log(error)
    }
  }

  handleAddEmoji = (emoji) => {
    const messageDraft = this.state.messageDraft + emoji.emoji
    this.setState({ messageDraft })
  }

  handleMsgChange = (e) => {
    const messageDraft = e.target.value
    this.setState({ messageDraft })
  }

  handleMsgSend = () => {
    const { messageDraft, selectedContact } = this.state
    if (!messageDraft) {
      return
    }
    const newMsg = socketService.send(messageDraft, selectedContact)
    const unsentMessages = { ...this.state.unsentMessages }
    const selectedContactUnsentMsgs = [
      ...unsentMessages[selectedContact],
      newMsg,
    ]
    unsentMessages[selectedContact] = selectedContactUnsentMsgs
    this.setState({ messageDraft: '', unsentMessages })
  }

  handleMsgSent = (msg) => {
    const receiver = msg['to']
    const unsentMessages = { ...this.state.unsentMessages }
    const receiverUnsentMsgs = unsentMessages[receiver].filter(
      (m) => m.createdAt !== msg.createdAt,
    )
    unsentMessages[receiver] = receiverUnsentMsgs

    msg.status = 'sent'
    const messages = { ...this.state.messages }
    const receiverMessages = [...messages[receiver], msg]
    messages[receiver] = receiverMessages

    this.setState({ unsentMessages, messages })
  }

  handleMsgReceive = (msg) => {
    // if sender not in contacts refresh contacts
    const sender = msg['from']
    const messages = { ...this.state.messages }
    const senderMessages = [...messages[sender], msg]
    messages[sender] = senderMessages
    this.setState({ messages })
  }

  getContactsUsernames = () => {
    const { contacts } = this.state
    const contactsUsername = []
    for (let i = 0; i < contacts.length; i++) {
      contactsUsername.push(contacts[i].username)
    }
    return contactsUsername
  }

  getSelectedContact = () => {
    const { selectedContact, contacts } = this.state
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].username === selectedContact) {
        return contacts[i]
      }
    }
  }

  onLastSeenReceive = (contactsLastSeen) => {
    const contacts = [...this.state.contacts]
    contacts.forEach((contact) => {
      contact.lastSeen = contactsLastSeen[contact.username]
    })
    this.setState({ contacts })
  }

  handleShowProfile = () => {
    this.setState({ view: 2 })
  }

  handleShowContacts = () => {
    this.setState({ view: 0 })
  }

  handleCloseProfile = () => {
    this.setState({ view: 1 })
  }

  handleSelectChat = (username) => {
    const unreadMessages = this.state.unreadMessages
    unreadMessages[username] = 0
    this.setState({ selectedContact: username, view: 1, unreadMessages })
    socketService.read(username)
  }

  handleSelectMyProfile = () => {
    this.setState({ view: 3 })
  }

  handleCloseMyProfile = () => {
    this.setState({ view: 0 })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      const { view } = this.state
      if (view === 2) {
        this.setState({ view: 1 })
      } else if (view === 1) {
        this.setState({ view: 0 })
      } else if (view === 3) {
        this.setState({ view: 0 })
      }
    }
  }
}

export default MainPage
