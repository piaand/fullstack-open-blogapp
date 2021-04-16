import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks/index'
import { initListers } from '../reducers/listersReducer'

export const CreateBlogForm = ({ addNewBlog }) => {
	const { reset: titleReset, ...title } = useField('text', 'title')
	const { reset: authorReset, ...author } = useField('text', 'author')
	const { reset: urlReset, ...url } = useField('text', 'url')

	const createNewBlog = (event) => {
		event.preventDefault()
		addNewBlog({
			title: title.value,
			author: author.value,
			url: url.value
		})
		titleReset()
		authorReset()
		urlReset()
	}

	return (
		<div>
			<h3>Create new blog</h3>
			<form onSubmit={createNewBlog}>
				<div>
					title:&nbsp; <input {...title} />
				</div>
				<div>
					author:&nbsp; <input {...author} />
				</div>
				<div>
					url:&nbsp; <input {...url} />
				</div>
				<button id="addBlogButton" type="submit">Create</button>
			</form>
		</div>)
}

const BlogForm = ({ blogFormRef }) => {
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)

	const addNewBlog = async (blogObject) => {
		blogFormRef.current.toggleVisibility()
		await dispatch(addBlog(blogObject, user))
		dispatch(initListers())
		dispatch(setNotification(`Blog titled '${blogObject.title}' is now added to the list.`))
	}

	return (<CreateBlogForm addNewBlog={addNewBlog} />)
}

BlogForm.propTypes = {
	blogFormRef: PropTypes.object.isRequired
}

export default BlogForm