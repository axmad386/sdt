import { Response } from "@lunoxjs/core/facades";

const ApiResponse = {
  success(data: any, message = "Success", status = 200) {
    return Response.make(
      {
        success: true,
        message,
        data,
        errors: {},
      },
      status,
    );
  },
  error(
    message: string,
    status = 400,
    errors: Record<string, any> = {},
    stack: any = undefined,
  ) {
    return Response.make(
      {
        success: false,
        message,
        stack,
        data: [],
        errors,
      },
      status,
    );
  },
};
export default ApiResponse;
