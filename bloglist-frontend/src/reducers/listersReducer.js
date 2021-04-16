import userService from '../services/users'

export const initListers = () => {
	return async dispatch => {
		try {
			const listers = await userService.getUsers()
			dispatch({
				type: 'INIT_LISTERS',
				data: listers
			})
		} catch (exception) {
			console.log(exception)
		}
	}
}

const listersReducer = (state = [], action) => {
	switch(action.type) {
	case 'INIT_LISTERS':
		return action.data
	default:
		return state
	}
}

export default listersReducer