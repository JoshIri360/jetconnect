const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const genToken = async (UserId) => {
  try {
    return jwt.sign({ id: UserId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (err) {
    throw new AppError("Error generating token", 500);
  }
};

const setTokenAndCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
};

exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });

  const token = await genToken(newUser._id);
  setTokenAndCookie(res, token);

  res.status(201).json({
    status: "success",
    token,
    data: {
      data: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter your email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Email or password incorrect", 400));
  }

  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError("Email or password incorrect", 400));
  }

  const token = await genToken(user._id);
  setTokenAndCookie(res, token);

  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET);

  if (!decode) {
    return next(new AppError("You are not logged in", 401));
  }

  const [user] = await User.find({ _id: decode.id });

  if (!user) {
    return next(
      new AppError("The user belonging to that token does no longer exist", 401)
    );
  }

  if (user.changePasswordAfter(decode.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = user;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(AppError("There is no user with that email address", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Click the link and submit new password and confirmPassword 
  to ${resetURL}.\nIf you didn't forget your password plelase ignore this message`;

  console.log("Got here");

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (Valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to mail",
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the Email, try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpired: { $gt: Date.now() },
  }).select('+password');

  console.log(req.body.password, user.password);
  if (!user) {
    return next(new AppError("Your password reset link has expired", 400));
  }
  
  const correct = await user.correctPassword(req.body.password, user.password);
  if(correct) {
    return next(new AppError("You can't use your old password as the new one", 401))
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();

  genToken(user._id);

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();

  const token = await genToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  res.status(201).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.findById(req.user._id);

  if (email !== user.email) {
    const exist = await User.findOne({ email });
    if (exist) {
      return next(new AppError("This email already exists", 400));
    }
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  await user.save();

  res.status(201).json({
    status: "success",
    message: "User details updated successfully",
    data: {
      data: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    message: "Account deleted successfully",
    data: null,
  });
});
