require('dotenv').config(); 

const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/employees',   require('./routes/employees'));
app.use('/api/spendings',   require('./routes/spendings'));
app.use('/api/report',      require('./routes/report'));

// Gunakan fallback PORT dengan huruf besar semua agar konsisten
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});