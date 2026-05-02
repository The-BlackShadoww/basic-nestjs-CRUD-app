// ============================================================
// FILE: src/main.ts
// ROLE: Entry Point — this is the very first file that runs when
//       the application starts. It creates the NestJS app instance,
//       registers global configuration (like validation), and
//       starts the HTTP server so it can begin accepting requests.
// DEPENDS ON: AppModule (root module), ValidationPipe (@nestjs/common)
// CALLED BY: Node.js runtime (via `nest start` or `node dist/main`)
// ============================================================

// NestFactory is the core class that creates a NestJS application instance.
// It reads the root module (AppModule), initializes all imported modules,
// creates all providers (services), and sets up all controllers (routes).
import { NestFactory } from '@nestjs/core';

// AppModule is the root module of this application. It's the starting point
// of the entire module dependency tree — NestJS loads this first, then
// recursively loads everything it imports (TypeOrmModule, UserModule, etc.).
import { AppModule } from './app.module.js';

// ValidationPipe is a built-in NestJS pipe that automatically validates
// incoming request bodies against DTO (Data Transfer Object) classes.
// It uses the 'class-validator' library to check decorator rules like
// @IsNotEmpty(), @IsEmail(), etc. on DTO properties.
import { ValidationPipe } from '@nestjs/common';

// bootstrap() is an async function because both NestFactory.create() and
// app.listen() are asynchronous operations — they return Promises that we
// must await. NestFactory.create() needs time to initialize all modules
// and connect to the database, and app.listen() needs time to bind to a port.
async function bootstrap() {
  // NestFactory.create(AppModule) does ALL the heavy lifting:
  // 1. Reads AppModule's @Module() decorator
  // 2. Recursively loads all imported modules (TypeOrmModule, UserModule)
  // 3. Connects to the SQLite database (because TypeOrmModule.forRoot() is imported)
  // 4. Creates the "user" table if it doesn't exist (because synchronize: true)
  // 5. Creates instances of all providers (AppService, UserService, Repository<User>)
  // 6. Injects dependencies into all controllers (AppController gets AppService,
  //    UserController gets UserService)
  // 7. Registers all routes from all controllers with the Express HTTP server
  // The returned 'app' object represents the fully initialized NestJS application.
  const app = await NestFactory.create(AppModule);

  // app.listen() starts the underlying Express HTTP server on the specified port.
  // process.env.PORT ?? 3000 means: use the PORT environment variable if it's set,
  // otherwise default to port 3000. The ?? operator (nullish coalescing) only falls
  // back to 3000 if PORT is null or undefined (not if it's 0 or "").
  await app.listen(process.env.PORT ?? 3000);

  // app.useGlobalPipes() registers a pipe that runs on EVERY incoming request
  // across the entire application. The ValidationPipe specifically:
  // 1. Takes the raw JSON body from the request
  // 2. Uses 'class-transformer' to convert it into the correct DTO class instance
  // 3. Uses 'class-validator' to check all validation decorators on that DTO
  // 4. If validation passes → the DTO is passed to the controller method
  // 5. If validation fails → a 400 Bad Request error is returned automatically
  //
  // { whitelist: true } means: any properties in the request body that are NOT
  // defined in the DTO class will be silently stripped out before reaching the
  // controller. This prevents "mass assignment" attacks where someone sends
  // extra fields like { "isAdmin": true } hoping your code blindly saves them.
  //
  // NOTE: This line is placed AFTER app.listen(), which is unconventional.
  // Best practice is to register pipes BEFORE listen(). It still works because
  // no real requests will arrive in the milliseconds between listen() and this line,
  // but moving it before listen() would be the standard pattern.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Log the URL where the server is running so you know it started successfully.
  // app.getUrl() returns the full URL including the protocol and port.
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Call bootstrap() to start the application.
// This is the actual execution — everything above is just function definitions.
// Since bootstrap() is async and returns a Promise, any unhandled errors
// during startup (like a database connection failure) will result in an
// unhandled promise rejection, which Node.js will report in the console.
bootstrap();
