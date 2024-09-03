const { successResp, errorResp } = require('../middleware/request')
const { LevelList } = require('../model/index')

// 配置日志输出
var log4js = require('log4js')

function LevelList_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/LevelList/p',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  var logger = log4js.getLogger('LevelList')
  return logger
}

/**
 * post /api/levellist/list
 * @summary 签到奖励列表
 * @tags LevelList
 * @description 奖励列表接口
 * @security - Authorization
 */
async function list(req, resp) {
  const uid = req.uid
  LevelList_logger().info(`用户:${uid}要获取道具列表`)
  const list = await LevelList.findAll({
    order: [['score', 'asc']],
  })
  return successResp(resp, list)
}


// ************************** Method Api ************************
module.exports = {
  list,
}

