# Audio Streaming Backend Server

This is a production-ready, high-performance backend server built with Node.js, Express, and TypeScript for streaming audio files. It is designed to be secure, scalable, and efficient, acting as a proxy to stream audio from external URLs or cloud storage like S3.

The server handles HTTP `Range` requests, allowing clients like web browsers to play large audio files without downloading the entire file first, ensuring a fast and smooth user experience.

---

## ✨ Features

-   **Chunked Audio Streaming**: Efficiently streams audio using HTTP `Range` requests to minimize initial load time.
-   **Proxy Functionality**: Fetches audio from external URLs, keeping the source location private and secure.
-   **Production-Ready Security**:
    -   Uses `helmet` to set secure HTTP headers.
    -   Configurable `cors` to protect against cross-origin attacks.
    -   `express-rate-limit` to prevent API abuse.
-   **Type-Safe Codebase**: Built entirely in TypeScript for improved developer experience and fewer runtime errors.
-   **High-Performance Compilation**: Uses **SWC** (Speedy Web Compiler) for near-instant compilation from TypeScript to JavaScript.
-   **Robust Process Management**: Ready to be managed by **PM2** for production deployments, ensuring the application is always online.
-   **Structured Logging**: Uses `winston` for configurable, production-grade logging.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd audio-streaming-ts-swc
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Now, open the `.env` file and configure the variables as needed. See the [Environment Variables](#-environment-variables) section below for details.

---

## 📜 Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`
    Runs the app in development mode using `nodemon` and `ts-node`. The server will automatically restart if you make changes to the code.

-   `npm run build`
    Compiles the TypeScript code from the `src` directory into optimized JavaScript in the `dist` directory using SWC.

-   `npm start`
    Starts the production-ready server from the compiled code in the `dist` folder. You must run `npm run build` before this command will work.

---

## 📡 API Endpoint

### Stream an Audio File

-   **GET** `/api/stream/:songId`

    Streams the audio file corresponding to the given `songId`. The client must provide a `Range` header to receive a partial content stream.

-   **URL Parameters:**
    -   `songId` (string, required): The identifier for the song you want to stream (e.g., `music1.mp3`). This ID is mapped to an external URL in the service layer.

-   **Example Request (from a client like an HTML `<audio>` tag):**
    ```
    GET /api/stream/music1.mp3 HTTP/1.1
    Host: localhost:3000
    Range: bytes=0-
    ```

-   **Success Response (206 Partial Content):**
    ```
    HTTP/1.1 206 Partial Content
    Content-Type: audio/mpeg
    Content-Length: 1048576
    Content-Range: bytes 0-1048575/5242880
    Accept-Ranges: bytes

    ...binary audio data...
    ```

---

## ⚙️ Environment Variables

The following variables must be configured in your `.env` file:

| Variable                | Description                                                                                             | Example                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `PORT`                  | The port on which the Express server will run.                                                          | `3000`                                                             |
| `NODE_ENV`              | The application environment. Set to `production` for deployed instances.                                | `development`                                                      |
| `CORS_ALLOWED_ORIGINS`  | A comma-separated list of frontend URLs allowed to access the API. **No spaces between commas.** | `http://localhost:5173,https://www.my-app.com`                       |
| `MUSIC_DIRECTORY`       | (If streaming from local files) The directory where audio files are stored.                             | `./music`                                                          |

---

## 📁 Project Structure

The `src` directory is organized to separate concerns, making the codebase clean and maintainable:

```
src/
├── config/         # App-level configurations (logger, rate limiter).
├── controllers/    # Handles request/response logic.
├── middleware/     # Custom Express middleware (error handling, validation).
├── routes/         # Defines API routes and connects them to controllers.
├── services/       # Contains the core business logic (e.g., streaming from a URL).
├── utils/          # Utility functions and classes (e.g., AppError).
└── index.ts        # The main server entry point.
```

---

## ☁️ Deployment

For production, it is recommended to deploy this application to a cloud server (like an AWS EC2 instance) and use **Nginx** as a reverse proxy.

1.  **Build the Project**: Run `npm run build` to create the `dist` directory.
2.  **Deploy Files**: Transfer the `dist`, `node_modules`, `package.json`, and `.env` files to your server.
3.  **Run with PM2**: Use the PM2 process manager to run the application continuously.
    ```sh
    pm2 start dist/index.js --name "audio-streamer"
    ```
4.  **Configure Nginx**: Set up Nginx to listen on port 80/443 and proxy requests to your Node.js application running on the port defined in your `.env` file.
5.  **Secure with SSL**: Use a tool like Certbot to add a free SSL certificate for HTTPS.
