import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { CreateBlogForm } from './BlogForm'

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

describe('<CreateBlogForm /> component', () => {

	test('Right information is passed to the handler when newBlog is created', () => {
		const addNewBlog = jest.fn()
		const component = render(<CreateBlogForm addNewBlog={addNewBlog}/>)

		const title = component.container.querySelector('input[name=title]')
		const author = component.container.querySelector('input[name=author]')
		const url = component.container.querySelector('input[name=url]')
		const form = component.container.querySelector('form')
		console.log(prettyDOM(title))

		fireEvent.change(title, {
			target: { value: blog.title }
		})
		fireEvent.change(author, {
			target: { value: blog.author }
		})
		fireEvent.change(url, {
			target: { value: blog.url }
		})
		fireEvent.submit(form)

		const mockBlog = addNewBlog.mock.calls[0][0]
		expect(addNewBlog.mock.calls).toHaveLength(1)
		console.log(mockBlog)
		expect(mockBlog.title).toBe(blog.title)
		expect(mockBlog.author).toBe(blog.author)
		expect(mockBlog.url).toBe(blog.url)
	})
})