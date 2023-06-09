import { ROLES } from "@src/constants";
import { z } from "zod";
import db from "@src/config/db";
import { AuthRequest, Authorize, Validate } from "..";

const authorize: Authorize = (request: AuthRequest) => {
  const { user } = request.auth!;

  return user.roleId === ROLES.ADMIN;
};

const validate: Validate = (request: AuthRequest) => {
  const schema = z.object({
    xId: z
      .string()
      .regex(/^\d+$/gi)
      .pipe(
        z
          .string()
          .transform((v) => Number(v))
          .refine(
            async (id) => {
              return await db.unit.findUnique({
                where: {
                  id,
                },
              });
            },
            { message: "Unit not found" }
          )
      ),
  });

  return schema.safeParseAsync({
    xId: request.params.id,
  });
};

export interface DeleteUnitRequest extends AuthRequest {
  body: {
    xId: number;
  };
}

export const deleteUnitRequest = {
  validate,
  authorize,
};
