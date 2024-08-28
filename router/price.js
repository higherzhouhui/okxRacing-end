const { errorResp, successResp } = require("../middleware/request")
var log4js = require('log4js')
const cheerio = require('cheerio')
const axios = require('axios')
/**
 * post /api/price/get
 * @summary 获取BTC价格
 * @tags price
 * @description 获取BTC价格接口
 * @security - Authorization
 */
async function getPrice(req, resp) {
  price_logger().info('开始获取价格', req.id)
  try {
    const html = await fetchHtml('https://mifengcha.com/coin/bitcoin')
    const r = extractContent(html)
    return successResp(resp, r, 'success')
  } catch (error) {
    price_logger().error('获取价格失败:', `${error}`)
    return errorResp(resp, 400, `${error}`)
  }

}


// 配置日志输出
function price_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/price/price',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  var logger = log4js.getLogger('price')
  return logger
}

async function fetchHtml(url) {
  try {
    const {data} = await axios.get(url)
    return data
  } catch(error) {
    console.error('Error fetching HTML:', error);
  }
}


async function extractContent(html) {
  // 使用cheerio加载网页数据
  try {
    const $ = cheerio.load(html);
 
    // 选择器和提取内容的逻辑
    const title = $('title').text();
    const content = $('body').text();
   
    return { title, content };
  } catch (error) {
    console.error('extraError:', `${error}`)
  }

}

module.exports = {
  getPrice
}