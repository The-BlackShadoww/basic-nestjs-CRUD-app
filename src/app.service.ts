// ============================================================
// FILE: src/app.service.ts
// ROLE: Service — contains the business logic for the root-level
//       endpoint. In this simple case, it just returns "Hello World!".
//       In a real app, services handle complex logic, data processing,
//       and database operations.
// DEPENDS ON: Nothing — this is a standalone service with no dependencies
// CALLED BY: AppController.getHello()
// ============================================================

// Injectable is a decorator from @nestjs/common that marks a class as a
// NestJS "provider." A provider is any class that can be managed by NestJS's
// dependency injection (DI) container.
import { Injectable } from '@nestjs/common';

// @Injectable() marks this class as a NestJS provider, meaning the NestJS
// Dependency Injection container will manage its creation and lifecycle.
//
// What this means in practice:
// 1. NestJS creates ONE instance of this class (singleton by default)
// 2. That single instance is shared with every class that injects it
// 3. You never call 'new AppService()' yourself — NestJS handles it
//
// Without @Injectable(), NestJS would not know this class exists and would
// throw an error when AppController tries to inject it in its constructor.
//
// IMPORTANT: @Injectable() alone is not enough — the class must ALSO be
// listed in a module's 'providers' array. In this case, AppService is
// listed in AppModule's providers: [AppService].
@Injectable()
export class AppService {
  // getHello() is a simple method that returns the string "Hello World!".
  //
  // This demonstrates the pattern: controllers delegate to services.
  // Even though this logic is trivial (just returning a string), putting it
  // in a service means:
  // 1. It can be reused — other controllers or services could call getHello()
  // 2. It can be tested independently — you can test AppService without HTTP
  // 3. It can be swapped — you could create a different implementation
  //    and inject it instead, without changing AppController at all
  //
  // The ': string' return type annotation tells TypeScript (and developers)
  // that this method always returns a string. This is optional but good practice.
  getHello(): string {
    return 'Hello World!';
  }
}
