import dotenv from 'dotenv';
import { createServer } from 'node:http';
import app from './app';
import { attachSocketServer } from './realtime/socketServer';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = createServer(app);
attachSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`\n [LỖI] Cổng ${PORT} hiện đang bị chiếm dụng bởi một tiến trình hoặc cửa sổ Terminal khác.`);
        console.error(` Hãy đóng cửa sổ terminal backend đang chạy ngầm hoặc tắt tiến trình chiếm cổng ${PORT} rồi thử lại.\n`);
    } else {
        console.error(' [LỖI Server]:', error);
    }
    process.exit(1);
});
