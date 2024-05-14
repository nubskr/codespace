# Codespaces

I was curious about how Codeforces worked, so I made my own version :)

## Features

- **Code Evaluation**: Evaluate code submissions.
- **Collaborative Coding**: Support for multiple users to code together.
- **Voice Chat**: Integrated voice chat for collaboration.
- **Problem Packages**: Store and manage problem packages.
- **Math and Image Rendering**: Support for rendering math equations and images (or any media) in problem statements.
- **Caching**: Added caching to problem statements and problem packages using Redis.

## Demo

You can find the demo [here](https://www.youtube.com/watch?v=9eF_-2vc_9s).

## System Architecture

![Architecture](./architecture.jpg)

This is a high-level architecture of the system.

## Submission Handling

- Every new submission triggers the launch of a new Docker container (Alpine Linux).
- The container:
  - Compiles and runs the program.
  - Pulls the test data from the database if it’s not cached.
  - Compares the program output to the expected output.
  - Sends a verdict.
- There is a 2-second time limit for each program; if it doesn't complete output by then, it gets terminated, and a TLE (Time Limit Exceeded) verdict is sent.

## Implementation Details

- **Voice Chat**: Implemented using WebRTC to reduce load on the server.
- **Docker API**: Used Docker API to spawn containers on the fly for code evaluation.
- **Collaborative Features**: Utilized WebSockets (Socket.IO) for real-time collaboration.
- **Problem Packages**: Stored in MongoDB for easy management.
  - Includes:
    - Problem Statements (Interpreted)
    - Sample test data
    - Main test data (to evaluate submissions)
    - Expected outputs for the main tests
- **Redis Caching**: Cached problem packages and test data to limit hits to the database.
- **Math Rendering**: Used KaTeX for rendering math equations.
- **Rate Limiting**: Added to each compilation API call to prevent abuse.

## Supported Languages

- Only supports C++ as of now.

## Usage

To use this project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/nubskr/codespace.git
   cd codespace
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
4. Open the application in your browser.

### Prerequisites

- You need Docker and Redis installed in the backend to use the submission functionality.
- The `./Docker` directory contains the Docker image I made to evaluate the submissions.
