# Two Factor Authentication Protected API Demo

## Introcution
It has been created to demonstrate an API that secured with Two Factor Authentication.

## Requirements
* NodeJS

## How To Run The Application 
Install the application dependencies including dev dependencies.

```shell
$ npm install
```

In order to start the application run the following command

```shell 
$ npm start
```

## API Endpoints
Please check `swagger.yaml` file.

## How To Run Tests
```shell 
$ npm run test
```

## Workflow
* Register - authentication with username and password - happy flow
    * Create a new user by using the register endpoint (POST /v1/security/register)
    * Authenticate the user and keep the access token from the authentication response (POST /v1/security/authenticate)
    * Try to access the secured dummy endpoint with authorization header (POST /v1/admin/dashboard)
* Authenticate - enable 2FA - happy flow    
    * Authenticate the user and keep the access token from the authentication response (POST /v1/security/authenticate)
    * Enable 2FA and keep the user secret from the api response (POST /v1/security/enable-tfa)
    * Store the user secret in an authenticator application (Example: Google Authenticator)
* Authenticate - Verify 2FA code - happy flow    
    * Authenticate the user and keep the short life access token from the authentication response (POST /v1/security/authenticate)
    *  Check the authenticator application in your phone and keep the verification code
    * Verify the code and keep the long life access token from the api response (POST /v1/security/verify-tfa-code)
    

## TODOs:
* ~~Incoming requrest validation~~
* ~~Registration~~
* ~~Authentication~~
* ~~Create a dummy endpoint to be secured by access control~~
* ~~Token based authentication~~
* ~~Secure the dummy endpoint and allow access to authentication/register endpoints~~
* ~~Store the user password with encryption~~
* ~~Open API document~~
* ~~Create integration tests regarding the current authentication/register flows~~
* README file (In progress)
* ~~Enable a user's two factor authentication (Return the the key for the first phase)~~
* ~~Verify an authentication code provided by an authentication application such as Google Authenticator~~
* ~~Create new test cases regarding enabling 2FA and code verification (Find a way to simulate authenticator app)~~ 
* Generate QR code to be used by the authenticator applications
* Update the 2FA enabler endpoint as it's gonna return the qr code image url instead of key
* Update the integration tests
* ~~Integrate code analysis tool (jslint...)~~
* ~~Create CI pipeline~~ 

