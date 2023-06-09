import { z } from "zod";
import db from "@src/config/db";
import { Request } from "express";
import { AuthRequest, Validate } from "..";

const validate: Validate = (request: Request) => {
  const schema = z
    .object({
      firstName: z.string().min(3).max(60).optional(),
      lastName: z.string().min(3).max(60).optional(),
      phone: z
        .string()
        .regex(/^\+[1-9]\d{1,14}$/)
        .refine(
          async (phone) => !(await db.user.findUnique({ where: { phone } })),
          { message: "Phone number already exists" }
        )
        .optional(),
      address: z.string().min(3).max(255).optional(),
    })
    .refine(
      (data) => {
        return Object.keys(data).length;
      },
      { message: "At least one field is required" }
    );

  return schema.safeParseAsync(request.body);
};

export interface UpdateProfileRequest extends AuthRequest {
  body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  };
}

export const updateProfileRequest = {
  validate,
};
