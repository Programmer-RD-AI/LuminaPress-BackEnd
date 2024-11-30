# LuminaPress BackEnd

**LuminaPress-BackEnd** is the backend infrastructure for the LuminaPress platform, built using **ExpressJS** and hosted on **Azure**. This repository is responsible for handling various server-side operations, including user authentication, personalized news feed algorithms, and integration with AI and blockchain-based fact-checking systems.

## Table of Contents

- [LuminaPress BackEnd](#luminapress-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Environment Setup](#environment-setup)
  - [Running the App](#running-the-app)
  - [API Endpoints](#api-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
    - [News Feed Endpoints](#news-feed-endpoints)
    - [Article \& Fact-Checking Endpoints](#article--fact-checking-endpoints)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [License](#license)
    - [Connect with Us](#connect-with-us)

## Installation

Follow these steps to get the backend up and running locally:

### Prerequisites

Ensure you have the following installed:

- **Node.js** (LTS version recommended): [Install Node.js](https://nodejs.org)
- **npm** (Node Package Manager): Comes with Node.js.
- **Azure Account** (For deploying on Azure)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/LuminaPress/LuminaPress-BackEnd.git
   cd LuminaPress-BackEnd
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables for your local environment (e.g., database credentials, API keys). Create a `.env` file based on the provided `.env.example` template.

4. Install **Azure CLI** and log in to your Azure account if deploying to Azure.

## Environment Setup

Create a `.env` file in the root directory and define the following variables:

```env
PORT=3000
DB_CONNECTION_STRING=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
AI_SERVICE_API_KEY=your_ai_service_api_key
BLOCKCHAIN_API_KEY=your_blockchain_service_api_key
```

Make sure to replace placeholders with actual values based on your environment.

## Running the App

After setting up your environment, start the server:

```bash
npm start
```

This will run the server locally on the port defined by `PORT` in your `.env` file (default: `3000`).

## API Endpoints

This backend exposes various endpoints for managing user accounts, news feeds, and other services:

### Authentication Endpoints

- **POST** `/api/auth/register`: Register a new user
- **POST** `/api/auth/login`: Login an existing user
- **POST** `/api/auth/logout`: Logout a user

### News Feed Endpoints

- **GET** `/api/news`: Get the personalized news feed for a user
- **POST** `/api/news/recommend`: Recommend personalized news articles based on user preferences

### Article & Fact-Checking Endpoints

- **POST** `/api/articles`: Create a new article
- **GET** `/api/articles/:id`: Get a specific article by ID
- **GET** `/api/articles/fact-check/:articleId`: Get the fact-checking status of an article using AI and Blockchain

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable applications.
- **ExpressJS**: Web framework for building RESTful APIs.
- **Azure Cosmos DB**: Database for storing user data, articles, and news feed preferences.
- **Azure**: Cloud hosting platform.
- **AI Service**: For personalized news recommendations and fact-checking.
- **Blockchain**: For integrating decentralized fact-checking systems.

## Contributing

We welcome contributions from the community! If you'd like to contribute, follow the steps below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Implement your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a pull request with a description of the changes.

Please make sure your code adheres to the project's style guidelines and that all tests pass.

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

### Connect with Us

For any questions, feel free to open an issue or contact us via the [LuminaPress Community](https://github.com/LuminaPress).
