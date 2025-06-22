# NovaVoices

A modern web application built with **Vite**, **React**, and **Tailwind CSS**, containerized using **Docker**. This project includes a frontend and backend, orchestrated with Docker Compose for easy development and deployment.

---

## Features

- **Fast Development:** Vite-powered frontend for lightning-fast builds and hot module replacement.
- **Responsive UI:** Built with React and styled using Tailwind CSS.
- **Dockerized:** Easy to run in any environment with Docker and Docker Compose.
- **Backend Integration:** Seamlessly connects to a backend service (see [Backend](#backend)).

---

## Prerequisites

- **Docker** (with Docker Compose)
- **Node.js** (optional, for local development without Docker)
- **Git** (for cloning the repository)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/novavoices-dockerized.git
cd novavoices-dockerized
```

### 2. Run with Docker Compose

The project is configured to run both the frontend and backend with Docker Compose. Run the following command in the root directory:

```bash
docker compose up
```

- **Frontend:** Available at [http://localhost:5173](http://localhost:5173)
- **Backend:** Available at [http://localhost:4000](http://localhost:4000)

> **Note:** Make sure Docker is running on your system.

### 3. (Optional) Run Locally without Docker

#### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173).

#### Backend

```bash
cd Backend
npm install
npm start
```

The backend will be available at [http://localhost:4000](http://localhost:4000).

---

## Project Structure

```
novavoices-dockerized/
├── Frontend/          # Vite + React frontend
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   ├── Dockerfile     # Frontend Dockerfile
│   └── package.json   # Frontend dependencies
├── Backend/           # Node.js backend
│   ├── src/           # Backend source code
│   ├── .env           # Environment variables
│   ├── Dockerfile     # Backend Dockerfile
│   └── package.json   # Backend dependencies
├── docker-compose.yml # Docker Compose configuration
└── README.md          # This file
```

---

## Configuration

### Environment Variables

- **Backend:**  
  - Add your environment variables in `Backend/.env`.
  - Example:
    ```env
    PORT=4000
    DATABASE_URL=your-database-url
    ```

---

## Docker Images

The Docker images for this project are available on Docker Hub:

- **Frontend:** `yourusername/your-frontend-image`
- **Backend:** `yourusername/your-backend-image`

> Replace `yourusername` and `your-frontend-image`/`your-backend-image` with your actual Docker Hub username and image names.

---

## Development

### How to Build and Push Docker Images

1. **Build Images:**
```bash
docker compose build
```

2. **Tag and Push Images to Docker Hub:**
```bash
docker tag your-frontend-image yourusername/your-frontend-image
docker push yourusername/your-frontend-image
```

Repeat for the backend image.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

---


## Contact

For questions or feedback, please open an issue or contact sufyanliaquat58@gmail.com.