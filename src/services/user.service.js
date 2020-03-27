import { sessionService } from './session.service.js'
import { httpService } from '../services/http.service'
import { storageService } from '../services/storage.service'
import { utilService } from '../services/util.service'


export const userService = {
    login,
    logout,
    signup,
    query,
    getById,
    remove,
    update,
    getLoggedInUser
}

function getLoggedInUser() {
    let user = sessionService.get('user')
    if (user) return getById(user._id)
    user = storageService.load('user')
    if (user) return getById(user._id)
    
    return _makeGuestUser()
}

function getById(userId) {
    return httpService.get(`user/${userId}`)
}
function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

function update(user) {
    return httpService.put(`user/${user._id}`, user)
}

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred)
    try {
        _handleLogin(user)
        return user
    } catch {
        console.log('ERR: Unauthorized');
        throw new Error
    }
}
async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred)
    try {
        return _handleLogin(user)
    } catch {
        console.log('ERR: Unauthorized');
        throw new Error
    }
}
async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
    localStorage.clear();
}
function query(searchStr) {
    return httpService.get('user', searchStr)
}

function _handleLogin(user) {
    sessionService.set('user', user)
    return user;
}

async function _makeGuestUser() {
    const credentials = {
        username: 'Guest' + utilService.getRandom(1001, 9999),
        email: 'gus@guest.com',
        password: '123',
    }
    const user = await signup(credentials)
    try {
        storageService.store('user', user)
        return user
    } catch {
        console.log('Err, guest signup failed');
        return null
    }

}