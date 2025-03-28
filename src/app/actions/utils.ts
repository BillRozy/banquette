export class ActionError extends Error {}

export function assertActionError(err: unknown): asserts err is ActionError {
  if (!(err instanceof ActionError)) {
    throw err;
  }
}

export type Action = (...args: any) => ActionResponse; // eslint-disable-line @typescript-eslint/no-explicit-any

export type ActionResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

export function checkResponseIsSuccess<T = undefined>(
  resp: any // eslint-disable-line @typescript-eslint/no-explicit-any
): resp is ActionResponse<T> {
  return resp.success;
}

export function checkResponseIsError(
  resp: any // eslint-disable-line @typescript-eslint/no-explicit-any
): resp is ActionResponse<ActionError> {
  return !resp.success;
}

export function createSuccessResponse<T = undefined>(
  message: string,
  data?: T
): ActionResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function createFailureResponse(
  message: string,
  error?: Error
): ActionResponse<ActionError> {
  return {
    success: false,
    message,
    data: new ActionError(error?.message, {
      cause: error,
    }),
  };
}
