import { ROLES } from "@src/constants";
import { Request } from "express";
import z from "zod";
import db from "@src/config/db";
import { AuthRequest, Validate } from "..";

const validate: Validate = (request: Request) => {
  const schema = z.object({
    xId: z
      .string()
      .regex(/^\d+$/gi)
      .pipe(
        z
          .string()
          .transform((v) => Number(v))
          .refine(async (id) => await db.order.findUnique({ where: { id } }), {
            message: "Order not found",
          })
      ),
  });

  return schema.safeParseAsync({
    xId: request.params.id,
  });
};

const authorize = (request: AuthRequest) => {
  const { user } = request.auth!;

  return user.roleId === ROLES.ADMIN;
};

export interface DeleteOrderRequest {
  body: {
    xId: number;
  };
}

export const deleteOrderRequest = {
  validate,
  authorize,
};
