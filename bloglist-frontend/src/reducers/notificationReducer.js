const notificationStart = null
let timedOutId = null

export const setNotification = (notification) => {
	return async dispatch => {
		if(timedOutId) {
			clearTimeout(timedOutId)
		}

		dispatch({
			type: 'CHANGE',
			data: {
				notification: notification
			}
		})
		timedOutId = setTimeout(() => {
			dispatch({
				type: 'CHANGE',
				data: {
					notification: null
				}
			})
		}, 5000)
	}
}

const notificationReducer = (state = notificationStart, action) => {
	switch(action.type) {
	case 'CHANGE':
		return action.data.notification
	default:
		return state
	}
}

export default notificationReducer