import jwt from 'jsonwebtoken';
import users from '../../db';

export default (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (!user) throw new Error('User not found');

      const data = {
        name: user.name,
        email: user.email,

      };
      res.status(200).json({ data });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }