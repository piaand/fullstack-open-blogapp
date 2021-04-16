const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const { identifyUserFromToken } = require('../utils/user_helper')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
		.populate('user', { username: 1, name: 1 })
		.populate('comments')
	response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id).populate('comments')
	response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	const user = await identifyUserFromToken(request.token)
	const blog = new Blog({
		url: body.url,
		author: body.author,
		title: body.title,
		likes: body.likes,
		user: user.id
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	response.status(201).json(savedBlog.toJSON())
})

blogsRouter.post('/:id/comments', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if(!blog) {
		response.status(404).send({ error:  'no blog found' })
	}

	const body = request.body
	const comment = new Comment({
		content: body.content,
		blog: blog.id
	})
	const savedComment = await comment.save()
	blog.comments = blog.comments.concat(savedComment._id)
	await blog.save()
	response.status(201).json(savedComment.toJSON())
})

blogsRouter.put('/:id', async (request, response) => {
	const data = request.body
	const newBlog = {
		author: data.author,
		title: data.title,
		url: data.url,
		likes: data.likes,
		comments: data.comments,
		user: data.user
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
	response.status(201).json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	//Blog to be deleted must be found in both collentions, User and Blogs
	//First check the user collection
	const remover = await identifyUserFromToken(request.token)
	const removerBlogs = remover.blogs
	if(!removerBlogs.includes(id)) {
		response.status(404).send({ error: 'no blogs found' })
	}

	//Then check the Blog collection
	const blogToRemove = await Blog.findById(id)
	if(blogToRemove.user.toString() === remover._id.toString()) {
		logger.info(`Start the removing operation for blog: ${blogToRemove}`)
		//Remove blog from remover
		const removerId = remover.id
		const restBlogs = removerBlogs.filter(blog => blog !== id)
		const changedRemover = { ...remover, blogs: restBlogs }
		await User.findByIdAndUpdate(removerId, changedRemover, { new: true })
		logger.info('Blog removed from collection User')

		//Remove blog from collection
		await Blog.findByIdAndRemove(id)
		logger.info('Blog removed from collection Blog')
		response.status(204).end()
	} else {
		response.status(401).send({ error: 'invalid request' })
	}
})

module.exports = blogsRouter