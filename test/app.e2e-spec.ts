// ============================================================
// FILE: test/app.e2e-spec.ts
// ROLE: End-to-End (E2E) Test — boots the FULL NestJS application
//       (including all modules, database connection, etc.) and sends
//       a real HTTP request to verify the entire stack works together.
//       Unlike unit tests that test individual classes in isolation,
//       E2E tests verify that all the pieces work together correctly.
// DEPENDS ON: AppModule (full application), Supertest (HTTP testing),
//             @nestjs/testing (test module creation)
// CALLED BY: Jest test runner via `npm run test:e2e`
// ============================================================

// Test and TestingModule are NestJS testing utilities.
// For E2E tests, we use them to boot the ENTIRE application module
// (not just individual controllers/services like in unit tests).
import { Test, TestingModule } from '@nestjs/testing';

// INestApplication is the TypeScript interface for a NestJS application instance.
// It provides methods like .getHttpServer(), .init(), and .close().
import { INestApplication } from '@nestjs/common';

// 'supertest' is an HTTP assertion library. It lets you send real HTTP requests
// to your app and make assertions about the responses (status codes, body, headers).
// You don't need a running server — Supertest works directly with the HTTP handler.
import request from 'supertest';

// App is a TypeScript type from Supertest that represents the HTTP server.
// It's used as a generic parameter for INestApplication.
import { App } from 'supertest/types';

// Import the FULL AppModule — not just a controller or service.
// This means the E2E test boots the entire application: database connection,
// all modules, all routes, everything. This is what makes it "end-to-end."
import { AppModule } from './../src/app.module';

// describe() creates a test suite for the AppController E2E tests.
// The '(e2e)' label is a convention to distinguish these from unit tests.
describe('AppController (e2e)', () => {
  // The app variable holds the full NestJS application instance.
  // INestApplication<App> is typed with Supertest's App type for HTTP testing.
  let app: INestApplication<App>;

  // beforeEach() boots a fresh application before every test case.
  //
  // In E2E tests, this creates the ENTIRE application — all modules are loaded,
  // the database connection is established, all routes are registered.
  // This is much heavier than unit test setup, but it tests real integration.
  beforeEach(async () => {
    // Create a testing module using the FULL AppModule.
    // This is different from unit tests where we cherry-pick specific
    // controllers and providers. Here, we import the entire module tree:
    // AppModule → TypeOrmModule.forRoot() → UserModule → everything.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // createNestApplication() creates the actual HTTP application from the
    // compiled test module. This sets up Express, registers all routes,
    // and prepares the app to receive HTTP requests.
    app = moduleFixture.createNestApplication();

    // app.init() initializes the application — runs all lifecycle hooks
    // (like onModuleInit, onApplicationBootstrap) and ensures everything
    // is ready before we start sending requests.
    await app.init();
  });

  // This test sends a real GET request to '/' and verifies the response.
  it('/ (GET)', () => {
    // request(app.getHttpServer()) creates a Supertest instance connected
    // to the app's HTTP server. app.getHttpServer() returns the underlying
    // Node.js HTTP server that Express is using.
    //
    // .get('/') sends a GET request to the root path.
    // .expect(200) asserts the response status code is 200 OK.
    // .expect('Hello World!') asserts the response body is exactly 'Hello World!'.
    //
    // If either assertion fails, the test fails with a descriptive error.
    // This single test verifies the entire chain:
    // HTTP Request → Express → NestJS Router → AppController → AppService → Response
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // afterEach() runs after EACH test to clean up resources.
  // app.close() shuts down the NestJS application: closes the database connection,
  // stops the HTTP server, and runs all onModuleDestroy lifecycle hooks.
  //
  // This is CRITICAL for E2E tests — without it, the database connection and
  // HTTP server would leak, causing tests to hang or interfere with each other.
  afterEach(async () => {
    await app.close();
  });
});
