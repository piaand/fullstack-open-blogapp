import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, prettyDOM } from '@testing-library/react'
import { BlogItem } from './Blogview'

const blog = {
	author: 'Anna Author',
	url: 'www.example.com',
	title: 'Testing the blog items',
	likes: 7,
	user: {
		name: 'Tero Testaaja',
		username: 'teTe'
	}
}

describe('<BlogItem /> component', () => {
	let component
	const likeBlog = jest.fn()
	const deleteBlog = () => {
		console.log('deleted')
	}

	beforeEach(() => {
		component = render(
			<BlogItem blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
		)
	})

	test('renders content', () => {
		expect(component.container).toHaveTextContent('Testing the blog items')
	})

	test('shows title and author by default', () => {
		const div = component.container.querySelector('.extendedBlogInfo')
		prettyDOM(div)

		expect(component.container).toHaveTextContent('Testing the blog items')
		expect(div).toHaveTextContent('Anna Author')
	})

	test('when like button is pressed twice, handlefunction is called twice', () => {
		const likeButton = component.getByText('like')
		fireEvent.click(likeButton)
		fireEvent.click(likeButton)

		expect(likeBlog.mock.calls).toHaveLength(2)
	})
})
