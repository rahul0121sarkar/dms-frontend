# dms-frontend

# Document Management System (DMS)

A web-based Document Management System built with React and TypeScript. It allows users to authenticate using OTP, upload documents, search and filter documents, and preview or download uploaded files.

## Features

- **OTP Authentication:** Login using a mobile number and OTP verification.
- **Dashboard:** View the total document count and recently listed documents.
- **Document Upload:** Upload PDF and image files with document dates, categories, subcategories, tags, and remarks.
- **Document Search:** Search documents using categories, subcategories, tags, and date ranges.
- **Document Preview:** Preview supported PDF and image files.
- **Document Download:** Open document files through their provided URLs.
- **Protected Routes:** Restrict access to application pages unless an authentication token is available.
- **Logout:** Remove the stored authentication token and return to the login page.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Zod
- Lucide React

## Project Structure

```text
src/
├── components/
│   ├── common/
│   │   └── ProtectedRoute.tsx
│   └── layout/
│       └── MainLayout.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── UploadDocument.tsx
│   ├── SearchDocument.tsx
│   └── Admin.tsx
├── services/
│   └── api.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahul0121sarkar/dms-frontend.git
```

### 2. Navigate to the project directory

```bash
cd dms-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## API Configuration

The application communicates with the Document Management System backend through Axios.

The API base URL is configured in:

```text
src/services/api.ts
```

Current API base URL:

```text
https://apis.allsoft.co/api/documentManagement
```

The Axios request interceptor automatically attaches the authentication token to API requests when a token is available in local storage.

## Authentication Flow

1. The user enters their mobile number.
2. The application calls the `generateOTP` API.
3. The user enters the received OTP.
4. The application calls the `validateOTP` API.
5. After successful verification, the authentication token is stored in local storage.
6. The user is redirected to the dashboard.
7. Protected routes check for the stored token before allowing access.

## Document Management Flow

1. Users upload documents with the required metadata.
2. The application sends the document and metadata to the backend.
3. Users can search for documents using available filters.
4. Search results display document information.
5. Users can preview supported files or open their document URLs.

## Notes

- The application requires access to the configured backend API.
- Authentication and document operations depend on the backend API responses.
- The authentication token is stored in browser local storage.
- Supported upload formats are PDF, JPEG, PNG, and WebP.
- Document preview supports PDF and common image formats.
- The upload form currently uses predefined category/subcategory options and a fixed user ID.

## Author

Developed as a Front-End Developer assignment using React and TypeScript.
