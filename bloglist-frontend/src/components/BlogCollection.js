import React, { useRef } from 'react'
import Togglable from './Togglable'
import BlogList from './BlogList'
import BlogForm from './BlogForm'

const BlogCollection = () => {
	const blogFormRef = useRef()
	return (
		<div>
			<Togglable buttonLabel={'new blog'} ref={blogFormRef}>
				<BlogForm blogFormRef={blogFormRef} />
			</Togglable>
			<BlogList />
		</div>
	)
}

export default BlogCollection