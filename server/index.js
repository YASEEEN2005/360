const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Helper: Custom positions allow placing arrows exactly where the visual feature is.
// Coordinates: [x, y, z]
// y is usually -2 (height). 
// x and z determine direction on the circle.
// forward: [0, -2, -15], back: [0, -2, 15], right: [15, -2, 0], left: [-15, -2, 0]

const locations = [
  {
    id: 'road',
    image: '2026-02-12 at 7.36.35 PM.jpeg',
    links: {
      forward: { 
        id: 'garden', 
        label: '', 
        position: [35, -15, -15], // Straight ahead
        scale: 5 // Make this arrow 2x larger
      }
    }
  },
  {
    id: 'garden',
    image: 'Gemini_Generated_Image_7vrkkh7vrkkh7vrk.png',
    links: {
      forward: { 
        id: 'sitout', 
        label: '',
        position: [-30, -2, -10],
        scale: 5 // Example: Slightly to the right
      },
      back: { 
        id: 'road', 
        label: '',
        position: [0, -2, 15] // Behind
      }
    }
  },
  {
    id: 'sitout',
    image: 'Gemini_Generated_Image_lmrvollmrvollmrv.png',
    links: {
      forward: { 
        id: 'entrance', 
        label: '',
        position: [-5, -2, -15] // Example: Slightly left
      },
      back: { 
        id: 'garden', 
        label: '',
        position: [95, -40, 15] ,
         scale: 8
      }
    }
  },
  // {
  //   id: 'entrance',
  //   image: 'main entrence.jpeg',
  //   links: {
  //     back: { 
  //       id: 'sitout', 
  //       label: '', 
  //       position: [0, -2, 15]
  //     }
  //   }
  // }
];

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
