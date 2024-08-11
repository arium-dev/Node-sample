const express = require("express");
const mongoose = require("mongoose");
const {
  HttpStatusCode,
  UserMessages,
  GenericConstants,
  MongoConstants,
} = require("../../../constants");
const {
  checkValidation,
  registerValidator,
  loginValidator,
  emailValidation,
  confirmUserValidator,
  resetValidator,
  verifyTwoFaValidator,
  verifyTwoFaAndLoginKeyValidator,
} = require("../../../validators");
const { handle } = require("../../../utils/asyncHandler");
const { register } = require("../../../useCases/auth/register");
const { UserRepository } = require("../../../repositories/UserRepository");
const {
  ActivityRepository,
} = require("../../../repositories/ActivityRepository");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  UserPreferenceRepository,
} = require("../../../repositories/UserPreferenceRepository");
const {
  BalanceRepository,
} = require("../../../repositories/BalanceRepository");
const {
  UserLogRepository,
} = require("../../../repositories/UserLogRepository");
const { QueueService } = require("../../../services/QueueService");
const {
  GoogleRecaptchaService,
} = require("../../../services/GoogleRecaptchaService");
const { GeolocationService } = require("../../../services/GeolocationService");
const { login } = require("../../../useCases/auth/login");
const { emailStatus } = require("../../../useCases/auth/emailStatus");
const {
  generateRefreshToken,
} = require("../../../useCases/auth/generateRefreshToken");
const { verifyEmailToken } = require("../../../useCases/auth/verifyEmailToken");
const { confirmation } = require("../../../useCases/auth/confirmation");
const { forgetPassword } = require("../../../useCases/auth/forgetPassword");
const { resetPassword } = require("../../../useCases/auth/resetPassword");
const { generateTwoFa } = require("../../../useCases/auth/generateTwoFa");
const { enableTwoFa } = require("../../../useCases/auth/enableTwoFa");
const { verifyTwoFa } = require("../../../useCases/auth/verifyTwoFa");
const { authLogin } = require("../../../useCases/auth/authLogin");
const { ensureRefreshToken } = require("../../../guards/ensureRefreshToken");
const {
  verifyChangeEmail,
} = require("../../../useCases/users/profile/verifyChangeEmail");
const {
  resendVerificationEmail,
} = require("../../../useCases/auth/resendVerificationEmail");

const app = express.Router();

app.get(
  "/token",
  [ensureRefreshToken],
  handle(async (req, res) => {
    const { token, refreshToken } = await generateRefreshToken(req.token, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });

    if (refreshToken) {
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: GenericConstants.STRICT,
        })
        .json({
          code: HttpStatusCode.OK,
          token,
        });
    } else {
      res.json({
        code: HttpStatusCode.OK,
        token,
      });
    }
  })
);

// user login route
app.post(
  "/",
  [loginValidator, checkValidation],
  handle(async (req, res) => {
    const { refreshToken, ...resp } = await login(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });

    if (refreshToken) {
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: GenericConstants.STRICT,
        })
        .json({
          code: HttpStatusCode.OK,
          ...resp,
        });
    } else {
      res.json({
        code: HttpStatusCode.OK,
        ...resp,
      });
    }
  })
);

app.get(
  "/logout",
  handle(async (_, res) => {
    res.clearCookie("refreshToken").json({
      code: HttpStatusCode.OK,
      message: UserMessages.USER_LOGOUT,
    });
  })
);

