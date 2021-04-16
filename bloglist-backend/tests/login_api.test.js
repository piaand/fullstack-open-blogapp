const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const testHelper = require('./test_helper')

describe('when there are registered users in the db', () => {
	beforeEach(async () => {
		await testHelper.initTestBlogs()
	})

	test('when login in correctly, token is received', async () => {
		const loginUser = {
			username: 'ppepe',
			password: 'sekredBlog',
		}

		const response = await api.post('/api/login')
			.send(loginUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(response.body.token).toBeDefined()
	})

	test('when logged in incorrectly, 401 status is received', async () => {
		const loginUser = {
			username: 'ppepe',
			password: 'notThePassword',
		}

		await api.post('/api/login')
			.send(loginUser)
			.expect(401)
	})

	afterAll(() => {
		mongoose.connection.close()
	})
})