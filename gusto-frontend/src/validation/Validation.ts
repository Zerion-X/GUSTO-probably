import * as yup from "yup";

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;

const loginIdentifierSchema = yup
  .string()
  .trim()
  .required("Email or username is required")
  .test(
    "email-or-username",
    "Enter a valid email or username",
    (value) => {
      if (!value) return false;

      return (
        yup.string().email().isValidSync(value) ||
        USERNAME_REGEX.test(value)
      );
    }
  );

const passwordSchema = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(20, "Password must be at most 20 characters");

export const loginSchema = yup.object({
  email_username: loginIdentifierSchema,
  password: passwordSchema,
});

export const signupSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email"),

  username: yup
    .string()
    .trim()
    .required("Username is required")
    .matches(
      USERNAME_REGEX,
      "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
    ),

  password: passwordSchema,

  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});