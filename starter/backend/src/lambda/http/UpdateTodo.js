import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
import {createLogger} from '../../logger/LoggerUtils.mjs'
import {updateTodoLogic} from "../../business-logic/TodoLogic.js";

const logger = createLogger('update-todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
        credentials: true
    })
  )
  .handler(async (event) => {
      console.log('Processing event: ', event)

      const updatedTodo = await updateTodoLogic(event);

      logger.info('Todo updated', {
          updatedTodo
      })

      return {
          statusCode: 200,
          body: 'Update todo successfully'
      }
  })
