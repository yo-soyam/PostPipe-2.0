# PostPipe Auth & Admin Agent Prompt

**Role:** Expert Next.js & MongoDB Developer

**Context:**
I have initialized my project using `create-postpipe-auth`. My backend (Server Actions, Models, DB Connection) is already set up in:

- `lib/actions/auth.ts` (Authentication logic including Signup, Login, Verify, Resend)
- `models/User.ts` (User Mongoose Schema)
- `lib/db.ts` (Database Connection)
- `app/(auth)/...` (Basic Auth Pages)

**Your Task:**
Complete the application by polishing the authentication frontend and building a robust Admin Dashboard.

**Specific Instructions:**

1.  **Frontend Design & Logic**:

    - Review the existing pages in `app/(auth)`. Enhance the UI/UX to be "flawless" and modern.
    - **CRITICAL**: Do NOT remove the backend logic. Connect the UI components to the existing `signup`, `login`, `verifyEmail`, etc. actions in `lib/actions/auth.ts`.
    - **Resend Verification**: The `resendVerification` action exists in `lib/actions/auth.ts` but may not have a UI. Implement a "Resend Verification Email" button/link on the Login page or a dedicated page for users who haven't received their email.

2.  **Admin Dashboard**:
    - Create a protected Admin route at `app/admin/dashboard/page.tsx`.
    - Implement middleware or a check to ensure only Admin users can access this route (you may need to add a `role` field to `models/User.ts` or define an admin email in `.env`).
    - **Features**:
      - **User Management**: distinct table showing all registered users (Name, Email, Verified Status, Created At).
      - **Analytics**: Simple stats (Total Users, Recent Signups).
3.  **Code Style**:
    - Use `shadcn/ui` or clean Tailwind CSS.
    - Follow standard Next.js App Router patterns.
    - Ensure responsiveness.

**Goal:**
A fully functional Authentication system with a working Admin Dashboard, using the provided backend as the solid foundation.
