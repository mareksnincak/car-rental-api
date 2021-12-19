export type TExceptionData = {
  code: number;
  type: string;
  message: string;
  detail?: Record<string, unknown>;
};
