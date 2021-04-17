`use strict`;

module.exports = class RequestBuilder {
  static createRegisterRequest (username, password) {
    return {
      url: '/v1/security/register',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {username, password}
    };
  }

  static createAuthenticateRequest (username, password) {
    return {
      url: '/v1/security/authenticate',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {username, password}
    };
  }

  static createValidRetrieveAdminDashboardRequest (token) {
    return {
      url: '/v1/admin/dashboard',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token,
      }
    }
  }

  static createInvalidRetrieveAdminDashboardWithMissingAuthorizationHeader () {
    return {
      url: '/v1/admin/dashboard',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }

  static createInvalidRetrieveAdminDashboardWithInvalidAuthorizationHeader () {
    return {
      url: '/v1/admin/dashboard',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'invalid-header-value',
      }
    }
  }

  static createInvalidRetrieveAdminDashboardWithInvalidAuthorizationType () {
    return {
      url: '/v1/admin/dashboard',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'invalid-authorization-type access-token' ,
      }
    }
  }

  static createEnableTfaRequest(token) {
    return {
      url: '/v1/security/enable-tfa',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token,
      }
    }
  }

  static createInvalidEnableTfaRequestWithMissingAuthorizationHeader() {
    return {
      url: '/v1/security/enable-tfa',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  }

  static createInvalidTfaVerificationRequestWithMissingAuthorizationHeader() {
    return {
      url: '/v1/security/verify-tfa-code',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        code: '123456'
      }
    }
  }

  static createInvalidTfaVerificationRequestWithMissingVerificationCode(token) {
    return {
      url: '/v1/security/verify-tfa-code',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token,
      }
    }
  }

  static createVerificationRequest(token, code) {
    return {
      url: '/v1/security/verify-tfa-code',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token,
      },
      body: {
        code: code,
      }
    }
  }
};