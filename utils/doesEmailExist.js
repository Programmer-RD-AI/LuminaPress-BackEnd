import { AzureCosmosSQL } from '../database/AzureCosmos.js'
import { client } from '../config/AzureCosmosConfig.js'

export const doesEmailExist = async (
  email,
  query = 'SELECT * FROM c WHERE c.email = @email'
) => {
  const ACSQL = new AzureCosmosSQL(client, 'users', 'users')
  const users = await ACSQL.query(query, [{ name: '@email', value: email }])
  return users.length > 0
}
