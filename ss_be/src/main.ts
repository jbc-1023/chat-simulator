import * as fs from 'fs';
import * as https from 'https';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


// HTTP
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            'https://swipeupstories.com',
            'https://api.swipeupstories.com',
            'http://swipeupstories-localdev.com',
            'http://swipeupstories-localdev-db.com',
            'http://swipeupstories-localdev-be.com',
            'swipeupstories-localdev.com',
            'swipeupstories-localdev-db.com',
            'swipeupstories-localdev-be.com'
        ],
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"

    });
    await app.listen(3001);
}
bootstrap();

// // HTTPS
// async function bootstrap() {
//     const app = await NestFactory.create(AppModule,{
//         httpsOptions:{
//             key: fs.readFileSync('/etc/letsencrypt/live/swipeupstories.com/privkey.pem'),
//             cert: fs.readFileSync('/etc/letsencrypt/live/swipeupstories.com/fullchain.pem')
//         }
//     });
//     app.enableCors({
//         origin: 'https://swipeupstories.com'
//     });
//     await app.listen(3001);
// }
// bootstrap();
