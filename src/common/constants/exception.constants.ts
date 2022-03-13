export const EXCEPTIONS = {
  default: {
    code: 1,
    type: 'unknown',
  },
  unauthorized: {
    code: 10,
    type: 'unauthorized',
  },
  validation: {
    code: 1000,
    type: 'validation',
  },
  notFound: {
    code: 2000,
    type: 'not_found',
  },
  conflict: {
    code: 2001,
    type: 'conflict',
  },
} as const;
