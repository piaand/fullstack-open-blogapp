const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const api = supertest(app)

describe('when there is some users in the db', () => {
	beforeEach(async () => {
		await testHelper.initTestBlogs()
	})

	test('users are returned as json', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('amount of returned users is correct', async () => {
		const amount = await testHelper.getAmountOfUsers()
		const response = await api.get('/api/users')
		expect(response.body).toHaveLength(amount)
	})

	describe('individual user actions', () => {
		test('when user is added, amount of users is increased by one', async () => {
			const amountOld = await testHelper.getAmountOfUsers()
			const newUser = {
				'username': 'twittwit',
				'name': 'Tiina Twiittaaja',
				'password': 'tviitti4'
			}
			await api
				.post('/api/users')
				.send(newUser)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const users = await testHelper.getAllUsers()
			const names = users.map(user => user.name)
			expect(users.length).toBe(amountOld + 1)
			expect(names).toContain(newUser.name)
		})
	})

	describe('validation of user parameters', () => {
		test('password needs to be 3 character or longer', async () => {
			const newUser = {
				'username': 'twittwit',
				'name': 'Tiina Twiittaaja',
				'password': 'tv'
			}
			await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
		})

		test('Users username must exist and be unique', async () => {
			const users = await testHelper.getAllUsers()
			const existingName = users.map(user => user.username)[0]

			const newUser = {
				username: existingName,
				name: 'Teemu Testaaja',
				password: 'testingtesting123'
			}
			await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
		})
	})

	afterAll(() => {
		mongoose.connection.close()
	})
})