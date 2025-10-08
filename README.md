# Study Group Finder

Study Group Finder is a web application designed to help students connect and form study groups. Users can create accounts, find existing study groups for various subjects, and schedule online meetings.

## Features

-   **User Authentication**: Secure sign-up and login for students.
-   **Create Meetings**: Users can schedule new study meetings for different courses.
-   **Find Meetings**: Browse and search for existing study meetings.
-   **Meeting Details**: View detailed information about each study meeting.
-   **Dashboard**: Personalized dashboard for users to see their upcoming meetings.

## Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS
-   **Backend**: Firebase (Authentication, Firestore, Hosting)
-   **Routing**: React Router

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js and npm installed. You can download them [here](https://nodejs.org/).
-   A Firebase account. You can create one for free at [firebase.google.com](https://firebase.google.com/).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your_username/study-group-finder.git
    cd study-group-finder
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    The following steps will guide you through setting up the necessary Firebase services for this project.

    #### **Step 1: Create Firebase Project**

    1.  Go to the [Firebase Console](https://console.firebase.google.com/).
    2.  Click "Create a project" or "Add project".
    3.  Enter a project name (e.g., `study-group-finder-demo`).
    4.  (Optional) Enable Google Analytics.
    5.  Click "Create project".

    #### **Step 2: Enable Services**

    -   **Authentication**:
        1.  Go to **Authentication** → **Sign-in method**.
        2.  Enable **Email/Password** authentication.

    -   **Firestore Database**:
        1.  Go to **Firestore Database** → **Create database**.
        2.  Choose **Start in test mode** for development.
        3.  Select a cloud firestore location.

    #### **Step 3: Get Firebase Configuration**

    1.  In your project's dashboard, go to **Project Settings** (gear icon) → **General** tab.
    2.  Scroll down to the "Your apps" section.
    3.  Click the **Web app** icon (`</>`).
    4.  Enter an app nickname (e.g., `study-group-finder-web`).
    5.  Click "Register app".
    6.  Copy the `firebaseConfig` object provided.

    #### **Step 4: Update Local Configuration**

    Replace the placeholder configuration in `src/services/firebase.js` with the `firebaseConfig` object you just copied:

    ```javascript
    const firebaseConfig = {
      apiKey: "your-actual-api-key",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id"
    };
    ```

4.  **Deploy Firebase Rules:**

    The project comes with pre-configured security rules for Firestore. To deploy them, run:
    ```bash
    npm run firebase:deploy
    ```
    *Note: You may need to log in to Firebase first using `npm run firebase:login`.*


## Available Scripts

In the project directory, you can run:

-   `npm run dev`
    -   Runs the app in development mode.
    -   Open [http://localhost:5173](http://localhost:5173) to view it in the browser (the port may vary).

-   `npm run build`
    -   Builds the app for production to the `dist` folder.

-   `npm run firebase:deploy`
    -   Builds the project and deploys it to Firebase Hosting.

-   `npm run firebase:serve`
    -   Serves the application locally using the Firebase Hosting emulator.
