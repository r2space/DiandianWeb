var zookeeper = require('node-zookeeper-client');
var conf = smart.util.config;

function removeLock(path, callback) {

  var client = zookeeper.createClient(conf.zookeeper.host);

  console.log('Connected removeLock the server.');
  client.on('connected', function (state) {

    console.log('Connected to the server.');

    client.remove(path, function (error) {

      if (error) {
        console.log(
          'Failed to delete node: %s due to: %s.',
          path,
          error
        );
        callback(error);
        return;
      }
      callback(null);
      client.close();
    });
  });
  client.connect();
};

function setLock(path, data, callback) {

  console.log('Connected setLock the server.');
  var client = zookeeper.createClient(conf.zookeeper.host);

  client.once('connected', function () {
    console.log('Connected to the server.');

    client.setData(path, new Buffer(data), function (error, stat) {
      if (error) {
        console.log('Got error when setting data: ' + error);
        callback(error);
        return;
      }

      console.log(
        'Set data "%s" on node %s, version: %d.',
        data.toString(),
        path,
        stat.version
      );
      callback(null, data.toString());
      client.close();
    });
  });

  client.connect();
};

function getLock(path, callback) {

  var client = zookeeper.createClient(conf.zookeeper.host);

  var getData = function (client, path) {
    client.getData(
      path,
      function (event) {
        console.log('Got event: %s', event);
        getData(client, path);
      },
      function (error, data, stat) {
        if (error) {
          console.log('Error occurred when getting data: %s.', error);
          callback(error);
          return;
        }

        console.log(
          'Node: %s has data: %s, version: %d',
          path,
          data ? data.toString() : undefined,
          stat.version
        );

        callback(null, data ? data.toString() : undefined, new Date(Number("0x" + stat.mtime.toString('hex'))));
        client.close();
      }
    );
  };

  client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    getData(client, path);
  });

  client.connect();
};

function createLock(path, callback) {

  var client = zookeeper.createClient(conf.zookeeper.host);

  client.once('connected', function () {
    console.log('Connected to the server.');

    client.create(path, function (error) {
      if (error) {

        console.log('Failed to create node: %s due to: %s.', path, error);
      } else {

        console.log('Node: %s is successfully created.', path);
      }
      callback(null);
      client.close();
    });
  });

  client.connect();
}

exports.setLock = setLock;
exports.getLock = getLock;
exports.createLock = createLock;
exports.removeLock = removeLock;