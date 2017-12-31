# POLR

!["logo"](https://github.com/typeF/POLR/blob/master/public/POLR-logo.png)


POLR is a simple polling app with email and SMS functionality.

User is able to create a new poll and send to friends via direct link or sms. They then can use the instant run off algorithm to narrow down the choices.

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.

## Screenshots

!["home"](https://github.com/typeF/POLR/blob/master/docs/homepage.png)
!["vote"](https://github.com/typeF/POLR/blob/master/docs/voting.png)
!["admin"](https://github.com/typeF/POLR/blob/master/docs/admin.png)
!["results"](https://github.com/typeF/POLR/blob/master/docs/results.png)


## Dependencies

- Express
- Node 5.10.x or above
- Body-parser: 1.15.2,
- Clipboard: 1.7.1
- Dateformat: 3.0.2
- Dotenv: 2.0.0
- Ejs: 2.4.1
- Knex: 0.11.7
- Knex-logger: 0.1.0
- Mailgun-js: 0.14.0
- Node-sass-middleware: 0.9.8
- Pg: 6.0.2
- Twilio: 3.11.0
