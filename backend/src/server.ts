import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { supabase } from './config/supabaseClient';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route test kết nối Supabase
app.get('/test-db', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('Ban').select('*');

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(200).json({ success: true, data });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('API Web-app gọi món ăn qua QR Code đang chạy!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});