import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }