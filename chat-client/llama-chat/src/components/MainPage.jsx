import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import ChatBox from './ChatBox'
import Profile from './Profile'
import Contacts from './Contacts'
import MyProfileForm from './MyProfileForm'
import authService from '../services/authService'
import contactService from '../services/contactService'
import socketService from '../services/socketService'
import messageService from '../services/messageService'
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
    for (let i = 0; i < contacts.length; i++) {
      messages[contacts[i].username] = []
      unsentMessages[contacts[i].username] = []
    }
    this.setState({ messages, unsentMessages })
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

    this.setState({ searchQuery, filteredContacts })
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

    const msg = {
      id: null,
      sender: authService.getCurrentUser(),
      receiver: selectedContact,
      text: messageDraft,
      created_at: new Date().getTime() / 1000,
      status: 'unsent',
    }

    socketService.send(msg)

    const unsentMessages = { ...this.state.unsentMessages }
    const selectedContactUnsentMsgs = [...unsentMessages[selectedContact], msg]
    unsentMessages[selectedContact] = selectedContactUnsentMsgs
    this.setState({ messageDraft: '', unsentMessages })
  }

  handleMsgSent = (msg) => {
    msg.status = 'sent'

    const receiver = msg['receiver']
    const unsentMessages = { ...this.state.unsentMessages }
    const receiverUnsentMsgs = unsentMessages[receiver].filter(
      (m) => m.text !== msg.text,
    )
    unsentMessages[receiver] = receiverUnsentMsgs

    const messages = { ...this.state.messages }
    const receiverMessages = [...messages[receiver], msg]
    messages[receiver] = receiverMessages

    this.setState({ unsentMessages, messages })
  }

  handleMsgReceive = (msg) => {
    const sender = msg['sender']
    // const contacts = [...this.state.contacts]
    // if (!contacts.some(contact => contact.username === sender)) {
    // }
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

  handleSelectChat = async (selectedUsername) => {
    try {
      this.setState({ selectedContact: selectedUsername, view: 1 })

      const { data: latestMessages } = await messageService.getMessages(
        selectedUsername,
        1,
      )
      const messages = { ...this.state.messages }
      messages[selectedUsername] = latestMessages
      this.setState({ messages })
    } catch (err) {
      console.log(err)
    }
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
