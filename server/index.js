const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const locations = [
  {
    id: 'road',
    image: 'panorama_road.jpg',
    links: {
      forward: { id: 'front', label: 'Front Yard' }
    }
  },
  {
    id: 'front',
    image: 'panorama_front.jpg',
    links: {
      forward: { id: 'porch', label: 'Porch' },
      back: { id: 'road', label: 'Road' }
    }
  },
  {
    id: 'porch',
    image: 'panorama_porch.jpg',
    links: {
      forward: { id: 'living', label: 'Living Room' }, // Enter the house
      back: { id: 'front', label: 'Front Yard' }
    }
  },
  {
    id: 'living',
    image: 'panorama_living.jpg',
    links: {
      back: { id: 'porch', label: 'Exit to Porch' },
      left: { id: 'kitchen', label: 'Kitchen' },
      right: { id: 'hallway', label: 'Hallway' },
      forward: { id: 'dining', label: 'Dining Room' }
    }
  },
  {
    id: 'kitchen',
    image: 'panorama_kitchen.jpg',
    links: {
      right: { id: 'living', label: 'Living Room' },
      forward: { id: 'dining', label: 'Dining Room' }
    }
  },
  {
    id: 'dining',
    image: 'panorama_dining.jpg',
    links: {
      back: { id: 'living', label: 'Living Room' },
      left: { id: 'kitchen', label: 'Kitchen' }
    }
  },
  {
    id: 'hallway',
    image: 'panorama_hallway.jpg',
    links: {
      back: { id: 'living', label: 'Living Room' },
      left: { id: 'bedroom', label: 'Master Bedroom' },
      right: { id: 'bathroom', label: 'Bathroom' }
    }
  },
  {
    id: 'bedroom',
    image: 'panorama_bedroom.jpg',
    links: {
      right: { id: 'hallway', label: 'Hallway' }
    }
  },
  {
    id: 'bathroom',
    image: 'panorama_bathroom.jpg',
    links: {
      left: { id: 'hallway', label: 'Hallway' }
    }
  }
];

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
