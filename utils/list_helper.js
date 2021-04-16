const _ = require('lodash')

const dummy = (blogs) => {
	console.log(`Here are the blogs: ${blogs}`)
	return 1
}

const likeSum = (total, num) => total + num

const findMax = (num1, num2) => Math.max(num1, num2)

const groupByAuthor = (blogs) => _.groupBy(blogs, function(blog){ return blog.author })

const findMaxValueInObject = (object) => Object.values(object).reduce(findMax, -1)

const totalLikes = (blogs) => {
	const sum = blogs
		.map(blog => blog.likes)
		.reduce(likeSum, 0)
	return sum
}

const favoriteBlog = (blogs) => {
	const max = blogs
		.map(blog => blog.likes)
		.reduce(findMax, -1)

	if(max === -1) {
		return {}
	} else {
		return blogs.filter(blog => blog.likes === max)[0]
	}
}

const mostBlogs = (blogs) => {
	const groupedBlogs = groupByAuthor(blogs)
	const authors =  _.mapValues(groupedBlogs, function(o) { return o.length })
	const maxAmountOfBlogs = findMaxValueInObject(authors)

	if (maxAmountOfBlogs === -1) {
		return {}
	} else {
		const author =  Object.keys(authors).find(key => authors[key] === maxAmountOfBlogs)
		const result = { author: author, blogs: maxAmountOfBlogs }
		return result
	}
}

const mostLikes = (blogs) => {
	const groupedBlogs = groupByAuthor(blogs)
	const authors =  _.mapValues(groupedBlogs, function(o) {
		var amountLikes = 0
		_.forEach(o, function(blog) {
			amountLikes += blog.likes
		})
		return amountLikes
	})
	const maxAmountOfLikes = findMaxValueInObject(authors)
	if (maxAmountOfLikes === -1) {
		return {}
	} else {
		const author =  Object.keys(authors).find(key => authors[key] === maxAmountOfLikes)
		const result = { author: author, likes: maxAmountOfLikes }
		return result
	}
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}