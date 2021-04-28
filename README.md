# Fullstack open - Blog app

This is a blog listing application that has been created for the [Fullstack Open course](https://fullstackopen.com/en/). Live version of the application can be found [here](https://gentle-hamlet-05272.herokuapp.com/). Please be patient as it takes time for Heroku to serve the application.

If you want, you can log in to the service with "Mikko Mallikas" test user account, use the following credentials:

username: **mallikasmikko**
password: **salasana1**

[Screenshot on the service](images/Bloglist-logged-user.png)

## Tech stack
- App is running in Heroku and the deployment pipeline is built with Github Actions.
- Frontend is build with React, state handling happens with Redux and some visual tweaking with Material-UI. 
- Backend is a simple Node + Express with MongoDB database
- Testing is done with Jest and Cypress

## Course learnings
Fullstack open course focuses on modern web development with Javascript. This app is a result of learnings from multiple sub-sections (mainly sections one to seven) but the main aim was to automate the deployment pipeline with Github actions as request in [section 11 about CI/CD](https://fullstackopen.com/en/part11). See `.github/workflows/pipeline.yml` for the full solution.



