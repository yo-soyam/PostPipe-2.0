# PostPipe CLI Ecosystem 🚀

PostPipe offers a suite of modular CLI tools to help you scaffold authentication, user management, and email utilities in seconds.

Based on your needs, you can install the **Full Suite** or pick **Individual Modules**.

## 📦 Quick Start (Recommended)

For a complete, production-ready authentication system (Signup, Login, Sessions, DB, Email), run:

```bash
npx create-postpipe-auth
```

---

## 🧩 Modular Tools

If you prefer to build piece-by-piece, use our specific modules:

| Feature | Command | Description |
| :--- | :--- | :--- |
| **User Model** | `npx create-postpipe-user` | Installs Mongoose User Model & DB Connector. |
| **Email Util** | `npx create-postpipe-email` | Installs Resend Email Utility. |
| **Signup Flow** | `npx create-postpipe-signup` | Installs Backend + Signup Page implementation. |

---

## 📚 Documentation

### 1. `create-postpipe-auth` (The Master Tool)

This is the all-in-one solution. It scans your project structure and installs a fully functional authentication system.

**What it installs:**
*   **Backend**: `src/lib/auth/` containing Actions, Schemas, Email, User Model.
*   **Frontend**: `LoginPage`, `SignupPage`, `VerifyEmailPage`, `ResetPasswordPage`.
*   **Dependencies**: `mongoose`, `zod`, `bcryptjs`, `jsonwebtoken`, `resend`, `postpipe`.

**Usage:**
1.  Run `npx create-postpipe-auth`.
2.  Select your database (MongoDB).
3.  Add the generated environment variables to `.env`.
4.  Move the frontend pages to your `app/` router directory.

### 2. `create-postpipe-user`

Perfect if you just want a standard Mongoose User model without the full auth logic.

**Files Created:**
*   `lib/postpipe/User.ts`: Complete Mongoose Schema with verification fields.
*   `lib/postpipe/mongodb.ts`: Singleton Database connection helper.

### 3. `create-postpipe-email`

Installs the email sending infrastructure powered by [Resend](https://resend.com).

**Files Created:**
*   `lib/postpipe/email.ts`: `sendVerificationEmail` and `sendPasswordResetEmail` functions.

### 4. `create-postpipe-signup`

Scaffolds a complete "Sign Up" flow.

**What it does:**
*   Installs the Backend infrastructure (User, DB, Email) required for signup.
*   Creates a `SignupPage.tsx` component pre-wired to server actions.

---

## 🛠️ Configuration

All tools require the following environment variables in your `.env` file:

```env
# Database Connection
DATABASE_URI=mongodb+srv://...

# Security via JWT
JWT_SECRET=your_super_secret_key

# Email Sending (Resend.com)
# If omitted, emails will be logged to the console
RESEND_API_KEY=re_123456789

# App URL for Links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Support

For issues, please visit our [GitHub Repository](https://github.com/postpipe/postpipe).
