const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const testHelper = require('./test_helper')

const getTokenWhenLogin = async (loginUser) => {
	const response = await api.post('/api/login')
		.send(loginUser)
		.expect(200)

	return response.body.token
}

describe('when there is some blogs in the db', () => {
	beforeEach(async () => {
		await testHelper.initTestBlogs()
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('amount of returned blogs is correct', async () => {
		const amount = await testHelper.getAmountOfBlogs()
		const response = await api.get('/api/blogs')
		expect(response.body).toHaveLength(amount)
	})

	test('blog indentifier field is called id', async () => {
		const response = await api.get('/api/blogs/')
		const responseId = response.body[0].id
		expect(responseId).toBeDefined()
	})

	describe('inspect individual blog actions', () => {

		test('get a specific blog', async () => {
			const id = '5a422a851b54a676234d17f7'
			const response = await api.get(`/api/blogs/${id}`)
			expect(response.body.id).toEqual(id)

			const dbBlog = await testHelper.getBlog(id)
			expect(response.body.author).toEqual(dbBlog.author)
		})

		test('when blog-id is not in the db, get 404 status', async () => {
			const id = 'notanid'
			await api
				.get(`/api/blogs/${id}`)
				.expect(404)
		})

		test('after adding a blog, amount of blogs is increased by one', async () => {
			//First log in with user to get token
			const loginUser = {
				username: 'ppepe',
				password: 'sekredBlog',
			}

			const token = await getTokenWhenLogin(loginUser)
			expect(token).toBeDefined()

			//post the blogs
			const dbBlogs = await testHelper.getAllBlogs()
			const newBlog = {
				'title': 'Juliaihminen',
				'author': 'Julia Thuren',
				'url': 'https://www.lily.fi/blogit/juliaihminen/',
				'likes': 23
			}

			await api
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const response = await api.get('/api/blogs')
			const titles = response.body.map(b => b.title)

			expect(response.body).toHaveLength(dbBlogs.length + 1)
			expect(titles).toContain('Juliaihminen')
		})

		test('after removing one blog, amount of blogs is decreased by one', async () => {
			//First log in with user to get token
			const loginUser = {
				username: 'ppepe',
				password: 'sekredBlog',
			}

			const token = await getTokenWhenLogin(loginUser)
			expect(token).toBeDefined()

			//post the blogs
			const newBlog = {
				'title': 'Juliaihminen',
				'author': 'Julia Thuren',
				'url': 'https://www.lily.fi/blogit/juliaihminen/',
				'likes': 23
			}

			const addedBlogResponse = await api
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(newBlog)

			//get the blogs after adding one
			const dbBlogs = await testHelper.getAllBlogs()
			const removeId = addedBlogResponse.body.id
			//const removeId = '5a422aa71b54a676234d17f8'
			//delete the added blog
			await api
				.delete(`/api/blogs/${removeId}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(204)

			const response = await api.get('/api/blogs')
			const responseBlogs = response.body
			expect(responseBlogs.length).toBe(dbBlogs.length - 1)
			const ids = responseBlogs.map(blog => blog.id)
			expect(ids).not.toContain(removeId)
		})

		test('when we change the amount of likes the new likes amount persists' , async () => {
			const changeId = '5a422b3a1b54a676234d17f9'
			const responseOld = await testHelper.getBlog(changeId)
			const oldLikes = responseOld.likes
			const changedBlog = {
				author: responseOld.author,
				title: responseOld.title,
				url: responseOld.url,
				likes: 10
			}

			await api
				.put(`/api/blogs/${changeId}`)
				.send(changedBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const response = await api.get(`/api/blogs/${changeId}`)
			expect(response.body.likes).toBe(10)
			//To make sure the blog didn't have 10 as a starting value
			expect(response.body.likes).not.toBe(oldLikes)
		})
	})

	describe('test blog input validation', () => {
		test('when blog that has no likes field is added, likes are set to 0', async () => {
			//First log in with user to get token
			const loginUser = {
				username: 'ppepe',
				password: 'sekredBlog',
			}

			const token = await getTokenWhenLogin(loginUser)
			expect(token).toBeDefined()

			const noLikesBlog = {
				'title': 'Pupulandia',
				'author': 'Jenni Rotonen',
				'url': 'https://www.pupuplandia.fi/',
			}
			await api
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(noLikesBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const response = await api.get('/api/blogs')
			const blogResponse = response.body.filter(b => b.title === 'Pupulandia')[0]

			expect(blogResponse).toBeDefined
			expect(blogResponse.likes).toBe(0)
		})

		test('when either title or blog address are missing, bad request status is returned', async () => {
			//First log in with user to get token
			const loginUser = {
				username: 'ppepe',
				password: 'sekredBlog',
			}

			const token = await getTokenWhenLogin(loginUser)
			expect(token).toBeDefined()

			const notABlog = {
				'author': 'Pia Andersin',
				'likes': 100238
			}

			const notBBlog = {
				'title': 'My awesome blog!',
				'author': 'Pia Andersin',
				'likes': 100238
			}

			await api
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(notABlog)
				.expect(400)

			await api
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(notBBlog)
				.expect(400)
		})
	})
})

afterAll(() => {
	mongoose.connection.close()
})