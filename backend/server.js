const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
