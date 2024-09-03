const {
  authErrorResp,
  tokenInvalidateErrorResp
} = require('./request')
var log4js = require('log4js')

const jwt = require('jsonwebtoken')

function middleware_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/middleware/m',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  var logger = log4js.getLogger('middleware')
  return logger
}

function logger(req, resp, next) {
  if (req.method == 'GET') {
    middleware_logger().info(
      `用户: ${req.username} id: ${req.id}-GET请求url: ${req.url} -请求参数：${JSON.stringify(
        req.query
      )}`
    )
  } else if (req.method == 'POST') {
    middleware_logger().info(
      `用户: ${req.username} id: ${req.id}-POST请求url: ${req.url} -请求body: ${JSON.stringify(
        req.body
      )}`
    )
  }
  next()
}

async function token_auth(req, resp, next) {
  let token = req.headers['authorization']
  middleware_logger().info('token:', token)
  if (token == '' || token == undefined) {
    return authErrorResp(resp)
  }
  if (!token.startsWith('Bearer ')) {
    return tokenInvalidateErrorResp(resp)
  }
  token = token.substring(7)
  jwt.verify(token, 'CAT_API', (error, jwtData) => {
    if (error) {
      return tokenInvalidateErrorResp(resp, 'token is expired')
    }
    req.id = jwtData.user.id
    req.username = jwtData.user.username
    next()
  })
}

module.exports = {
  logger,
  token_auth
}
