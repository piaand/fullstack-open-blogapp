import blogService from '../services/blogs'
import loginService from '../services/login'

export const loginUser = (loginObject) => {
	return async dispatch => {
		try {
			const user = await loginService.login(loginObject)
			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
			blogService.setToken(user.token)
			dispatch({
				type: 'LOGIN',
				data: user
			})
		} catch (exception) {
			return Promise.reject('Invalid login')
		}
	}
}
export const retrieveUser = (loggedUserJSON) => {
	return async dispatch => {
		const user = JSON.parse(loggedUserJSON)
		blogService.setToken(user.token)
		dispatch({
			type: 'RETRIEVE',
			data: user
		})
		console.log(`Uploaded user from local storage: ${user.name}`)
	}
}

export const logoutUser = () => {
	return async dispatch => {
		window.localStorage.removeItem('loggedBlogAppUser')
		blogService.setToken(null)
		dispatch({
			type: 'LOGOUT',
		})
	}
}

const userReducer = (state = null, action) => {
	switch(action.type) {
	case 'LOGIN':
		return action.data
	case 'RETRIEVE':
		return action.data
	case 'LOGOUT':
		return null
	default:
		return state
	}
}

export default userReducer