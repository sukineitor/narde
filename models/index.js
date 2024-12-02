import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './User.js';
import LinkModel from './Link.js';
import CommentModel from './Comment.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

const User = UserModel(sequelize);
const Link = LinkModel(sequelize);
const Comment = CommentModel(sequelize);

User.hasMany(Link);
Link.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Link.hasMany(Comment);
Comment.belongsTo(Link);

export { sequelize, User, Link, Comment };