import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();

export default app;
