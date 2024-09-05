var log4js = require('log4js')
const { errorResp, successResp } = require('../middleware/request')
const Model = require('../model/index')
const dataBase = require('../model/database')
const { resetUserTicket } = require('../utils/common')

/**
 * get /api/game/begin
 * @summary 开始游戏
 * @tags game
 * @description 开始游戏接口
 * @security - Authorization
 */
async function begin(req, resp) {
  game_logger().info('开始玩游戏')
  try {
    await dataBase.sequelize.transaction(async (t) => {
      let user = await Model.User.findOne({
        where: {
          user_id: req.id
        }
      })
      // 找到当前用户，如果存在则返回其数据，如果不存在则新创建
      if (user) {
        let ticket = user.dataValues.ticket

        if (ticket == 0) {
          return errorResp(resp, 400, `次数不足`)
        }
        await user.decrement({
          ticket: 1
        })

        const event_data = {
          type: 'play_game',
          from_user: req.id,
          from_username: user.username,
          to_user: req.id,
          to_username: user.username,
          score: 0,
          ticket: -1,
          desc: `${user.username} begin play game`
        }
        await Model.Event.create(event_data)

        return successResp(resp, { ticket: ticket - 1 }, 'success')
      } else {
        return errorResp(resp, 400, '未找到该用户')
      }
    })
  } catch (error) {
    game_logger().error('开始玩游戏失败', error)
    console.error(`${error}`)
    return errorResp(resp, 400, `${error}`)
  }
}

/**
 * post /api/game/end
 * @summary 结算游戏
 * @tags game
 * @description 结算游戏接口
 * @security - Authorization
 */
async function end(req, resp) {
  game_logger().info('结算游戏', req.id)
  try {
    await dataBase.sequelize.transaction(async (t) => {
      let user = await Model.User.findOne({
        where: {
          user_id: req.id
        }
      })
      // 找到当前用户
      if (user) {
        if (user.ticket <= 0) {
          return errorResp(resp, 400, 'gas is empty!')
        }
        const { guessType, result, symbol } = req.body
        const config = await Model.Config.findOne()
        let score = config.right_score
        let parentUser_score = score * config.invite_friends_ratio / 100
        let count = 1
        if (result == 'Miss') {
          score = 0
          parentUser_score = 0
          count = 0
        }
        
        const responseData = {
          score: user.score + score,
          game_score: user.game_score + score,
          ticket: user.ticket - 1,
        }

        await user.update(responseData)
        // 计算连胜
        if (count) {
          const play_game_list = await Model.Event.findAll({
            attributes: ['count'],
            offset: 0,
            limit: 20,
            order: [['createdAt', 'desc']],
            where: {
              type: 'play_game',
              from_user: req.id
            }
          })
          for (let i = 0; i < play_game_list.length; i++) {
            if (play_game_list[i].count > 0) {
              count += 1
            } else {
              break;
            }
          }
        }
      
        let count_begin = new Date()
        let gas_add = new Date(count_begin.getTime() + config.recovery_time * 1000)
        try {
          if (responseData.ticket != config.dataValues.ticket - 1) {
            const gameInfo = await Model.Event.findOne({
              order: [['createdAt', 'desc']],
              where: {
                type: 'play_game',
                from_user: req.id,
              }
            })
            count_begin = gameInfo.gas_add
            gas_add = new Date(count_begin.getTime() + config.recovery_time * 1000)
          }
        } catch(error) {
          game_logger().error('gas_add error:', `${error}`)
        }
        const event_data = {
          type: 'play_game',
          from_user: req.id,
          from_username: user.username,
          score: score,
          to_user: req.id,
          to_username: user.username,
          ticket: 0,
          guessType,
          result,
          count,
          symbol,
          gas_add,
          count_begin,
          desc: `${user.username} ${result} game GET ${score} $Pts`
        }
        await Model.Event.create(event_data)

        // 给上级返利
        if (user.startParam || parentUser_score) {
          const parentUser = await Model.User.findOne({
            where: {
              user_id: user.startParam
            }
          })
          if (parentUser) {
            await parentUser.increment({
              score: parentUser_score,
              invite_friends_game_score: parentUser_score
            })
            let event_data = {
              type: 'play_game_reward_parent',
              from_user: req.id,
              from_username: user.username,
              to_user: parentUser.user_id,
              to_username: parentUser.username,
              score: parentUser_score,
              ticket: 0,
              symbol,
              desc: `${parentUser.username} get ${parentUser_score} score from ${user.username}`
            }
            await Model.Event.create(event_data)
          }
        }
        // 等待创建完记录后调用
        const userInfo = await resetUserTicket(user)

        return successResp(resp, userInfo, 'success')
      } else {
        return errorResp(resp, 400, '未找到该用户')
      }
    })
  } catch (error) {
    game_logger().error('结算游戏失败', `${error}`)
    console.error(`${error}`)
    return errorResp(resp, 400, `${error}`)
  }
}


/**
 * get /api/game/addgas
 * @summary 加满油箱
 * @tags game
 * @description 加满油箱接口
 * @security - Authorization
 */
async function addgas(req, resp) {
  game_logger().info('加满油箱')
  try {
    await dataBase.sequelize.transaction(async (t) => {
      const userInfo = await Model.User.findOne({
        where: {
          user_id: req.id
        }
      })
      if (!userInfo) {
        return errorResp(resp, 404, 'not found this user')
      }
      const config = await Model.Config.findOne()
      if (userInfo.ticket == config.ticket) {
        return errorResp(resp, 400, 'The current fuel tank is full!')
      }
      if (userInfo.free_gas == 0) {
        return errorResp(resp, 400, `Today's refueling opportunity has been exhausted!`)
      }
      const upData = {
        ticket: config.ticket,
        free_gas: userInfo.free_gas - 1
      }
      await userInfo.update(upData)
      await Model.Event.update({
        gas_add: new Date(),
      }, {
        where: {
          type: 'play_game',
          from_user: req.id,
        }
      })
      return successResp(resp, upData, 'success')
    })
  } catch (error) {
    game_logger().error('加满油箱失败', error)
    console.error(`${error}`)
    return errorResp(resp, 400, `${error}`)
  }
}

/**
 * get /api/game/record
 * @summary 获取游戏记录
 * @tags game
 * @description 获取游戏记录接口
 * @security - Authorization
 */
async function record(req, resp) {
  game_logger().info('获取游戏记录')
  try {
    await dataBase.sequelize.transaction(async (t) => {
      const page = req.query.page
      const pageSize = req.query.pageSize
      const list = await Model.Event.findAndCountAll({
        order: [['createdAt', 'desc']],
        offset: (page - 1) * pageSize,
        limit: Number(pageSize),
        where: {
          type: 'play_game',
          from_user: req.id,
          to_user: req.id
        }
      })
      return successResp(resp, list, 'success')
    })
  } catch (error) {
    game_logger().error('获取游戏记录失败', error)
    console.error(`${error}`)
    return errorResp(resp, 400, `${error}`)
  }
}

//----------------------------- private method --------------
// 配置日志输出
function game_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/game/game',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  var logger = log4js.getLogger('game')
  return logger
}

module.exports = {
  begin,
  end,
  record,
  addgas
}