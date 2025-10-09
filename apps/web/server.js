const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const https = require('https');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../../localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../../localhost.pem')),
};

const port = 3001;

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port}`);
    });
});
