const Model = require('../model/index')
const dataBase = require('../model/database')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'CAT_API'

function createToken(data) {
  const token = jwt.sign(
    { user: {username: data.username, id: data.user_id} },
    SECRET_KEY,
    { expiresIn: '10 days' }
  )
  return token
}


function timestampToTime(timestamp) {
  const date = new Date(timestamp * 1000) // 创建 Date 对象，使用时间戳作为参数
  const year = date.getFullYear() // 获取年份
  const month = date.getMonth() + 1 // 获取月份（注意：月份从0开始，所以需要加1）
  const day = date.getDate() // 获取日期
  const hours = date.getHours() // 获取小时
  const minutes = date.getMinutes() // 获取分钟
  const seconds = date.getSeconds() // 获取秒数

  // 格式化输出
  const formattedDate = `${year}-${pad(month)}-${pad(day)}`
  const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return `${formattedDate} ${formattedTime}`
}


function get_current_time() {
  return Math.floor(new Date().getTime() / 1000)
}

/**
 * 计算两数的百分比
 * @param {*} dividend
 * @param {*} divisor
 * @returns
 */
function divideAndFormatWithPercentage(dividend, divisor) {
  // 确保除数不为零，避免除零错误
  if (divisor === 0) {
    throw new Error('除数不能为零')
  }

  // 计算结果
  const result = (dividend / divisor) * 100

  // 保留两位小数并加上百分号
  const formattedResult = result.toFixed(2) + '%'

  return formattedResult
}

function format_current_time() {
  // 获取当前时间
  const currentDate = new Date()

  // 获取月份、日期、小时和分钟，并进行格式化
  const month = currentDate.getMonth() + 1 // 月份从 0 开始，所以要加 1
  const day = currentDate.getDate()
  const hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()

  // 格式化时间
  const formattedTime = `${month}/${day} ${padZero(hours)}:${padZero(minutes)}`

  // 输出格式化后的时间
  console.log(`Formatted current time: ${formattedTime}`)
  return formattedTime
}


function scaleUpByNumber(number, wei = 18) {
  for (let i = 0; i < wei; i++) {
    number = number * 10
  }
  return Math.round(number)
}

function scaleDownByNumber(number, wei = 18) {
  for (let i = 0; i < wei; i++) {
    number = number / 10
  }
  return formatNumTen(number, 7)
}


function formatNumTen(money, length = 5) {
  let curZero = 1
  if (money) {
    if (length) {
      for (let i = 0; i < length; i++) {
        curZero *= 10
      }
    }
    return Math.round(money * curZero) / curZero
  } else {
    return 0
  }
}




function accordingIdGetTime(id) {
  let year = 0;
  let percent = 99;
  const fiveYear = 1000000000
  const fourYear = 2000000000
  const threeYear = 3000000000
  const twoYear = 4000000000
  const oneYear = 5000000000
  const now = 6300000000
  if (id > now) {
    year = 0
  }
  if (id <= now && id > oneYear) {
    year = 1
    percent = 90
  }
  if (id <= oneYear && id > twoYear) {
    year = 2
    percent = 80
  }
  if (id <= twoYear && id > threeYear) {
    year = 3
    percent = 70
  }
  if (id <= threeYear && id > fourYear) {
    year = 4
    percent = 60
  }
  if (id <= fourYear && id > fiveYear) {
    year = 5
    percent = 50
  }
  if (id < fiveYear) {
    year = 6
    percent = 20
  }
  return { year, percent }
}


function isLastDay(timestamp, diff) {
  const date = new Date()
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  const startTimeStamp = date.getTime()
  const endTimeStamp = startTimeStamp + 24 * 60 * 60 * 1000; // 24小时的毫秒数
  // 判断给定的时间戳是否在时间范围内
  return timestamp >= startTimeStamp && timestamp < endTimeStamp;
}

async function resetUserTicket(user) {
  let ticket = user.ticket
  try {
    if (ticket < 10) {
      const game_list = await Model.Event.findAll({
        attributes: ['createdAt', 'gas_add', 'count_begin'],
        where: {
          type: 'play_game',
          from_user: user.user_id,
          gas_add: {
            [dataBase.Op.gt]: new Date()
          }
        }
      })
      let ticket = 10
      let last_play_time = user.last_play_time
      if (game_list.length) {
        ticket = ticket - game_list.length
        last_play_time = game_list[0].count_begin
      }
      user.ticket = ticket
      user.last_play_time = last_play_time
      await Model.User.update(
        {
          ticket,
          last_play_time,
        },
        {
          where: {
            user_id: user.user_id
          }
        }
      )
    }
  } catch (error) {
    console.error('resetUserTicket失败', error)
  }
  return user
}

/******************************Private method */

module.exports = {
  timestampToTime,
  get_current_time,
  divideAndFormatWithPercentage,
  format_current_time,
  formatNumTen,
  scaleUpByNumber,
  scaleDownByNumber,
  accordingIdGetTime,
  isLastDay,
  resetUserTicket,
  createToken,
}
