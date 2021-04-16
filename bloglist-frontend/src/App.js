import './App.css'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blogview from './components/Blogview'
import { initBlogs } from './reducers/blogReducer'
import { initListers } from './reducers/listersReducer'
import { retrieveUser } from './reducers/userReducer'
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom'
import UserCollection from './components/UserCollection'
import Userview from './components/Userview'
import BlogCollection from './components/BlogCollection'
import Container from '@material-ui/core/Container'

const App = () => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)
	const listers = useSelector(state => state.listers)
	const blogs = useSelector(state => state.blog)

	const matchByUserId = useRouteMatch('/users/:id')
	const matchByBlogId = useRouteMatch('/blogs/:id')
	const userMatch = matchByUserId
		? listers.find(lister => lister.id === matchByUserId.params.id)
		: null
	const blogMatch = matchByBlogId
		? blogs.find(blog => blog.id === matchByBlogId.params.id)
		: null

	useEffect(() => {
		dispatch(initBlogs())
	}, [])

	useEffect(() => {
		dispatch(initListers())
	}, [])

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
		if(loggedUserJSON) {
			dispatch(retrieveUser(loggedUserJSON))
		}
	}, [])
	return (
		<Container>
			<Header />
			<h1>Bloglists!</h1>
			<Notification />
			<Switch>
				<Route path='/users/:id'>
					<Userview user={userMatch}/>
				</Route>
				<Route path='/blogs/:id'>
					<Blogview blog={blogMatch}/>
				</Route>
				<Route path='/users'>
					{user ? <UserCollection /> : <Redirect to='/login' />}
				</Route>
				<Route path='/blogs'>
					{user ? <BlogCollection /> : <Redirect to='/login' />}
				</Route>
				<Route path='/login'>
					{user ? <Redirect to='/users' />: <LoginForm />}
				</Route>
				<Route path='/'>
					{user ? <Redirect to='/users' /> : <Redirect to='/login' />}
				</Route>
			</Switch>
		</Container>
	)
}

export default App
