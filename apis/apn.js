var apns = require("apn");


exports.testApn = function(req, res){
  sendApn();
  res.json({"a":"a"});
}
function sendApn(){
  var options = {
    cert: './pem/diandian.pem',                 /* Certificate file path */
    key:  './pem/diandian_key.pem',                  /* Key file path */
    gateway: 'gateway.push.apple.com',/* gateway address gateway.push.apple.com, port 2195*/
    port: 2195,                       /* gateway port */
    batchFeedback: true,
    errorCallback: errorHappened     /* Callback when error occurs function(err,notification) */
  };

  var feedback = new apns.Feedback(options);
  feedback.on("feedback", function(devices) {
    devices.forEach(function(item) {
      console.log(item);
    });
  });

  var apnsConnection = new apns.Connection(options);
  var myDevice = new apns.Device("b762a3736717c4e21cd1ebc80b695cd78cd544c0f49ad0fa80eb5decf9845687");
  var note = new apns.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 1;
  note.sound = 'ping.aiff';
  note.alert = 'You have a new message';
  note.payload = {'messageFrom': 'Caroline'};
  note.device = myDevice;
  apnsConnection.pushNotification(note,myDevice);
}
function errorHappened(err){
  console.log("errror" + err);
}