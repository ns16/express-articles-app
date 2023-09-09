# Example of RESTful API with Express and Bookshelf.js

## Requirements

- Node.js >=14.13.0
- NPM >=6.14.8
- MySQL


## Deployment

1. Clone the application from the repository.

2. Install dependencies:

        npm ci

3. Create the config.js and knexfile.js files by copying the config.js.example and knexfile.js.example files, respectively:

        cp config.js.example config.js
        cp knexfile.js.example knexfile.js

4. Specify the port and JWT key in the config.js file, and also specify database connection settings for development, production, and test modes in the knexfile.js file.

5. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `exress-articles-app` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

6. Run migrations and seeds:

    	npm run migrate
    	npm run db:seed

The next steps will be different for development and production modes.

### Development mode

1. Install nodemon globally:

	    sudo npm i -g nodemon

2. Launch the application:

	    npm run start:dev

### Production mode

1. Install pm2 globally:

	    sudo npm i -g pm2

2. Launch the application:

	    npm run start:prod


## Testing

1. Create database:

		sudo mysql -uuser -ppass
		> CREATE DATABASE `exress-articles-app_test` CHARACTER SET utf8 COLLATE utf8_general_ci;
		> exit

	Replace user and pass with your username and password, respectively.

2. Run tests:

	    npm run test:e2e
