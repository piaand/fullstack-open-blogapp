import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = async () => {
	const response = await axios.get(baseUrl)
	console.log('Getting all blogs: ', response.data)
	return response.data
}

const create = async ( newBlog ) => {
	const config = {
		headers : { Authorization: token }
	}

	const response = await axios.post(baseUrl, newBlog, config)
	return response.data
}

const getBlog = async ( id ) => {
	const blogUrl = baseUrl + '/' + id
	const response = await axios.get(blogUrl)
	console.log('Getting a blog: ', response.data)
	return response.data
}

const update = async ( id, newBlog ) => {
	const updateUrl = baseUrl + '/' + id
	const response = await axios.put(updateUrl, newBlog)
	return response.data
}

const addComment = async (id, content) => {
	const url = baseUrl + '/' + id + '/comments'
	const response = await axios.post(url, content)
	return response.data
}

const removeBlog = async ( id ) => {
	const config = {
		headers : { Authorization: token }
	}

	const blogUrl = baseUrl + '/' + id
	const response = await axios.delete(blogUrl, config)
	return response.data
}

export default {
	getAll,
	setToken,
	create,
	getBlog,
	update,
	removeBlog,
	addComment
}