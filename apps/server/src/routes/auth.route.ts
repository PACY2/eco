import { authController } from "@src/controllers";
import { authRefresh, authAccess, validator } from "@src/middlewares";
import {
  updateProfileRequest,
  signInRequest,
  signUpRequest,
} from "@src/requests";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/sign-in", [validator(signInRequest)], authController.signIn);

authRouter.post("/sign-up", [validator(signUpRequest)], authController.signUp);

authRouter.post("/auth/:token", authController.auth);

authRouter.post("/sign-out", [authRefresh], authController.signOut);

authRouter.post("/refresh", [authRefresh], authController.refresh);

authRouter.get("/me", [authAccess], authController.profile);

authRouter.patch(
  "/me",
  [authAccess, validator(updateProfileRequest)],
  authController.updateProfile
);

authRouter.delete("/me", [authAccess], authController.deleteProfile);
