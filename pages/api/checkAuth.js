import { isLoggedIn } from '@/Data/middleware';

export default function handler(req, res) {
  try {
    isLoggedIn(req, res, () => {
      // If the control reaches this point, it means the user is authenticated
      res.status(200).json({ message: 'User is authenticated' });
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
