Valify Front End Task

## Description

This application was created to provide a seamless digital onboarding experience. The potential
customers of a bank will be directed towards this website in order to upload all the required
information and be able to open an account without having to visit a branch. This website can be
accessed from mobile phones and laptops.

This project constits of both the frontend and a simple backend server to call the valify APIS.

Backend server github link @ https://github.com/ReemEmad/Valify-Server

## How to install and run

You can simply build a docker image for both frontend and backend
`docker build -t react-app .`

then run docker
`docker run -p 3000:3000 react-app`

## Features

Main features include
1- User sign in with their credentials
2- Verification of user's National ID card according to a couple of standards such as strong lighting and no shadows or glares in the document
3- Comparison between user's selfie image and the face on the national ID, if they match you're done! 🎉
