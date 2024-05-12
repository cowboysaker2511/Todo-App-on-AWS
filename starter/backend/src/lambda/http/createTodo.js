import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const todosTable = process.env.TODOS_TABLE

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const itemId = uuidv4()

    const parsedBody = JSON.parse(event.body)
    const userId = getUserId(event)

    const item = {
      userId: userId,
      todoId: itemId,
      ...parsedBody,
      createdAt: getDatetime(),
      done: false
    }

    console.log('newItem', item)

    await dynamoDbClient.put({
      TableName: todosTable,
      Item: item
    })

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }
  })

const getDatetime = () => {

  const checkLength = function(part) {
    return (part < 10) ? '0' + part : part;
  };

  const date = new Date(),
    year = date.getFullYear(),
    month = checkLength(date.getMonth()),
    day = checkLength(date.getDay()),
    hour = checkLength(date.getHours()),
    minute = checkLength(date.getMinutes()),
    second = checkLength(date.getSeconds());

  return day + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second;
}