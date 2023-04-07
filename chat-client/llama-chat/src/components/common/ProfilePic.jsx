import React, { Component } from 'react'
import profileService from '../../services/profileService'
import { ReactComponent as SampleProfile } from '../media/profile.svg'

class ProfilePic extends Component {
  render() {
    const { username } = this.props
    const profilePicUrl = profileService.getProfilePictureURL(username)
    return (
      <object
        data={profilePicUrl}
        type="image/png"
        className="profile-pic shadow-sm px-0"
      >
        <SampleProfile className="animation" />
      </object>
    )
  }
}

export default ProfilePic
