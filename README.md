# Canvas_AI
<iframe width="640" height="360" frameborder="0" src="https://mega.nz/embed/s4hHBbib#ntdaU5cRXc16omK55SN9i4LW1Uv1WXcDnhlX2Kskix0" allowfullscreen ></iframe>

## Table of Contents

- [Webhook Concept](#webhook-concept)
- [User Signup Flow](#user-signup)
- [Modal Provider](#modal-provider)
- [Reducer-Based State Management](#reducer-based-state-management)
- [setups](#setups)

<details>
  <summary>Webhook Concept</summary>

### Core Concept: Webhooks

Webhooks are a mechanism for one system (the source) to notify another system (the receiver) about events in real-time. Instead of the receiver constantly asking the source if anything new has happened, the source sends updates to the receiver as they occur.

In this project:

1. **Event Source:** Clerk (handles user authentication).
2. **Event:** A user is created or updated in Clerk's system.
3. **Receiver:** Our Next.js application's API route (`/api/clerk-webhook`).
4. **Payload:** Clerk sends user details (ID, email, name, etc.) in the request body.
5. **Action:** Our Next.js application receives the data, verifies it (ideally), and updates our Prisma database.

### Development Setup: ngrok

Since the Next.js application runs locally during development (`localhost`), it's not directly accessible from the public internet where Clerk operates. `ngrok` creates a secure tunnel, providing a public URL that forwards traffic to your local server.

</details>

<details>
  <summary>user signup flow</summary>

### User Sign-Up Flow

User Sign-Up Process
![image](https://github.com/user-attachments/assets/bb85f679-59c0-4dd0-906d-4b09e5d171ce)

Here's the step-by-step process when a new user signs up:

1. **Navigate to Sign-Up Page (`app/(auth)/sign-up/[[...sign-up]]/page.tsx`)**

   - The user accesses the `/sign-up` route in the Next.js application.
   - This page renders Clerk's pre-built UI components (`@clerk/elements/sign-up`) to display the sign-up form (configured primarily for Google OAuth).

2. **User Signs Up via Clerk**

   - The user clicks the "Sign up with Google" button (or follows another configured sign-up method).
   - Clerk securely handles the entire authentication process (e.g., the Google OAuth flow).
   - Upon successful authentication/identity verification, Clerk creates a new user record _within its own system_.

3. **Clerk Sends Webhook Notification**

   - **Trigger:** The `user.created` event (or `user.updated`) is triggered within Clerk.
   - **Configuration:** Clerk checks its webhook settings for this event type and finds the configured endpoint URL (the `ngrok` public URL pointing to `/api/clerk-webhook`).
   - **Request:** Clerk sends an HTTP POST request to the `ngrok` URL. The request body contains a JSON payload with the newly created (or updated) user's details (`id`, `email_addresses`, `first_name`, etc.).

4. **ngrok Forwards Request**

   - `ngrok` receives the POST request from Clerk on its public URL.
   - It securely forwards this request through the tunnel to the local Next.js application running on `localhost`, specifically targeting the `/api/clerk-webhook` path.

5. **Webhook Handler Processes Request (`app/api/clerk-webhook/route.ts`)**
   - The `POST` function defined in this API route handler receives the forwarded request from `ngrok`.
   - **Verification (Important Prerequisite):** _Ideally, the handler should first verify the webhook signature using a secret key provided by Clerk to ensure the request is authentic and hasn't been tampered with_.
   - **Parse Data:** The handler parses the JSON request body (`await req.json()`) to extract the user data payload sent by Clerk.
   - **Extract Details:** Relevant fields like `id` (Clerk's unique user ID), `email_addresses`, `first_name`, and `image_url` are extracted from the payload.
   - **Database Synchronization (Prisma):**
     - The `db.user.upsert` Prisma client method is called.
     - `where: { clerkId: id }`: Prisma checks if a user with this `clerkId` already exists in _your application's database_.
     - `update`: If the user exists, their record (`email`, `name`, `profileImage`) is updated with the data from the webhook payload. This handles profile updates made via Clerk.
     - `create`: If no user with that `clerkId` exists, a new user record is created in your database, mapping the Clerk data to your `User` model fields.
   - **Logging:** The handler includes `console.log` statements to aid debugging by showing incoming request details, processed data, and database operation outcomes.
   - **Respond to Clerk:** The handler sends an HTTP `NextResponse` back to Clerk (relayed via `ngrok`).
     - A `status: 200` (OK) indicates successful processing.
     - A `status: 4xx` (Client Error) or `status: 5xx` (Server Error) signals a problem. Clerk might attempt to resend the webhook later upon receiving an error status.

</details>

<details>
  <summary>Modal Provider</summary>

### Modal Provider Implementation

The Modal Provider is a React context-based solution for managing modals throughout the application. It provides a centralized way to show and hide modals with consistent styling and behavior.

#### Core Components:

1. **Modal Context (`modal-context.tsx`)**
   - Creates a context for modal state management
   - Provides `show` and `hide` functions
   - Renders the modal UI with a backdrop and content container
   - Includes a custom `useModal` hook for easy access

```tsx
// /src/context/modal-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

const ModalContext = createContext<{
  show: (content: ReactNode) => void;
  hide: () => void;
} | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const show = (content: ReactNode) => setModalContent(content);
  const hide = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}

      {/* Modal UI */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            {modalContent}
            <button onClick={hide} className="mt-4 text-sm text-blue-600">
              Close
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// Custom hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
};
```

2. **Usage Example (`OpenModalButton.tsx`)**
   - Demonstrates how to use the modal context
   - Shows how to pass content to the modal
   - Includes styling for the trigger button

```tsx
// /src/components/OpenModalButton.tsx
"use client";
import { useModal } from "@/context/modal-context";

export const OpenModalButton = () => {
  const { show } = useModal();

  return (
    <button
      onClick={() =>
        show(
          <div>
            <h2 className="text-lg font-semibold">Quick Modal</h2>
            <p className="text-sm">This is a modal example.</p>
          </div>
        )
      }
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Open Modal
    </button>
  );
};
```

3. **Integration (`layout.tsx`)**
   - Shows how to wrap the application with the ModalProvider
   - Ensures modal functionality is available throughout the app

```tsx
// /src/app/layout.tsx
import { ModalProvider } from "@/context/modal-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
```

#### Key Features:

- Client-side only implementation (`"use client"`)
- Type-safe with TypeScript
- Consistent styling with Tailwind CSS
- Easy to use with the `useModal` hook
- Flexible content rendering

</details>

<details>
  <summary>Reducer-Based State Management</summary>

### Reducer-Based State Management

This implementation demonstrates a robust state management solution using React's useReducer hook, featuring undo/redo functionality.

#### Core Components:

1. **State Management**
   - Uses TypeScript for type safety
   - Implements a counter with history tracking
   - Supports undo/redo operations
   - Maintains a history array and current index

```tsx
"use client";

import React, {
  useReducer,
  createContext,
  useContext,
  Dispatch,
  ReactNode,
} from "react";

// ==============================
// TYPES
// ==============================

// State shape
type State = {
  count: number;
  history: number[];
  currentIndex: number;
};

// Action types
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "UNDO" }
  | { type: "REDO" };

// ==============================
// INITIAL STATE
// ==============================

const initialState: State = {
  count: 0,
  history: [0],
  currentIndex: 0,
};

// ==============================
// REDUCER FUNCTION
// ==============================

const counterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INCREMENT": {
      const newCount = state.count + 1;

      // 🧠 Keep only history up to currentIndex before adding new value
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        newCount,
      ];

      return {
        count: newCount,
        history: newHistory,
        currentIndex: newHistory.length - 1, // move pointer to latest
      };
    }

    case "DECREMENT": {
      const newCount = state.count - 1;

      // Same as above: trim redo history and add new value
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        newCount,
      ];

      return {
        count: newCount,
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    }

    case "UNDO": {
      // 🔙 Can only undo if not already at the beginning
      if (state.currentIndex === 0) return state;

      const prevIndex = state.currentIndex - 1;

      return {
        ...state,
        count: state.history[prevIndex], // set count to previous value
        currentIndex: prevIndex,
      };
    }

    case "REDO": {
      // 🔁 Can only redo if not already at the latest
      if (state.currentIndex >= state.history.length - 1) return state;

      const nextIndex = state.currentIndex + 1;

      return {
        ...state,
        count: state.history[nextIndex], // set count to next value
        currentIndex: nextIndex,
      };
    }

    default:
      return state;
  }
};

// ==============================
// CONTEXT
// ==============================

const CounterContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

// ==============================
// PROVIDER
// ==============================

const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

// ==============================
// HOOK
// ==============================

const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context)
    throw new Error("useCounter must be used inside CounterProvider");
  return context;
};

// ==============================
// UI COMPONENT
// ==============================

const CounterApp = () => {
  const { state, dispatch } = useCounter();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Counter with Undo / Redo</h2>
      <div className="text-2xl">Current Count: {state.count}</div>

      <div className="space-x-2">
        <button
          onClick={() => dispatch({ type: "INCREMENT" })}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          +
        </button>
        <button
          onClick={() => dispatch({ type: "DECREMENT" })}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          −
        </button>
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          Undo
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Redo
        </button>
      </div>

      <div className="text-sm text-gray-500">
        History: [{state.history.join(", ")}] | Current Index:{" "}
        {state.currentIndex}
      </div>
    </div>
  );
};

// ==============================
// FINAL EXPORT
// ==============================

const CounterWithUndoRedo = () => (
  <CounterProvider>
    <CounterApp />
  </CounterProvider>
);

export default CounterWithUndoRedo;
```

#### Key Features:

- Type-safe implementation
- History tracking for undo/redo
- Clean separation of concerns
- Reusable context pattern
- Responsive UI with Tailwind CSS

</details>

<details>
  <summary>setups</summary>
  
  ## gdrive
  Google Scopes for clerk

https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/drive.activity.readonly
https://www.googleapis.com/auth/drive.metadata
https://www.googleapis.com/auth/drive.readonly

![image](https://github.com/user-attachments/assets/687c88f1-fbb9-4483-8784-173389e3bc92)

also create a webhook in clerk for user created and updated
![image](https://github.com/user-attachments/assets/46234499-7a2c-4733-886a-074a790841d0)
![image](https://github.com/user-attachments/assets/b7a0f844-78d6-4dee-9119-f39baa201bdc)



  --------------------------------
  ## notion
  https://developers.notion.com/docs/create-a-notion-integration
  ![image](https://github.com/user-attachments/assets/f7f0626c-6c54-4f0d-aecc-f5768c179989)
  ![image](https://github.com/user-attachments/assets/61a1e532-4d4f-426c-83c9-5fa22f603f88)

  take api secret , client id , auth url 

  ----------------------------------------
  ## slack
  https://api.slack.com/apps
  create a app from scratch

  then scroll below from app infroramation and u will find App-Level Tokens
  create 2 tokens

![image](https://github.com/user-attachments/assets/9f087cbc-4221-4df0-9c69-ede6cf00a039)
![image](https://github.com/user-attachments/assets/3e35b70d-f342-4813-adf1-bf3b4ce19ab7)
![image](https://github.com/user-attachments/assets/24caa6d3-7d3a-44cd-9fa2-85b64a779e1f)
![image](https://github.com/user-attachments/assets/91575c12-3162-469b-a7f1-c58c3f792022)
![image](https://github.com/user-attachments/assets/2252c758-7d92-47ed-aee4-a90564b597b4)
![image](https://github.com/user-attachments/assets/02b73cd0-c282-4962-847d-bcb23c9568ac)

do not forget to save changes


-----------------------------------------
## discord 
https://discord.com/developers/applications
create a new application and get client id and reset secret
then do this in oauth
![image](https://github.com/user-attachments/assets/fcb1a1f0-88e4-429b-8f69-e71e7f992f05)


![image](https://github.com/user-attachments/assets/47dc4684-e357-4378-87fb-43566fcdb9a1)
copy generated url  


</details>
