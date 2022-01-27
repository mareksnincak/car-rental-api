// import { HttpServer, INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';

// import { AppModule } from '@src/app.module';
// import { enhanceAppWithGlobalObjects } from '@src/main';

// let app: HttpServer;
// export let count = 0;

export const getTestUrl = () => {
  return process.env.TEST_URL as string;
};
// export const createTestServer = async () => {
//   count = count + 1;
//   if (app) {
//     return app;
//   }

//   const moduleFixture = await Test.createTestingModule({
//     imports: [AppModule],
//   }).compile();

//   const appInstance = moduleFixture.createNestApplication();
//   enhanceAppWithGlobalObjects(appInstance);
//   await appInstance.init();

//   app = appInstance.getHttpServer();
//   return app;
// };
