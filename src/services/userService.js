import { httpService } from "./http.service"

const KEY = 'user/'

export default {
    query,
    getUserById,
    deleteUser,
    saveUser,
    getEmptyUser,
}

const gUsers = [{ _id: 'u101', name: 'Aviv Zohar', username: 'avivzo9', tasks: [] }, { _id: 'u102', name: 'Hadar Marom', username: 'hadarMa', tasks: [] }, { _id: 'u103', name: 'Oshri Yoktan', username: 'OshYok', tasks: [] }, { _id: 'u104', name: 'gil shrager', tasks: [] }, { _id: 'u105', name: 'Ofek aharon', tasks: [] }]
const gUsersForBack = [{ name: 'Aviv Zohar', username: 'avivzo9', tasks: [] }, { name: 'Hadar Marom', username: 'hadarMa', tasks: [] }, { name: 'Oshri Yoktan', username: 'OshYok', tasks: [] }, { _id: 'u104', name: 'gil shrager', tasks: [] }, { _id: 'u105', name: 'Ofek aharon', tasks: [] }]

// gUsersForBack.forEach(user => saveUser(user))

// CRUDL
async function query() {
    try {
        return await httpService.get(KEY)
    } catch (err) {
        console.log('err:', err)
    }
}

async function getUserById(id) {
    try {
        return await httpService.get(KEY + id)
    } catch (err) {
        console.log('err:', err)
    }
}

async function deleteUser(id) {
    try {
        return await httpService.delete(KEY + id)
    } catch (err) {
        console.log('Error from userService - ', err);
    }
}

async function saveUser(user) {
    try {
        if (user._id) return await httpService.put(KEY + user._id, user)
        return await httpService.post(KEY, user)
    } catch (err) {
        console.log('err:', err)
    }
}

// get functions /////////////////////////////////////////////////////////////////////////////////////////////////

function getEmptyUser() {
    return {
        name: '',
        username: '',
        password: ''
    }
}