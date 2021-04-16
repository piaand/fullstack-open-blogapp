import axios from 'axios'

const baseUrl = '/api/users'

const getUsers = async () => {
	try {
		const users = await axios.get(baseUrl)
		return users.data
	} catch (exception) {
		console.log('Error getting users: ')
		console.log(exception)
	}
}

export default {
	getUsers
}