							Image Upload API


This repository contains code for an image upload API built using Node.js, Express.js, and MongoDB. It allows users to upload images to the server and retrieve them later.

Features:
	mage Upload: Users can upload images to the server.
	Image Retrieval: Users can retrieve uploaded images from the server.




Installation:

Install dependencies:

	cd server
	npm install


Set up MongoDB:

	Install MongoDB on your machine if you haven't already.
	Create a database named Img in MongoDB.

Run the server:
	npm start
	Access the API at http://localhost:3000.

Usage:
	Upload Image: Send a POST request to /api/upload with the image file as a form-data field named image.
	Retrieve Images: Send a GET request to /api/images to retrieve a list of uploaded images.

Contributors:
      Paramasivam M

License:
	This project is licensed under the MIT License - see the LICENSE file for details.
