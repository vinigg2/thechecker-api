Node.js API Starter
=======================

A boilerplate for Node.js API starter using Express, MongoDB and Passport

You can easily start a project, just pick a web framework and plug it on this API. 

**Note:** This project was created from [Hackaton Starter](https://github.com/sahat/hackathon-starter)

Table of Contents
-----------------

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Obtaining API Keys](#obtaining-api-keys)
- [Project Structure](#project-structure)
- [List of Packages](#list-of-packages)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

Features
--------

- **Local Authentication** using Email and Password
- **OAuth 2.0 Authentication** via Facebook, Google
- Forgot Password with email via [Nodemailer](https://github.com/nodemailer/nodemailer)
- Reset Password

Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads) or a distant MongoDB ([mLab](https://mlab.com/) or [Compose](https://www.compose.io/))
- [Node.js 8.0+](http://nodejs.org)
- Command Line Tools
- Text Editor (ex: [Visual Studio Code](https://code.visualstudio.com) or [Atom](https://atom.io/))

Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/vinigg2/thechecker-api myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon). 
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.


Obtaining API Keys
------------------

To use any of the included APIs or OAuth authentication methods, you will need
to obtain appropriate credentials: Client ID, Client Secret, API Key, or
Username & Password. You will need to go through each provider to generate new
credentials.

I have included dummy keys and passwords for all API examples to get you up and running even faster. But don't forget to update them with *your credentials* when you are ready to deploy an app.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1000px-Google_2015_logo.svg.png" width="200">

- Visit <a href="https://cloud.google.com/console/project" target="_blank">Google Cloud Console</a>
- Click on the **Create Project** button
- Enter *Project Name*, then click on **Create** button
- Then click on **APIs & Services** in the sidebar
- Click on **Enabled APIs and services** button
- Now search **Google+ API**, click on it and then click on **Enable** button
- Go back to home by clicking on **Google Cloud Platform logo**
- Next, under *APIs & Services* in the sidebar click on **Credentials** tab
- Before creating credentials, go to tabs **OAuth Consent Screen*, fill *Application name* and click on **Save** button at the bottom
- Then, click on **Create credentials > OAuth client ID**
- Select *Web Application*
- Now, fill out the required fields:
    - **Name**: The name you want
    - **Authorized Javascript origins**: http://localhost:8080
    - **Authorized redirect URI**: http://localhost:8080/auth/google/callback
- Click on **Create** button
- Copy and paste *Client ID* and *Client secret* keys into `.env`

<hr>

<img src="http://www.doit.ba/img/facebook.jpg" width="200">

**Warning:** Facebook api need https to work *(for Facebook Login OAuth Redirect URIs)*.

You're going to use **Ngrok** ! Install it from [here](https://ngrok.com/) or with `npm install ngrok -g`
You must start ngrok after starting the project.

```bash
# start ngrok to intercept the data exchanged on port 8080
ngrok http 8080
```

Next, you must update **FRONTEND_URL** in .env file using the https url defined by ngrok, for example `https://71fbdd1a.ngrok.io`.

If you already have configured Google with `http://localhost:8080`, Google login won't work until you replace the **FRONTEND_URL** in .env to localhost.

- Visit <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a>
- Click **My Apps**, then select *Add a New App* from the dropdown menu
- Enter a new name for your app
- Click on the **Create App ID** button
- Find the Facebook Login Product and click on **Set up**
- Instead of going through their Quickstart, go to your App Settings. Click on **Settings > Basic** in the left nav
- Copy and paste *App ID* and *App Secret* keys into `.env`
- **Note:** *App ID* is **FACEBOOK_ID**, *App Secret* is **FACEBOOK_SECRET** in `.env`
- Enter `localhost` under *App Domains*
- Choose a **Category** that best describes your app
- Click on **+ Add Platform** and select **Website**
- Enter `http://localhost:8080` under *Site URL*
- Click on **Facebook Login** tab in the left nav and choose *Settings*
- Enter `https://xxxxx.ngrok.io/auth/facebook/callback` under Valid OAuth redirect URIs *(you need to create this route on your frontend application)*

<hr>

<img src="https://sendgrid.com/brand/sg-logo-300.png" width="200">

- Go to <a href="https://sendgrid.com/user/signup" target="_blank">https://sendgrid.com/user/signup</a>
- Sign up and **confirm** your account via the *activation email*
- Then enter your SendGrid *Username* and *Password* into `.env` file

<hr>

<img src="https://raw.github.com/mailgun/media/master/Mailgun_Primary.png" width="200">

- Go to <a href="http://www.mailgun.com" target="_blank">http://www.mailgun.com</a>
- Sign up and add your *Domain Name*
- From the domain overview, copy and paste the default SMTP *Login* and *Password* into `.env` file

Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **config**/passport.js             | Passport Local and OAuth strategies, plus login middleware.  |
| **models**/user.model.js           | Mongoose schema and model for User.                          |
| **controllers**/auth.controller.js | Controller for authentication.                               |
| **controllers**/users.controller.js| Controller for users.                                        |
| **routes**/index.js                | Routes management with main routes.                          |
| **routes**/auth.routes.js          | Routes for /auth.                                            |
| **routes**/users.routes.js         | Routes for /users.                                           |
| .env.example                       | Your API keys, tokens, passwords and database URI.           |
| .gitignore                         | Folder and files ignored by git.                             |
| app.js                             | The main application file.                                   |
| package.json                       | NPM dependencies.                                            |

List of Packages
----------------

| Package                         | Description                                                             |
| ------------------------------- | ------------------------------------------------------------------------|
| bcrypt                          | Library for hashing and salting user passwords.                         |
| body-parser                     | Node.js body parsing middleware.                                        |
| chalk                           | Terminal string styling done right.                                     |
| connect-mongo                   | MongoDB session store for Express.                                      |
| cors                            | CORS Management.                                                        |
| dotenv                          | Loads environment variables from .env file.                             |
| express                         | Node.js web framework.                                                  |
| express-session                 | Simple session middleware for Express.                                  |
| express-validator               | Easy form validation for Express.                                       |
| mongoose                        | MongoDB ODM.                                                            |
| nodemailer                      | Node.js library for sending emails.                                     |
| passport                        | Simple and elegant authentication library for node.js.                  |
| passport-facebook               | Sign-in with Facebook plugin.                                           |
| passport-google-oauth           | Sign-in with Google plugin.                                             |
| passport-local                  | Sign-in with Username and Password plugin.                              |

FAQ
---

### I am getting MongoDB Connection Error, how do I fix it?
That's a custom error message defined in `app.js` to indicate that there was a
problem connecting to MongoDB:

```js
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
```
You need to have a MongoDB server running before launching `app.js`. You can
download MongoDB [here](http://mongodb.org/downloads), or install it via a package manager.
<img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">
Windows users, read [Install MongoDB on Windows](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/).

**Tip:** If you are always connected to the internet, you could just use
[mLab](https://mlab.com/) or [Compose](https://www.compose.io/) instead
of downloading and installing MongoDB locally. You will only need to update database credentials
in `.env` file.

### I get an error when I deploy my app, why?
Chances are you haven't changed the *Database URI* in `.env`. If `MONGODB` is
set to `localhost`, it will only work on your machine as long as MongoDB is
running. When you deploy to Heroku, OpenShift or some other provider, you will not have MongoDB
running on `localhost`. You need to create an account with [mLab](https://mongolab.com/)
or [Compose](https://www.compose.io/), then create a free tier database.


### How do I switch SendGrid for another email delivery service, like Mailgun or SparkPost?
Inside the `nodemailer.createTransport` method arguments, simply change the service from `'Sendgrid'` to some other email service. Also, be sure to update both username and password below that. See the [list of all supported services](https://github.com/nodemailer/nodemailer-wellknown#supported-services) by Nodemailer.

Set up online database *(not required)*
----------


<img src="https://mlab.com/company/img/branding/mLab-logo-onlight.svg" width="200">

- Open [mlab.com](https://mlab.com) website
- Click the yellow **Sign up** button
- Fill in your user information then hit **Create account**
- From the dashboard, click on **:zap:Create new** button
- Select **any** cloud provider (I usually go with AWS)
- Under *Plan* click on **Single-node (development)** tab and select **Sandbox** (it's free)
 - *Leave MongoDB version as is - `2.4.x`*
- Enter *Database name** for your web app
- Then click on **:zap:Create new MongoDB deployment** button
- Now, to access your database you need to create a DB user
- Click to the recently created database
- You should see the following message:
 - *A database user is required to connect to this database.* **Click here** *to create a new one.*
- Click the link and fill in **DB Username** and **DB Password** fields
- Finally, in `.env` instead of `mongodb://localhost:27017/test`, use the following URI with your credentials:
 - `db: 'mongodb://USERNAME:PASSWORD@ds027479.mongolab.com:27479/DATABASE_NAME'`

**Note:** As an alternative to mLab, there is also [Compose](https://www.compose.io/).

Contributing
------------

If something is unclear, confusing, or needs to be refactored, please let me know.
Pull requests are always welcome !

License
-------

The MIT License (MIT)

Copyright (c) 2018 Flavio Paroli

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
