const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/Form', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});


const registrationSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String, 
  dob: Date,
  gender: String,
  password: String
});


const Registration = mongoose.model('Registration', registrationSchema);


app.post('/submit-form', (req, res) => {
  const { first_name, last_name, email, dob, gender, password } = req.body; 

 
  const newRegistration = new Registration({
    first_name,
    last_name,
    email,
    dob, 
    gender,
    password,
  });

  
  newRegistration.save().then(() => {
    console.log('Form data saved successfully');
    res.send('Form data saved successfully');
  }).catch(err => {
    console.error('Error saving form data', err);
    res.status(500).send('Error saving form data');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
