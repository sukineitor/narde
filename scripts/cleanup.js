import { Link } from '../models/index.js';
import { Op } from 'sequelize';

async function cleanupExpiredLinks() {
    try {
        const deletedCount = await Link.destroy({
            where: {
                expires_at: {
                    [Op.lt]: new Date()
                }
            }
        });
        console.log(`Deleted ${deletedCount} expired links.`);
    } catch (error) {
        console.error('Error cleaning up expired links:', error);
    }
}

export default cleanupExpiredLinks;