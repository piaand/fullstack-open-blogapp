const Logger = require('./logger')


const errorHandler = (error, request, response, next) => {
	Logger.error(error.name)
	Logger.error(error.message)

	if(error.name === 'CastError') {
		return response.status(404).send({ error: 'malformatted id' })
	} else if(error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	} else if(error.name === 'PermissionError') {
		return response.status(401).send({ error: error.message })
	} else if(error.name === 'JsonWebTokenError'){
		return response.status(401).send({ error: 'invalid token' })
	}

	next(error)
}

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}

	next()
}

module.exports = {
	errorHandler,
	tokenExtractor
}