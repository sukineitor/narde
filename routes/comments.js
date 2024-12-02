import express from 'express';
import { Comment, User } from '../models/index.js';

const router = express.Router();

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
};

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { linkId, content } = req.body;
    const userId = req.session.userId;

    const comment = await Comment.create({ content, LinkId: linkId, UserId: userId });
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username'] }]
    });

    res.json(commentWithUser);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'An error occurred while creating the comment' });
  }
});

router.get('/:linkId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { LinkId: req.params.linkId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments' });
  }
});

export default router;