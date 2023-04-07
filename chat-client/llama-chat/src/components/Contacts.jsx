import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import ChatPreview from './common/ChatPreview'

class Contacts extends Component {
  render() {
    const { contacts, searchQuery } = this.props
    return (
      <React.Fragment>
        {this.renderHeader()}
        <div className="position-absolute w-100 scrollable inbox-content">
          {contacts.length > 0 && this.renderContacts()}
          {searchQuery && this.renderAddNewContact()}
        </div>
      </React.Fragment>
    )
  }

  renderHeader() {
    return (
      <div className="row mx-0 inbox-search px-2 py-1 shadow-sm align-items-center position-absolute top-0 w-100">
        <div className="col-2 text-center">{this.renderSetting()}</div>
        <div className="col">{this.renderUserSearch()}</div>
      </div>
    )
  }

  renderSetting() {
    return (
      <div class="dropdown">
        <button
          className="btn cursor-pointer"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faBars} size="xl" style={{ color: '#000' }} />
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li>
            <Link to="/logout" className="dropdown-item">
              Logout
            </Link>
          </li>
          <li onClick={this.props.onSelectMyProfile}>
            <a href="#" className="dropdown-item">
              My profile
            </a>
          </li>
        </ul>
      </div>
    )
  }

  renderUserSearch = () => {
    return (
      <input
        className="form-control w-100 my-2"
        placeholder="&#xF002;  Search for users"
        style={{ fontFamily: 'Arial, FontAwesome' }}
        value={this.props.searchQuery}
        onChange={this.props.onSearchQueryChange}
      />
    )
  }

  renderContacts = () => {
    return (
      <div className="inbox">
        {this.props.contacts.map((contact) => (
          <ChatPreview
            key={contact.id}
            contact={contact}
            onSelectChat={this.props.onSelectChat}
          />
        ))}
      </div>
    )
  }

  renderAddNewContact = () => {
    return (
      <div
        className="add-contact p-4 mx-0 cursor-pointer"
        onClick={this.props.onAddContact}
      >
        <FontAwesomeIcon
          icon={faPlus}
          size="sm"
          style={{ color: '#000' }}
          className="mx-2"
        />
        Add username "{this.props.searchQuery}" to contacts.
      </div>
    )
  }
}

export default Contacts
