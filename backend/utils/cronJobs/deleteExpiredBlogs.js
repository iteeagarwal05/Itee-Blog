import corn from 'node-cron';
import Blog from '../../models/Blog.js';

// Function to delete expired blogs
corn.schedule('0 2 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
        const result = await Blog.deleteMany({
            isPublished: false,
            createdAt: { $lt: thirtyDaysAgo },
        });
        console.log(`Deleted ${result.deletedCount} expired blogs permanently.`);
    } catch (error) {
        console.error('Error deleting expired blogs:', error);
    }
});