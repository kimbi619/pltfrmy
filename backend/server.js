const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();

const db = require('./config/database');
// const seed_db = require('./prisma/seed');


const authRoutes = require('./routes/authRoutes');
// const taskRoutes = require('./routes/taskRoutes');
// const calendarRoutes = require('./routes/calendarRoutes');

const app = express();

app.use(helmet());
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/calendar', calendarRoutes);



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;