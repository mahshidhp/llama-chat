import jwtDecode from 'jwt-decode'
import http from './httpService'
import config from '../config.json'

const apiEndpoint = config.apiUrl + '/login'
const tokenKey = 'token'

http.setJwt(getJwt())

export async function login(username, password) {
  const { data: jwt } = await http.post(apiEndpoint, { username, password })
  localStorage.setItem(tokenKey, jwt)
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt)
}

export function logout() {
  localStorage.removeItem(tokenKey)
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey)
    const decodedJwt = jwtDecode(jwt)
    return decodedJwt.username
  } catch (ex) {
    return null
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey)
}

const authService = {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
}

export default authService
