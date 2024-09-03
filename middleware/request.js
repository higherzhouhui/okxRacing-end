const successResp = (resp, data, msg = 'success') => {
  return resp.send({
    code: 0,
    msg: msg,
    data: data
  })
}

function errorResp(resp, code, msg = 'error') {
  return resp.send({
    code: code,
    msg: msg,
    data: null
  })
}

function authErrorResp(resp) {
  return errorResp(resp, 401, 'token is empty')
}

function tokenInvalidateErrorResp(resp) {
  return errorResp(resp, 402, 'token invalid')
}

function paramErrorResp(resp) {
  return errorResp(resp, 400, 'Missing necessary parameters')
}

module.exports = {
  successResp,
  errorResp,
  authErrorResp,
  tokenInvalidateErrorResp,
  paramErrorResp,
}
