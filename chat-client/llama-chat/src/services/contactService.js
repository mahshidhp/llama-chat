import http from './httpService'
import config from '../config.json'

const apiEndpoint = config.apiUrl + '/contacts'

export function getContacts() {
  return http.get(apiEndpoint)
}

export function addContact(username) {
  return http.post(apiEndpoint, { username })
}

const contactService = {
  getContacts,
  addContact,
}

export default contactService
