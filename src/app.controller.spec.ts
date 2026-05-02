// ============================================================
// FILE: src/app.controller.spec.ts
// ROLE: Unit Test — verifies that AppController works correctly.
//       This test creates a mini NestJS module with just AppController
//       and AppService, then checks that getHello() returns "Hello World!".
// DEPENDS ON: AppController, AppService, @nestjs/testing
// CALLED BY: Jest test runner (via `npm run test`)
// ============================================================

// Test and TestingModule are utilities from NestJS's testing package.
// They let you create a lightweight, isolated NestJS module for testing
// WITHOUT starting the full application or HTTP server.
// Test.createTestingModule() is the testing equivalent of NestFactory.create().
import { Test, TestingModule } from '@nestjs/testing';

// Import the classes we want to test. We need both the controller (what we're
// testing) and the service (what the controller depends on).
import { AppController } from './app.controller';
import { AppService } from './app.service';

// describe() is a Jest function that groups related tests together.
// Think of it as a "test suite" — a container for multiple test cases
// that all relate to the same thing (in this case, AppController).
describe('AppController', () => {
  // Declare a variable to hold the controller instance.
  // This is declared outside beforeEach() so it's accessible in all test cases.
  let appController: AppController;

  // beforeEach() runs before EACH test case in this describe block.
  // It sets up a fresh test environment for every test, ensuring tests
  // don't affect each other (test isolation).
  //
  // It's async because Test.createTestingModule().compile() returns a Promise —
  // we need to await the module initialization before running tests.
  beforeEach(async () => {
    // Test.createTestingModule() creates a mini NestJS module just for testing.
    // It accepts the same configuration object as @Module() — controllers and providers.
    //
    // Notice we provide both AppController and AppService here. This is necessary
    // because AppController depends on AppService (it's injected via constructor).
    // If we only listed AppController without AppService, NestJS would throw:
    // "Nest can't resolve dependencies of the AppController (?)"
    //
    // .compile() finalizes the module and creates all instances, just like
    // NestFactory.create() does for the real app, but without starting an HTTP server.
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // app.get() retrieves an instance of a specific class from the test module's
    // DI container. Here we get the AppController instance that NestJS created.
    // The <AppController> is a TypeScript generic that tells app.get() what type
    // to return, so 'appController' is properly typed.
    appController = app.get<AppController>(AppController);
  });

  // A nested describe() further groups related tests. Here, 'root' refers to
  // the root route (GET /) that AppController handles.
  describe('root', () => {
    // it() defines a single test case. The string describes what the test verifies.
    // A good test name reads like a sentence: "it should return 'Hello World!'"
    it('should return "Hello World!"', () => {
      // expect() is Jest's assertion function. It takes the actual value
      // (what your code returns) and chains a matcher method.
      //
      // .toBe() is a strict equality matcher (===).
      // This test calls appController.getHello() and asserts the return value
      // is exactly the string 'Hello World!'.
      //
      // If getHello() returned anything else, this test would FAIL with a message
      // showing the expected vs. actual value.
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
