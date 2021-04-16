import React from 'react'
import PropTypes from 'prop-types'
import { useField } from '../hooks/index'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'


const CreateLoginForm = ({ tryLogin }) => {
	const { reset: usernameReset, ...username } = useField('text', 'username')
	const { reset: passwordReset, ...password } = useField('text', 'password')

	const handleLogin = (event) => {
		event.preventDefault()
		tryLogin({ username: username.value, password: password.value })
		usernameReset()
		passwordReset()
	}

	return (
		<div>
			<h3>Login to view your blogs!</h3>
			<form onSubmit={handleLogin}>
				<div>
					username: <input {...username} />
				</div>
				<div>
					password: <input {...password} />
				</div>
				<button id="loginButton" type="submit">Login</button>
			</form>
		</div>
	)
}

const LoginForm = () => {
	const dispatch = useDispatch()
	const handleLogin = async (loginObject) => {
		try{
			await dispatch(loginUser(loginObject))
		} catch (exception) {
			console.log(exception)
			dispatch(setNotification('Wrong username or password'))
		}
	}
	return(<CreateLoginForm tryLogin={handleLogin}/>)
}

CreateLoginForm.propTypes = {
	tryLogin: PropTypes.func.isRequired,
}

export default LoginForm