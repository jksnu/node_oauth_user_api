const {telemetrySDK} = require('node_custom_middleware').telemetrySDK;
const app = require('./app');
const port = process.env.PORT || 8000;

telemetrySDK.start();

app.listen(port, () => {
  console.log(`app is listening at port ${port} by Process ${process.pid}`);
});