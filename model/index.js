const { DataTypes } = require('sequelize')
const db = require('./database')
/** 用户表 */
const User = db.sequelize.define(
  'User',
  {
    authDate: { type: DataTypes.STRING, defaultValue: '' },
    hash: { type: DataTypes.STRING },
    query_id: { type: DataTypes.STRING },
    addedToAttachmentMenu: { type: DataTypes.STRING },
    allowsWriteToPm: { type: DataTypes.BOOLEAN },
    first_name: { type: DataTypes.STRING },
    user_id: { type: DataTypes.BIGINT },
    languageCode: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    score: { type: DataTypes.DOUBLE, defaultValue: 0 },
    telegram_premium: { type: DataTypes.BIGINT, defaultValue: 0 },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
    startParam: { type: DataTypes.STRING, defaultValue: '0' },
    photoUrl: { type: DataTypes.STRING },
    invite_friends_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    invite_friends_game_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    game_score: { type: DataTypes.DOUBLE, defaultValue: 0 },
    check_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    task_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    bind_wallet_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    check_date: { type: DataTypes.STRING, defaultValue: '' },
    ticket: { type: DataTypes.BIGINT, defaultValue: 10 },
    wallet: { type: DataTypes.STRING },
    wallet_nickName: { type: DataTypes.STRING },
    is_really: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_Tg: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_New: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_play_time: { type: DataTypes.DATE },
    level: { type: DataTypes.INTEGER, defaultValue: 1},
    is_auto_driver: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'user',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
    ]
  }
)
// User.sync({ alter: true })


/** 签到奖励列表  */
const CheckInReward = db.sequelize.define(
  'checkInReward',
  {
    day: { type: DataTypes.INTEGER },
    ticket: { type: DataTypes.INTEGER },
    score: { type: DataTypes.INTEGER }
  },
  {
    tableName: 'checkInReward'
  }
)

// CheckInReward.sync({ alter: true })


/** 任务列表  */
const TaskList = db.sequelize.define(
  'taskList',
  {
    name: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    linkType: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    ticket: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
  },
  {
    tableName: 'taskList'
  }
)

// TaskList.sync({ alter: true })

/** 全局配置  */
const Config = db.sequelize.define(
  'Config',
  {
    right_score: { type: DataTypes.INTEGER, defaultValue: 10 },
    auto_driver: { type: DataTypes.INTEGER, defaultValue: 750 },
    invite_friends_ratio: { type: DataTypes.INTEGER, defaultValue: 10 },
    invite_friends_score: { type: DataTypes.INTEGER, defaultValue: 5000 },
    recovery_time: { type: DataTypes.INTEGER, defaultValue: 90 },
    tg_link: { type: DataTypes.STRING, defaultValue: 'https://t.me/frenpetgame_bot/forkfrengame' },
  },
  {
    tableName: 'config'
  }
)
// Config.sync({ force: true })
// Config.create({})
/** 操作日志  */
const Event = db.sequelize.define(
  'Event',
  {
    type: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    from_user: { type: DataTypes.BIGINT },
    from_username: { type: DataTypes.STRING, defaultValue: 'system' },
    to_user: { type: DataTypes.BIGINT, defaultValue: 0 },
    to_username: { type: DataTypes.STRING, defaultValue: 'system' },
    desc: { type: DataTypes.STRING },
    ticket: { type: DataTypes.INTEGER, defaultValue: 0 },
    guessType: { type: DataTypes.STRING },
    result: { type: DataTypes.STRING },
    symbol: { type: DataTypes.STRING, defaultValue: 'BTC' },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    gas_add: { type: DataTypes.DATE },
    count_begin: { type: DataTypes.DATE },
    is_really: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'event'
  }
)

// Event.sync({ alter: true })


/** Manager */
const Manager = db.sequelize.define(
  'Manager',
  {
    account: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING },
  },
  {
    tableName: 'manager'
  }
)
// Manager.sync({ alter: true })

/** UserTask */
const UserTask = db.sequelize.define(
  'UserTask',
  {
    task_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, default: 'start' },
    user_id: { type: DataTypes.BIGINT },
  },
  {
    tableName: 'UserTask'
  }
)

// UserTask.sync({ alter: true })
const init = false
if (init) {
  User.sync({ alter: true })
  Config.sync({ alter: true })
  Event.sync({ alter: true })
  Manager.sync({ alter: true })
  CheckInReward.sync({ alter: true })
  TaskList.sync({ alter: true })
  UserTask.sync({ alter: true })
}

module.exports = {
  User,
  Config,
  Event,
  Manager,
  CheckInReward,
  TaskList,
  UserTask,
}