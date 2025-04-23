const ErrorDictionaryValidation = {
  USR_000: 'The field @data is incorrect',
  USR_001: 'The field @data is empty or not provided in the request',
  USR_002: 'The field @data is not valid',
  USR_003: '@data is to long',
  USR_004: '@data is to short',
}

const ErrorAuthDictionary  = {
  AUTH_000: 'The user with the document number @data already exists',
  AUTH_001: 'An error ocurred while creating token: ',
  AUTH_002: 'The document number or password is incorrect',
  AUTH_003: 'An error ocurred while logout',
  AUTH_004: 'An internal error ocurred: ',
  AUTH_005: 'An error ocurred while creating the session token on database',
}

export const ErrorDictionaries = {
  validation: ErrorDictionaryValidation,
  auth: ErrorAuthDictionary,
}

const ErrorCodeMapValidation = {
  incorrect: {
    code: 'USR_000',
    type: 'validation',
  },
  empty: {
    code: 'USR_001',
    type: 'validation',
  },
  invalid:{
    code: 'USR_002',
    type: 'validation',
  },
  tooLong:{
    code: 'USR_003',
    type: 'validation',
  },
  tooShort:{
    code: 'USR_004',
    type: 'validation',
  },
}

const ErrorCodeMapAuth = {
  duplicated: {
    code: 'AUTH_000',
    type: 'auth',
  },
  tokenError:{
    code: 'AUTH_001',
    type: 'auth',
  },
  invalid:{
    code: 'AUTH_002',
    type: 'auth',
  },
  logoutError:{
    code: 'AUTH_003',
    type: 'auth',
  },
  internalError:{
    code: 'AUTH_004',
    type: 'auth',
  },
  sessionError:{
    code: 'AUTH_005',
    type: 'auth',
  }
}

export const ErrorCodeMap = {
  validation: ErrorCodeMapValidation,
  auth: ErrorCodeMapAuth,
}

export const successMessages = {
  login: 'Welcome back! You are logged in successfully @name',
  createdUser: 'Account created successfully! welcome aboard @name',
  logout: 'Goodbye @name! You are logged out successfully',
}
