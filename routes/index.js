const Router = require('express').Router;
const router = Router();
const dns = require('dns');

const hosts = {};

router.get('', function(req, res, next) {
  console.log(req.hostname, req.connection.remoteAddress);
  const host = handleHost(req.hostname, req.connection.remoteAddress.split(':')[req.connection.remoteAddress.split(':').length - 1]);
  console.log(hosts);
  console.log({host, hosts});
  res.json({host, hosts});
});

const handleHost = function(hostname, ip){
  let host = hosts[ip];
  if (host){
    return host;
  } else {
    dns.resolve4('google.com', (err, addresses) => {
      if (err) throw err;
      addresses.map(a => {
        if (ip === a){
          hosts[a] = hostname;
          host = hostname;
        }
      });
    });
    return host;
  }
}

module.exports = router;
