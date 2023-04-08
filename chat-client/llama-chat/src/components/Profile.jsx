import React, { Component } from 'react'
import profileService from '../services/profileService'
import CloseSection from './common/CloseSection'
import ProfilePic from './common/ProfilePic'

class Profile extends Component {
  state = { profile: {} }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    try {
      const { username } = this.props
      const { data: profile } = await profileService.getProfile(username)
      this.setState({ profile })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { username } = this.state.profile

    return (
      <React.Fragment>
        <CloseSection onClose={this.props.onCloseProfile} />
        <div className="px-0 mx-0 position-absolute w-100 profile-content scrollable">
          {!username && this.renderErrorMsg()}
          {username && this.renderProfile()}
        </div>
      </React.Fragment>
    )
  }

  renderErrorMsg = () => {
    return (
      <div className="row justify-content-center mx-0">
        <div className="col-sm-6 alert alert-danger my-2 py-2 px-auto mx-auto">
          Unable to get user profile.
        </div>
      </div>
    )
  }

  renderProfile = () => {
    const { username } = this.state.profile
    return (
      <React.Fragment>
        <div className="row justify-content-center mx-0">
          <div className="col-md-4 col-sm-6 w-100 text-center">
            <ProfilePic username={username} />
          </div>
        </div>
        <div className="row justify-content-center mx-0">
          {this.renderUserInfo()}
        </div>
      </React.Fragment>
    )
  }

  renderUserInfo = () => {
    const { first_name, last_name, username, phone, bio } = this.state.profile
    return (
      <div className="col-sm-8 px-4 m-4">
        <h4>{`${first_name} ${last_name}`}</h4>
        <hr />
        <table className="w-100">
          {username && this.renderTableRow('username', '@' + username)}
          {phone && this.renderTableRow('phone', phone)}
          {bio && this.renderTableRow('bio', bio)}
        </table>
      </div>
    )
  }

  renderTableRow = (title, value) => {
    return (
      <tr className="profile-item">
        <td className="profile-item-title">{title}</td>
        <td
          className="cursor-pointer profile-item-value"
          onClick={() => this.copyToClipboard(value)}
        >
          {value}
        </td>
      </tr>
    )
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }
}

export default Profile
