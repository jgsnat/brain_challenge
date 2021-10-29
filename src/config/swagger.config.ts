import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Desafio Brain')
  .setDescription('Gestão de produtores rurais')
  .setVersion('1.0')
  .setContact('Jefferson Silva', '', 'jgsnat@gmail.com')
  .build();
