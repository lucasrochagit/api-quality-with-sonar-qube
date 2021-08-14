export class ErrorUtil {
  public static getServiceExceptionMessage(operation: string): string {
    return `Due to an internal error, the operation '${operation}' could not be performed at this time. Please try again later.`;
  }
}
