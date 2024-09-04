const express = require('express')
const router = express.Router()
const user = require('./user.js')
const manage = require('./manage.js')
const game = require('./game.js')
const checkInReward = require('./reward.js')
const task = require('./task.js')
const level = require('./level.js')

// 用户路由
router.post('/user/login', user.login)
router.post('/user/h5PcLogin', user.h5PcLogin)
router.post('/user/update', user.updateInfo)
router.post('/user/check', user.userCheck)
router.post('/user/bindWallet', user.bindWallet)
router.get('/user/list', user.getUserList)
router.get('/user/subList', user.getSubUserList)
router.get('/user/subTotal', user.getSubUserTotal)
router.get('/user/userInfo', user.getUserInfo)
router.get('/user/createUser', user.createUserInfo)
router.get('/user/cancelCreateUser', user.cancelCreateUserInfo)
router.get('/user/startFarming', user.startFarming)
router.get('/user/getRewardFarming', user.getRewardFarming)
router.get('/user/getMagicPrize', user.getMagicPrize)
router.get('/user/getMyScoreHistory', user.getMyScoreHistory)
router.get('/user/subtotallist', user.getSubUserTotalAndList)
router.get('/user/getcertifieds', user.getCertifieds)


router.get('/game/begin', game.begin)
router.get('/game/record', game.record)
router.get('/game/addgas', game.addgas)
router.post('/game/end', game.end)

router.get('/levellist/list', level.list)

// 签到奖励列表
router.get('/checkInReward/list', checkInReward.list)
// 获取任务列表
router.get('/task/list', task.list)
router.post('/task/handle', task.handle)

router.get('/system/getConfig', manage.getConfigInfo)
router.get('/system/resetTicket', user.resetTicketInfo)

// 管理后台接口
router.post('/dogAdmin/login', manage.login)
router.get('/dogAdmin/userInfo', manage.userInfo)
router.get('/dogAdmin/getUserList', manage.getUserList)
router.get('/dogAdmin/getUserInviteList', manage.getUserInviteList)
router.post('/dogAdmin/user/update', manage.updateUserInfo)
router.post('/dogAdmin/user/remove', manage.removeUser)
router.get('/dogAdmin/getPropsList', manage.getPropsList)
router.post('/dogAdmin/props/update', manage.updatePropsInfo)
router.post('/dogAdmin/props/remove', manage.removeProps)
router.get('/dogAdmin/getEventList', manage.getEventList)
router.post('/dogAdmin/event/update', manage.updateEventInfo)
router.post('/dogAdmin/event/remove', manage.removeEvent)
router.get('/dogAdmin/config/info', manage.getConfigInfo)
router.post('/dogAdmin/config/update', manage.updateConfigInfo)
router.get('/dogAdmin/home/info', manage.getHomeInfo)
router.get('/dogAdmin/admin/list', manage.getAdminList)
router.post('/dogAdmin/admin/update', manage.updateAdminInfo)
router.post('/dogAdmin/admin/remove', manage.removeAdminInfo)

router.get('/dogAdmin/task/list', manage.getTaskList)
router.post('/dogAdmin/task/update', manage.updateTaskInfo)
router.post('/dogAdmin/task/remove', manage.removeTaskList)

router.get('/dogAdmin/prize/list', manage.getPrizeList)
router.post('/dogAdmin/prize/update', manage.updatePrizeInfo)
router.post('/dogAdmin/prize/remove', manage.removePrize)

router.get('/dogAdmin/exp/list', manage.getExpList)
router.post('/dogAdmin/exp/update', manage.updateExpList)
router.post('/dogAdmin/exp/remove', manage.removeLevel)
router.get('/dogAdmin/propsRecord/list', manage.getPropsRecordList)
router.post('/dogAdmin/propsRecord/update', manage.updateUserPropsList)
router.post('/dogAdmin/propsRecord/remove', manage.removeUserProps)
router.get('/dogAdmin/wallet/list', manage.getWalletList)
router.post('/dogAdmin/wallet/remove', manage.removeWallet)

module.exports = router
