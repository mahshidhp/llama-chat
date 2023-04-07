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
      <div className="scrollable">
        <CloseSection onClose={this.props.onCloseProfile} />
        {!username && this.renderErrorMsg()}
        {username && this.rederProfile()}
      </div>
    )
  }

  renderErrorMsg = () => {
    return (
      <div className="row justify-content-center">
        <div className="col-sm-6 alert alert-danger my-2 py-2 px-auto mx-auto">
          Unable to get user profile.
        </div>
      </div>
    )
  }

  rederProfile = () => {
    const { username } = this.state.profile

    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <div className="col-md-4 col-sm-6 px-auto mx-auto text-center">
            <ProfilePic username={username} />
          </div>
        </div>
        <div className="row justify-content-center">
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
        <p
          className="cursor-pointer"
          onClick={() => this.copyToClipboard(username)}
        >
          @{username}
        </p>
        <p
          className="cursor-pointer"
          onClick={() => this.copyToClipboard(phone)}
        >
          {phone}
        </p>
        <p>{bio}</p>
      </div>
    )
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }
}

export default Profile
