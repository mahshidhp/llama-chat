import React from 'react'
import Joi from 'joi-browser'
import Form from './common/Form'
import profileService from '../services/profileService'
import CloseSection from './common/CloseSection'
import authService from '../services/authService'
import ProfilePic from './common/ProfilePic'
import Input from './common/Input'

class MyProfileForm extends Form {
  state = {
    data: { firstName: '', lastName: '', phone: '', bio: '' },
    errors: {},
    profilePic: null,
  }

  componentDidMount() {
    this.getProfile()
    this.updateProfilePic()
  }

  getProfile = async () => {
    try {
      const { data: profile } = await profileService.getProfile(
        authService.getCurrentUser(),
      )
      const { first_name, last_name, phone, bio } = profile
      const data = {
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        bio: bio,
      }
      this.setState({ data })
    } catch (error) {
      console.log(error)
    }
  }

  schema = {
    firstName: Joi.string().allow('').label('First name'),
    lastName: Joi.string().allow('').label('Last name'),
    phone: Joi.string().allow('').label('Phone number'),
    bio: Joi.string().allow('').label('Bio'),
  }

  doSubmit = async () => {
    try {
      await profileService.editProfile(this.state.data)
      this.props.onCloseMyProfile()
    } catch (error) {
      console.log(error)
    }
  }

  onProfilePicUpload = async (e) => {
    try {
      const newProfilePic = e.target.files[0]
      await profileService.setProfilePicture(newProfilePic)
      this.updateProfilePic()
    } catch (error) {
      console.log(error)
    }
  }

  updateProfilePic = () => {
    const profilePic = <ProfilePic username={authService.getCurrentUser()} />
    this.setState({ profilePic })
  }

  render() {
    return (
      <div className="row mx-0 px-0">
        <CloseSection onClose={this.props.onCloseMyProfile} />
        <div className="position-absolute profile-content scrollable px-3 mx-0 w-100">
          {this.renderProfilePicSection()}
          {this.renderMyProfileForm()}
        </div>
      </div>
    )
  }

  renderProfilePicSection = () => {
    return (
      <div className="row justify-content-center align-items-center ">
        <div className="col-sm-8 text-center">{this.state.profilePic}</div>
        <div className="col-sm-6">
          <Input
            name="profilePic"
            label="Upload a new profile picture:"
            type="file"
            onChange={this.onProfilePicUpload}
          />
        </div>
      </div>
    )
  }

  renderMyProfileForm = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-sm-5">
            {this.renderInput('firstName', 'First name')}
          </div>
          <div className="col-sm-5">
            {this.renderInput('lastName', 'Last name')}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-10">
            {this.renderInput('phone', 'Phone number', 'tel')}
          </div>
          <div className="col-sm-10">
            {this.renderInput('bio', 'Tell us about yourself')}
          </div>
          <div className="col-5 text-center">{this.renderButton('Save')}</div>
        </div>
      </form>
    )
  }
}

export default MyProfileForm
