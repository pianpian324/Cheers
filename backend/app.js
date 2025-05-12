const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const praisesRouter = require('./routes/praises');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/praises', praisesRouter);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Supabase Backend Running...' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
