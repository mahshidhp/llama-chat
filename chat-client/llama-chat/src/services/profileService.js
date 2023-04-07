import http from './httpService'
import config from '../config.json'
import authService from './authService'

const apiEndpoint = config.apiUrl + '/user/'

export function getProfile(username) {
  return http.get(apiEndpoint + username)
}

export function editProfile(profile) {
  return http.post(apiEndpoint + authService.getCurrentUser(), profile)
}

export function getProfilePictureURL(username) {
  return apiEndpoint + 'profile-pic/' + username
}

export function setProfilePicture(profilePic) {
  const formData = new FormData()
  formData.append('profile-pic', profilePic)
  return http.post(apiEndpoint + 'profile-pic', formData, {
    'Content-Type': 'multipart/form-data',
  })
}

const profileService = {
  getProfile,
  editProfile,
  getProfilePictureURL,
  setProfilePicture,
}

export default profileService
