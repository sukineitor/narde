import express from 'express';
import { Link, User } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', async (req, res) => {
  try {
    const links = await Link.findAll({
      include: [{ model: User, attributes: ['username'] }],
      where: {
        expires_at: {
          [Op.gt]: new Date()
        }
      },
      order: [['createdAt', 'DESC']]
    });
    res.render('index', { links, user: req.session.userId ? { id: req.session.userId } : null });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).send('An error occurred while fetching links');
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, url, description } = req.body;
    const userId = req.session.userId;
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now

    await Link.create({ title, url, description, UserId: userId, expires_at: expiresAt });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).send('An error occurred while creating the link');
  }
});

router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (link) {
      link.likes += 1;
      await link.save();
      res.json({ likes: link.likes });
    } else {
      res.status(404).send('Link not found');
    }
  } catch (error) {
    console.error('Error liking link:', error);
    res.status(500).send('An error occurred while liking the link');
  }
});

export default router;