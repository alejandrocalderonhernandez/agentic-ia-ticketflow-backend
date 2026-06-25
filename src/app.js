require('./db/database');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const logoutRoutes = require('./routes/logout');
const usersRoutes = require('./routes/users');
const eventsRoutes = require('./routes/events');
const seatsRoutes = require('./routes/seats');
const paymentRoutes = require('./routes/payment');
const bookingsRoutes = require('./routes/bookings');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const swaggerYamlPath = path.join(__dirname, '../docs/ticketflow-api.yaml');
if (fs.existsSync(swaggerYamlPath)) {
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerDoc = YAML.load(swaggerYamlPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/auth', logoutRoutes);
app.use('/users', usersRoutes);
app.use('/events', eventsRoutes);
app.use('/events', seatsRoutes);
app.use('/payment', paymentRoutes);
app.use('/bookings', bookingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TicketFlow API running on port ${PORT}`);
});

module.exports = app;
