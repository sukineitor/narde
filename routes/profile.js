import express from 'express';
import { User, Link } from '../models/index.js';

const router = express.Router();

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const links = await Link.findAll({
      where: { UserId: req.session.userId },
      order: [['createdAt', 'DESC']]
    });
    res.render('profile', { user, links });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('An error occurred while fetching profile');
  }
});

router.post('/update', isAuthenticated, async (req, res) => {
  try {
    const { username, email } = req.body;
    await User.update({ username, email }, { where: { id: req.session.userId } });
    res.redirect('/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('An error occurred while updating profile');
  }
});

export default router;