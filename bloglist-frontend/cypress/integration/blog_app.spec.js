describe('Blog ', function() {
	const user = {
		name: 'Tero Testaaja',
		username: 'teTe',
		password: 'password'
	}

	const blog = {
		author: 'Anna Author',
		title: 'Testing with Cypress',
		url: 'www.example.com'
	}

	const blog2 = {
		author: 'Willehard Writer',
		title: 'Aprillia',
		url: 'www.example.com',
		likes: 5
	}

	const blog3 = {
		author: 'Patricia Poet',
		title: 'Poems of the fools winter',
		url: 'www.example.com',
		likes: 3
	}

	beforeEach(function() {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		cy.request('POST', 'http://localhost:3003/api/users', user)
		cy.visit('http://localhost:3000')
	})

	it('front page can be opened', function() {
		cy.contains('Login to view your blogs!')
		cy.contains('Bloglists - list your fav blogs')
	})

	describe('Login', function() {
		it('succees with correct credentials', function() {
			cy.get('input[name=username]').type(user.username)
			cy.get('input[name=password]').type(user.password)
			cy.get('#loginButton').click()

			cy.contains('Logged in as Tero Testaaja')
		})

		it('fails with incorrect credentials', function() {
			cy.get('input[name=username]').type(user.username)
			cy.get('input[name=password]').type('notThePassword')
			cy.get('#loginButton').click()

			cy.get('.notification').contains('Wrong username or password')
		})
	})

	describe('When logged in', function() {
		beforeEach(function() {
			cy.login({ username: user.username, password: user.password })
		})
		it('A blog can be created and liked', function() {
			cy.get('header').contains('blogs').click()
			cy.contains('new blog').click()
			cy.get('input[name=title]').type(blog.title)
			cy.get('input[name=author]').type(blog.author)
			cy.get('input[name=url]').type(blog.url)
			cy.get('#addBlogButton').click()

			cy.get('.notification').contains('Blog titled \'Testing with Cypress\' is now added to the list')
			cy.get('button').contains('See full view').click()
			cy.get('.extendedBlogInfo').contains('like').click()
			cy.get('#likeAmount').contains('1')
		})
		it('Creator of blog can remove a blog', function() {
			cy.createBlog({ title: blog.title, author: blog.author, url: blog.url })
			cy.get('header').contains('blogs').click()
			cy.contains('full view').click()
			cy.get('.extendedBlogInfo').contains('remove').click()
			cy.on('window:confirm', () => true)
			cy.contains('view').should('not.exist')
		})
		it('Added blogs are placed in descending order by their amount of likes', function() {
			cy.createBlog({ title: blog3.title, author: blog3.author, url: blog3.url, likes: blog3.likes })
			cy.createBlog({ title: blog2.title, author: blog2.author, url: blog2.url, likes: blog2.likes })
			cy.createBlog({ title: blog.title, author: blog.author, url: blog.url })

			cy.get('header').contains('blogs').click()
			cy.get('.blogLink').should('have.length', 3)
			cy
				.get('.blogLink')
				.then(elements => {
					expect(elements).to.have.length(3)
					const links = elements
						.toArray()
						.map(element => element.innerText.trim())

					expect(links).to.deep.equal(
						['by Willehard Writer',
							'by Patricia Poet',
							'by Anna Author'])
				})
		})
	})
})