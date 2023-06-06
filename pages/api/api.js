import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/data');
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
