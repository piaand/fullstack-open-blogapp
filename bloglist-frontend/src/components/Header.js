import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'
import {
	AppBar,
	Toolbar,
	Button
} from '@material-ui/core'

const LoggedUser = ({ user, handleLogout }) => {
	return (
		<div className='loggedUser'>
			Logged in as {user.name}&nbsp;
			<Button onClick={handleLogout} color='inherit'>
				Log out
			</Button>
		</div>
	)
}

const NavigationBar = () => (
	<div>
		<Button color='inherit'>
			<Link to='/users'>users</Link>
		</Button>
		<Button color='inherit'>
			<Link to='/blogs'>blogs</Link>
		</Button>
	</div>
)

const Header = () => {
	const user = useSelector(state => state.user)
	const dispatch = useDispatch()
	const history = useHistory()
	const handleLogout = () => {
		dispatch(logoutUser())
		history.push('/login')
	}

	return (
		<AppBar position="static">
			<Toolbar>
				<NavigationBar />
				{ user !== null && <LoggedUser user={user} handleLogout={handleLogout}/>}
			</Toolbar>
		</AppBar>
	)
}

export default Header