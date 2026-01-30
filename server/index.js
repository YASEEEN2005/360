const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Hardcoded location data matching client structure
// Note: Images are referenced by ID/filename since backend doesn't bundle assets like Vite
const locations = [
  {
    id: 'road',
    image: 'panorama_road.jpg',
    links: {
      forward: 'front',
      back: null,
      left: null,
      right: null
    }
  },
  {
    id: 'front',
    image: 'panorama_front.jpg',
    links: {
      forward: 'porch',
      back: 'road',
      left: null,
      right: null
    }
  },
  {
    id: 'porch',
    image: 'panorama_porch.jpg',
    links: {
      forward: null,
      back: 'front',
      left: null,
      right: null
    }
  }
];

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
