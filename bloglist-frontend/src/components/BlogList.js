import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
	Card,
	CardContent,
	CardHeader,
	CardActions,
	Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
	root: {
		minWidth: 275,
		marginBottom: 12,
	},
	header: {
		borderBottom: 'solid #ecf2f9 2px'
	}
})

const BlogLink = ( { blog, address } ) => {
	const classes = useStyles()
	return (
		<Card className={classes.root}>
			<CardHeader className={classes.header} title={blog.title} />
			<CardContent>
				<span className='blogLink'>by {blog.author}</span>
				<CardActions>
					<Link to={address}>
						<Button size="small">See full view</Button>
					</Link>
				</CardActions>
			</CardContent>
		</Card>
	)
}

const BlogList = () => {
	const user = useSelector(state => state.user)
	const blogs = useSelector(state => state.blog
		.filter(blog => blog.user && blog.user.username === user.username)
		.sort((a,b) => b.likes - a.likes ))
	const baseAddress = '/blogs/'

	return (
		<div>
			<h3>Here are your blogs: </h3>
			{blogs.map(blog => <BlogLink
				key={blog.id}
				blog={blog}
				address={baseAddress + blog.id}/>)}
		</div>
	)
}
export default BlogList