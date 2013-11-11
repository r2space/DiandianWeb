module.exports = {

  "db": {
    "host": "mongo"
    , "port": 27017
    , "dbname": "yukari"
    , "pool": 5
  },

  "testdb": {
    "host": "mongo"
    , "port": 27017
    , "dbname": "developer"
    , "pool": 5
  },

  "mail": {
    "service": "Gmail"
    , "auth": {
      "user": "smart@gmail.com"
      , "pass": "smart"
    }
  },

  "app": {
    "port": 3000
    , "views": "views"
    , "cookieSecret": "smartcore"
    , "sessionSecret": "smartcore"
    , "sessionKey": "smartcore.sid"
    , "sessionTimeout": 720 // 24 * 30 一个月
    , "tmp": "/tmp"
    , "hmackey": "smartcore"
  },

  "log": {
    "fluent": {
      "enable": "false"
      , "tag": "node"
      , "host": "10.2.8.228"
      , "port": 24224
      , "timeout": 3.0
    }
  },

  "mq": {
    "host": "mq"
    , "port": 5672
    , "user": "guest"
    , "password": "guest"
    , "queue_join": "smartJoin"
    , "queue_apn": "smartApn"
    , "queue_thumb": "smartThumb"
    , "maxListeners": 0
  }
}
