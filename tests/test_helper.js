const Blog = require('../models/blog')
const User = require('../models/user')
const { createPasswordHash } = require('../utils/user_helper')

const testBlogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0
	},
	{ _id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		__v: 0
	}]

const testUsers = [
	{
		'username': 'inkku',
		'name': 'Iina Influensseri',
		'password': 'influenceSecret'
	},
	{
		'username': 'ppepe',
		'name': 'Pera Plokkaaja',
		'password': 'sekredBlog'
	}]

const getBlog = (id) => {
	return Blog.findById(id)
}

const getUser = (id) => {
	return User.findById(id)
}

const getUserByUsername = (username) => {
	return User.findOne(username)
}

const getAllBlogs = () => {
	return Blog.find({})
}

const getAllUsers = () => {
	return User.find({})
}

const getAmountOfBlogs = async () => {
	const blogs = await getAllBlogs()
	return blogs.length
}

const getAmountOfUsers = async () => {
	const users = await getAllUsers()
	return users.length
}

const saveAUserWithPassword = async (user) => {
	const passwordHash = await createPasswordHash(user.password)
	const newUser = new User({
		username: user.username,
		name: user.name,
		passwordHash,
	})
	return await newUser.save()
}

const initTestBlogs = async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	await Blog.insertMany(testBlogs)
	await Promise.all(
		testUsers.map(async user => {
			await saveAUserWithPassword(user) })
	)
}

module.exports = {
	initTestBlogs,
	getAllBlogs,
	getBlog,
	getAmountOfBlogs,
	getAllUsers,
	getAmountOfUsers,
	getUser,
	getUserByUsername
}