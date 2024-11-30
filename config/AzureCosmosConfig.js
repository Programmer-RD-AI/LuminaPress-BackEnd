import { CosmosClient } from "@azure/cosmos";
import { AzureCosmosSQL } from "../database/AzureCosmos.js";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Azure Cosmos DB configuration from environment variables
const endpoint = process.env.COSMOS_ENDPOINT; // The Cosmos DB endpoint
const key = process.env.COSMOS_KEY; // The Cosmos DB key

// Initialize Cosmos Client
const client = new CosmosClient({ endpoint, key });

// Initialize your database configurations
const azureCosmosSQLArticles = new AzureCosmosSQL(
  client,
  "articles",
  "articles"
);
const azureCosmosSQLUsers = new AzureCosmosSQL(client, "users", "users");
const azureCosmosSQLAPI = new AzureCosmosSQL(client, "API", "APIKeys");

export {
  client,
  azureCosmosSQLArticles,
  azureCosmosSQLUsers,
  azureCosmosSQLAPI,
};
