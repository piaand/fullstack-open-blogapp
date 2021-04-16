import React from 'react'
import { addCommentToBlog, addLikeToBlog, deleteBlog } from '../reducers/blogReducer'
import { useSelector, useDispatch } from 'react-redux'
import { initListers } from '../reducers/listersReducer'
import { useHistory } from 'react-router'
import { useField } from '../hooks/index'
import {
	Card,
	CardContent,
	CardHeader,
	CardActions,
	Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	mainBlogInfo: {
		borderBottom: 'solid #ecf2f9 2px'
	}
})

const CommentCollection = ({ blog, postComment }) => {
	const { reset: commentReset, ...comment } = useField('text', 'comment')

	const createNewComment = (event) => {
		event.preventDefault()
		postComment(comment.value)
		commentReset()
	}

	return (
		<div>
			<h4>Write a new comment</h4>
			<form onSubmit={createNewComment}>
				<div>
					Comment:&nbsp; <input {...comment} />
				</div>
				<button id="addCommentButton" type="submit">Post!</button>
			</form>
			<div>
				<h3>Comments:</h3>
				<ul>
					{blog.comments && blog.comments.map(comment =>
						<li key={comment.id}>{comment.content}</li>)}
				</ul>
			</div>
		</div>
	)
}

export const BlogItem = ({ blog, likeBlog, deleteBlog }) => {
	const classes = useStyles()

	return (
		<Card>
			<CardHeader className={classes.mainBlogInfo} title={blog.title}>
			</CardHeader>
			<CardContent className='extendedBlogInfo'>
				<p>by {blog.author}</p>
				<p>{blog.url}</p>
				<p>Added by: {blog.user && blog.user.name}</p>
				<CardActions><i className="fas fa-heart"></i><span id='likeAmount'>{blog.likes}</span>&nbsp;
					<Button onClick={likeBlog}>like</Button>
					<Button onClick={deleteBlog}>remove blog</Button>
				</CardActions>
			</CardContent>
		</Card>)
}

const Blogview = ({ blog }) => {
	const user = useSelector(state => state.user)
	const dispatch = useDispatch()
	const history = useHistory()

	const likeBlog = () => {
		dispatch(addLikeToBlog(blog.id, user))
	}

	const deleteBlogById = async () => {
		const result = window.confirm(`Are you sure you want to remove ${blog.title} from your list?`)
		if (result) {
			await dispatch(deleteBlog(blog.id))
			dispatch(initListers())
			history.push('/blogs')
		}
	}

	const createNewComment = (comment) => {
		dispatch(addCommentToBlog(blog, comment))
	}

	if(!blog) {
		return null
	}
	return (
		<div>
			<BlogItem
				blog={blog}
				likeBlog={likeBlog}
				deleteBlog={deleteBlogById}
			/>
			<CommentCollection
				blog={blog} postComment={createNewComment}/>
		</div>
	)
}

export default Blogview