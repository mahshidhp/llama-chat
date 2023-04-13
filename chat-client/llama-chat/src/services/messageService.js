import http from './httpService'
import config from '../config.json'

const apiEndpoint = config.apiUrl + '/messages/'

export function getMessages(username, page) {
  const messages = http.get(apiEndpoint + username, { params: { page: page } })
  return messages
}

const messageService = {
  getMessages,
}

export default messageService
