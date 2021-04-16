const listHelper = require('../utils/list_helper')

const noBlogs = []
const listWithOneBlog = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0
	}]

const blogs = [
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

const noLikes = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422a851b54a676234d17gg',
		title: 'React patterns v 2',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 0,
		__v: 0
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 0,
		__v: 0
	}]

test('dummy returns one', () => {
	const result = listHelper.dummy(blogs)
	expect(result).toBe(1)
})

describe('total likes', () => {

	test('when list has only one blog equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})

	test('when list has multiple blogs, the likes are calculated correct', () => {
		const result = listHelper.totalLikes(blogs)
		expect(result).toBe(36)
	})

	test('when list has no blogs, likes should be 0', () => {
		const result = listHelper.totalLikes(noBlogs)
		expect(result).toBe(0)
	})

	test('when blogs with no likes are counted together result should be 0', () => {
		const result = listHelper.totalLikes(noLikes)
		expect(result).toBe(0)
	})

})

describe('favourite blog', () => {
	test('when one blog has most likes it should be returned', () => {
		const result = listHelper.favoriteBlog(blogs)
		expect(result.title).toEqual('Canonical string reduction')
		expect(result.author).toEqual('Edsger W. Dijkstra')
		expect(result.likes).toBe(12)
	})

	test('when all blogs have equal likes, one of them is returned', () => {
		const result = listHelper.favoriteBlog(noLikes)
		//Assuming all titles are unique
		const match = noLikes.filter(blog => blog.title === result.title)[0]

		expect(result.author).toEqual(match.author)
		expect(result.likes).toBe(match.likes)
	})

	test('when array has no blogs and empty object is returned', () => {
		const result = listHelper.favoriteBlog(noBlogs)
		expect(result).toEqual({})
	})
})

describe('author with most blogs', () => {
	test('when one author has more blogs than other authors, author name and amount of blogs are returned', () => {
		const result = listHelper.mostBlogs(blogs)
		expect(result.author).toEqual('Robert C. Martin')
		expect(result.blogs).toBe(3)
	})

	test('when array has no blogs and empty object is returned', () => {
		const result = listHelper.mostBlogs(noBlogs)
		expect(result).toEqual({})
	})

	test('when multiple author have equal amount of blogs, one of them is returned', () => {
		const result = listHelper.mostBlogs(noLikes)
		expect(result.blogs).toBe(2)
		expect(['Michael Chan', 'Edsger W. Dijkstra']).toContain(result.author)
	})

	test('when only one blog is given, author and amount 1 is returned', () => {
		const result = listHelper.mostBlogs(listWithOneBlog)
		expect(result.blogs).toBe(1)
		expect(result.author).toEqual('Edsger W. Dijkstra')
	})

})

describe('author with most likes on blogs', () => {
	test('when one author has more likes on blogs than other authors, author name and amount of likes are returned', () => {
		const result = listHelper.mostLikes(blogs)
		expect(result.author).toEqual('Edsger W. Dijkstra')
		expect(result.likes).toBe(17)
	})

	test('when array has no blogs and empty object is returned', () => {
		const result = listHelper.mostLikes(noBlogs)
		expect(result).toEqual({})
	})

	test('when multiple author have equal amount of likes on blogs, one of them is returned', () => {
		const result = listHelper.mostLikes(noLikes)
		expect(result.likes).toBe(0)
		expect(['Michael Chan', 'Edsger W. Dijkstra']).toContain(result.author)
	})

	test('when only one blog is given, author and amount 1 is returned', () => {
		const result = listHelper.mostLikes(listWithOneBlog)
		expect(result.likes).toBe(5)
		expect(result.author).toEqual('Edsger W. Dijkstra')
	})
})
