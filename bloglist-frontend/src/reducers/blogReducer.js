import blogService from '../services/blogs'

const createBlogWithUserDetails = ( id, blog, user ) => {
	const userDetails = {
		id: id,
		username: user.username,
		name: user.name
	}
	return { ...blog, user: userDetails }
}

export const addLikeToBlog = ( id, user ) => {
	return async dispatch => {
		try {
			const response = await blogService.getBlog(id)
			//get is populated with comment data, response needs only ids
			const comments = response.comments
			const commentIds = comments.map(comment => comment.id)
			const addedLike = response.likes + 1
			const likedBlog = { ...response, likes: addedLike, comments: commentIds }

			const updatedBlog = await blogService.update(id, likedBlog)
			const blogWithUserDetails = createBlogWithUserDetails(id, { ...updatedBlog, comments: comments }, user)
			dispatch({
				type: 'LIKE_BLOG',
				data: blogWithUserDetails
			})
		} catch (exception) {
			console.log('Met exception')
			console.log(exception)
		}
	}
}

export const addCommentToBlog = ( blog, comment ) => {
	return async dispatch => {
		try {
			const response = await blogService.addComment(blog.id, { content: comment })
			const addedComment = blog.comments.concat({ content: response.content, id: response.id })
			const commentedBlog = { ...blog, comments: addedComment }
			dispatch({
				type: 'COMMENT_BLOG',
				data: commentedBlog
			})
		} catch (exception) {
			console.log('Met exception')
			console.log(exception)
		}
	}
}

export const initBlogs = () => {
	return async dispatch => {
		try {
			const blogsData = await blogService.getAll()
			dispatch({
				type: 'INIT_BLOG',
				data: blogsData
			})
		} catch (exception) {
			console.log(exception)
		}
	}
}

export const addBlog = (blogObject, user) => {
	return async dispatch => {
		try {
			const response = await blogService.create(blogObject)
			const addedBlog = createBlogWithUserDetails(response.user, response, user)
			dispatch({
				type: 'ADD_BLOG',
				data: addedBlog
			})
		} catch (exception) {
			console.log(exception)
		}
	}

}

export const deleteBlog = (id) => {
	return async dispatch => {
		try {
			await blogService.removeBlog(id)
			dispatch({
				type: 'DELETE_BLOG',
				data: id
			})
		} catch (exception) {
			console.log('Met exception')
			console.log(exception)
		}
	}
}

const blogReducer = (state = [], action) => {
	switch(action.type) {
	case 'INIT_BLOG':
		return action.data
	case 'ADD_BLOG':
		return state.concat(action.data)
	case 'LIKE_BLOG':
		return state.map(blog => blog.id !== action.data.id ? blog : action.data)
	case 'COMMENT_BLOG':
		return state.map(blog => blog.id !== action.data.id ? blog : action.data)
	case 'DELETE_BLOG':
		return state.filter(blog => blog.id !== action.data )
	default:
		return state
	}
}

export default blogReducer