app.post(
  "/register",
  [registerValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });
    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await register(
        req.body,
        {
          userRepository: new UserRepository(),
          userPeferenceRepository: new UserPreferenceRepository(),
          roleRepository: new RoleRepository(),
          activityRepository: new ActivityRepository(),
          balanceRepository: new BalanceRepository(),
          googleRecaptchaService: new GoogleRecaptchaService(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/status/email",
  [emailValidation, checkValidation],
  handle(async (req, res) => {
    const resp = await emailStatus(req.body, {
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

app.get(
  "/verify-email-token/:token",
  handle(async (req, res) => {
    const resp = await verifyEmailToken(req.params.token, {
      userRepository: new UserRepository(),
    });

    res.json(resp);
  })
);

app.post(
  "/confirmation",
  [confirmUserValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await confirmation(
        req.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
        },
        session
      );
      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/forgotPassword",
  [emailValidation, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await forgetPassword(
        req.body,
        {
          userRepository: new UserRepository(),
          roleRepository: new RoleRepository(),
          activityRepository: new ActivityRepository(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

// reset password with token

app.post(
  "/resetPassword",
  [resetValidator, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await resetPassword(
        req.body,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          queueService: new QueueService(),
        },
        session
      );
      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

// generate 2fa

app.get(
  "/generateTwoFa/:id",
  handle(async (req, res) => {
    const resp = await generateTwoFa(req.params.id, {
      userRepository: new UserRepository(),
    });
    res.json(resp);
  })
);

// enable 2fa

app.post(
  "/enableTwoFa",
  [verifyTwoFaValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await enableTwoFa(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });
    res.json(resp);
  })
);

app.post(
  "/resend-verification-email",
  [emailValidation, checkValidation],
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await resendVerificationEmail(
        req.body,
        {
          userRepository: new UserRepository(),
          queueService: new QueueService(),
          activityRepository: new ActivityRepository(),
        },
        session
      );
      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);

app.post(
  "/verifyTwoFa",
  [verifyTwoFaValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await verifyTwoFa(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });
    res.json(resp);
  })
);

app.post(
  "/enableTwoFaAndLogin",
  [verifyTwoFaAndLoginKeyValidator, checkValidation],
  handle(async (req, res) => {
    const { data, message } = await enableTwoFa(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });

    if (req.body.password) {
      const { refreshToken, token } = await authLogin(
        req.body.ip || req.clientIp,
        req.body,
        {
          userRepository: new UserRepository(),
          userLogRepository: new UserLogRepository(),
          geolocationService: new GeolocationService(),
          roleRepository: new RoleRepository(),
          queueService: new QueueService(),
        }
      );

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: GenericConstants.STRICT,
        })
        .json({
          code: HttpStatusCode.OK,
          message,
          data: {
            userInfo: data,
            token,
          },
        });
    } else {
      res.json({
        message,
        code: HttpStatusCode.OK,
        data: {
          userInfo: data,
        },
      });
    }
  })
);

app.post(
  "/verifyTwoFaAndLogin",
  [verifyTwoFaAndLoginKeyValidator, checkValidation],
  handle(async (req, res) => {
    const resp = await verifyTwoFa(req.body, {
      userRepository: new UserRepository(),
      roleRepository: new RoleRepository(),
    });

    const { refreshToken, token } = await authLogin(
      req.body.ip || req.clientIp,
      req.body,
      {
        userRepository: new UserRepository(),
        userLogRepository: new UserLogRepository(),
        geolocationService: new GeolocationService(),
        roleRepository: new RoleRepository(),
        queueService: new QueueService(),
      }
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: GenericConstants.STRICT,
      })
      .json({
        code: HttpStatusCode.OK,
        data: { userInfo: resp?.data, token },
      });
  })
);

app.get(
  "/verifyChangeEmail/:token",
  handle(async (req, res, next) => {
    const session = await mongoose.startSession({
      readPreference: { mode: MongoConstants.PRIMARY },
    });

    session.startTransaction({
      readConcern: { level: MongoConstants.LOCAL },
      writeConcern: { w: MongoConstants.MAJORITY },
    });
    try {
      const resp = await verifyChangeEmail(
        req?.params?.token,
        req?.query?.verificationCode,
        {
          userRepository: new UserRepository(),
          activityRepository: new ActivityRepository(),
          queueService: new QueueService(),
        },
        session
      );

      res.json(resp);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  })
);
module.exports = app;
