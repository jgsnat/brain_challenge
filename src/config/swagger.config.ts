import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Brain challenge')
  .setDescription('Brain Challenge APIs')
  .setVersion('1.0')
  .setContact('Jefferson Silva', '', 'jgsnat@gmail.com')
  .build();
