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
  AUTH_004: 'An internal error ocurred: @data',
  AUTH_005: 'An error ocurred while creating the session token on database',
  AUTH_006: 'The session token is invalid or expired',
  AUTH_007: 'An unexpected error ocurred while validating token',
  AUTH_008: 'An error ocurred while creating account on database',
}

const DefaultHttpError = {
  DEF_000: 'An unexpected Http error ocurred: @data',
  DEF_001: 'An unknown error ocurred: @data',
}

const StudentErrorDictionary = {
  STU_000: 'An error ocurred while creating the student list, students could not be created',
}

const classroomErrorDictionary = {
  CLS_000: 'An error ocurred while creating the classroom',
  CLS_001: 'You trying import a list which is already added to the classroom',
  CLS_002: 'An error ocurred while importing the list into the classroom',
}

const activityErrorDictionary = {
  ACT_000: 'You trying evaluate an activity which classroom not exists',
  ACT_001: 'You trying get information of an student which activity not exists',
  ACT_002: 'The activity qualification is higher than the classroom qualification available',
  ACT_003: 'Some qualification is not valid or exceeded the limit, please check the values',
}

export const ErrorDictionaries = {
  validation: ErrorDictionaryValidation,
  auth: ErrorAuthDictionary,
  default: DefaultHttpError,
  student: StudentErrorDictionary,
  classroom: classroomErrorDictionary,
  activity: activityErrorDictionary,
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
  },
  invalidSession:{
    code: 'AUTH_006',
    type: 'auth',
  },
  errorValidatingToken:{
    code: 'AUTH_007',
    type: 'auth',
  },
  uncreatedAccount:{
    code: 'AUTH_008',
    type: 'auth',
  },
}

const ErrorCodeMapDefault = {
  httpException:{
    code: 'DEF_000',
    type: 'default',
  },
  unknown:{
    code: 'DEF_001',
    type: 'default',
  },
}

const ErrorCodeMapStudent = {
  studentListCantCreated:{
    code: 'STU_000',
    type: 'student',
  },
}

const ErrorCodeMapClassroom = {
  classroomCantCreated:{
    code: 'CLS_000',
    type: 'classroom',
  },
  classroomAlreadyAdded:{
    code: 'CLS_001',
    type: 'classroom',
  },
  classroomCantImported:{
    code: 'CLS_002',
    type: 'classroom',
  },
}

const ErrorCodeMapActivity = {
  activityUnavailable:{
    code: 'ACT_000',
    type: 'activity',
  },
  activityStudentNotExists:{
    code: 'ACT_001',
    type: 'activity',
  },
  activityExcededQualification:{
    code: 'ACT_002',
    type: 'activity',
  },
  activityInvalidQualification:{
    code: 'ACT_003',
    type: 'activity',
  },
}

export const ErrorCodeMap = {
  validation: ErrorCodeMapValidation,
  auth: ErrorCodeMapAuth,
  default: ErrorCodeMapDefault,
  student: ErrorCodeMapStudent,
  classroom: ErrorCodeMapClassroom,
  activity: ErrorCodeMapActivity,
}

export const successMessages = {
  login: 'Welcome back! You are logged in successfully @name',
  createdUser: 'Account created successfully! welcome aboard @name',
  logout: 'Goodbye @name! You are logged out successfully',
  created: 'The @data resource was created successfully',
  finded: 'The @data resource was found successfully',
  empty: 'The @data resource was empty please register a new one',
  updated: 'The @data resource was updated successfully',
}

export const sessionTypes = {
  createAccount: 1,
  login: 2,
  logout: 3,
}
