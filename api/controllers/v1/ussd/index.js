module.exports = async function (req, res) {
  var body = req.body || { text: 'No data was send' };
  var text = 'END Sent data: ' + JSON.stringify(body);

  return res.send(text);
};
