const usersRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userHelper = require('../utils/user_helper')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
	response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
	const body = request.body
	const passwordHash = await userHelper.createPasswordHash(body.password)
	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	//Find the user
	const toRemove = await User.findById(id)
	if(!toRemove) {
		response.status(404).send({ error: 'no user found' })
	}

	//Remove the blogs of the user to be removed
	const blogsToRemove = toRemove.blogs
	if(blogsToRemove && blogsToRemove.length > 0) {
		const blogIds = blogsToRemove.map(blog => blog.toString())
		await Promise.all(
			blogIds.map(async (el) => {
				const res = await Blog.findByIdAndRemove(el)
				logger.info('Deleted blog: ', res)
				return res
			})
		)
	}

	//Remove the user
	await User.findByIdAndRemove(id)
	logger.info('Removed user: ', toRemove)
	response.status(204).end()
})

module.exports = usersRouter