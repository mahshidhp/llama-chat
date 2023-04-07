import http from './httpService'
import config from '../config.json'

const apiEndpoint = config.apiUrl + '/signup'

export function signup(user) {
  return http.post(apiEndpoint, {
    username: user.username,
    password: user.password,
  })
}

export default {
  signup,
}
