const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { ValidationError, PermissionError } = require('./error')


const createPasswordHash = async (password) => {
	if (password.length >= 3) {
		const salt = 10
		const passwordHash = await bcrypt.hash(password, salt)
		return passwordHash
	} else {
		return Promise.reject(new ValidationError('password is shorter than 3 characters.'))
	}
}

const identifyUserFromToken = async (token) => {
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if(!token || !decodedToken || !decodedToken.id) {
		return Promise.reject(new PermissionError('token missing or invalid'))
	}
	return await User.findById(decodedToken.id)
}

module.exports = {
	createPasswordHash,
	identifyUserFromToken
}