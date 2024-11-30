export class AzureCosmosSQL {
  constructor(client, databaseName, containerName) {
    this.client = client;
    this.database = this.client.database(databaseName);
    this.container = this.database.container(containerName);
  }

  /**
   * Queries the Cosmos DB container using a SQL query and parameters.
   * @param {string} query - The SQL query string.
   * @param {Array} parameters - Array of parameter objects for the query.
   * @returns {Promise<Array>} - The query results.
   */
  async query(query, parameters = []) {
    const results = await this.container.items
      .query({ query, parameters })
      .fetchAll();
    return results;
  }

  /**
   * Creates a new item in the Cosmos DB container.
   * @param {Object} item - The item to create.
   * @returns {Promise<Object>} - The created item.
   */
  async create(item) {
    const { resource } = await this.container.items.create(item);
    return resource;
  }

  /**
   * Reads an item from the Cosmos DB container by ID.
   * @param {string} id - The ID of the item to read.
   * @returns {Promise<Object>} - The read item.
   */
  async read(id) {
    const { resource } = await this.getItem(id).read();
    return resource;
  }

  /**
   * Updates an item in the Cosmos DB container by ID.
   * @param {string} id - The ID of the item to update.
   * @param {Object} item - The updated item data.
   * @returns {Promise<Object>} - The updated item.
   */
  async update(id, item) {
    const { resource } = await this.getItem(id).replace(item);
    return resource;
  }

  /**
   * Deletes an item from the Cosmos DB container by ID.
   * @param {string} id - The ID of the item to delete.
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.getItem(id).delete();
  }

  /**
   * Retrieves a reference to an item in the Cosmos DB container by ID.
   * @param {string} id - The ID of the item to retrieve.
   * @returns {Object} - The item reference.
   */
  getItem(id) {
    return this.container.item(id, undefined); // Partition key is optional here
  }
}
