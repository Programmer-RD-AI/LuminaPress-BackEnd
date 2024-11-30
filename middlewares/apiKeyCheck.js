import { azureCosmosSQLAPI } from "../config/AzureCosmosConfig.js";

export const apiKeyCheck = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    console.log(apiKey);
    console.log(req.headers);
    if (!apiKey) {
      return res.status(400).json({ error: "API key is missing" });
    }

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @apiKey",
      parameters: [{ name: "@apiKey", value: apiKey }],
    };

    const { resources } = await azureCosmosSQLAPI.container.items
      .query(querySpec)
      .fetchAll();

    if (resources.length === 0) {
      return res.status(403).json({ error: "Invalid API key" });
    }
    req.apiKeyTesting = resources[0].testing;
    req.apiKeyId = resources[0].id;
    next();
  } catch (error) {
    console.error("Error checking API key:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default apiKeyCheck;
