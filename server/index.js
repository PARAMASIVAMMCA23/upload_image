const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('maxHttpHeaderSize', 65536);

mongoose.connect('mongodb://localhost:27017/Img', { useNewUrlParser: true, useUnifiedTopology: true });

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  imagePath: String
});
imageSchema.index({ imageUrl: 1 });

const Image = mongoose.model('Image', imageSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(express.raw({ limit: '1mb' }));

app.use(cors());
app.use(morgan('dev'));
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(500).send('Internal Server Error');
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageName = Date.now() + '-' + req.file.originalname;
  const imagePath = path.join(uploadDir, imageName);

  fs.writeFile(imagePath, req.file.buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save image to disk' });
    }

    const newImage = new Image({
      imageUrl: req.file.buffer.toString('base64'),
      imagePath: imagePath
    });

    newImage.save()
      .then(image => {
        res.json({ imageUrl: `/api/image/${image._id}` });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to save image details to database' });
      });
  });
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find({}).exec();
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images from database' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
