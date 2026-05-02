// ============================================================
// FILE: src/user/user.controller.ts
// ROLE: Controller — handles ALL incoming HTTP requests for the
//       /user route prefix. Maps each HTTP method (GET, POST,
//       PATCH, DELETE) to the corresponding UserService method.
//       This controller does NOT contain any business logic —
//       it only extracts data from the request and delegates to the service.
// DEPENDS ON: UserService (injected), CreateUserDto, UpdateUserDto
// CALLED BY: NestJS routing engine via UserModule
// ============================================================

// Import all the NestJS decorators used in this controller:
// - Body:       extracts the JSON body from the HTTP request
// - Controller: marks this class as a controller and sets the route prefix
// - Delete:     maps a method to the HTTP DELETE verb
// - Get:        maps a method to the HTTP GET verb
// - Param:      extracts a URL parameter (like :id) from the route
// - Patch:      maps a method to the HTTP PATCH verb
// - Post:       maps a method to the HTTP POST verb
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

// UserService contains all the business logic for User operations.
// It's injected into this controller via the constructor.
import { UserService } from './user.service.js';

// UpdateUserDto defines the expected shape and validation rules for the
// request body when updating a user (PATCH /user/:id).
// All fields are optional because PATCH means "partial update."
import { UpdateUserDto } from './dto/update-user.dto.js';

// CreateUserDto defines the expected shape and validation rules for the
// request body when creating a new user (POST /user).
// All fields are required — you must provide name and email.
import { CreateUserDto } from './dto/create-user.dto.js';

// @Controller('user') marks this class as a NestJS controller with the
// route prefix '/user'. This means:
// - @Get()        → GET /user
// - @Get(':id')   → GET /user/1, GET /user/2, etc.
// - @Post()       → POST /user
// - @Patch(':id') → PATCH /user/1, PATCH /user/2, etc.
// - @Delete(':id')→ DELETE /user/1, DELETE /user/2, etc.
//
// The string 'user' becomes the base path for ALL routes in this class.
// If you changed it to @Controller('api/users'), all routes would be
// under /api/users instead.
@Controller('user')
export class UserController {
  // NestJS injects the UserService instance via the constructor.
  //
  // 'private readonly userService: UserService' does three things:
  // 1. Declares a private class property called 'userService'
  // 2. Assigns the injected UserService instance to it
  // 3. Makes it readonly (can't be reassigned after construction)
  //
  // NestJS's DI container sees that this constructor needs a UserService,
  // looks in UserModule's providers array, finds UserService listed there,
  // creates an instance (or reuses the existing singleton), and passes it in.
  constructor(private readonly userService: UserService) {}

  // ─── CREATE ──────────────────────────────────────────────────
  // @Post() maps this method to HTTP POST requests on /user.
  // NestJS automatically returns status 201 Created for @Post() methods
  // (unlike @Get() which returns 200 OK).
  //
  // @Body() extracts the entire JSON request body and maps it to the
  // 'dto' parameter. Because the type is CreateUserDto and the global
  // ValidationPipe is active, NestJS will:
  // 1. Convert the plain JSON object into a CreateUserDto class instance
  // 2. Validate it against the @IsNotEmpty() and @IsEmail() decorators
  // 3. Strip any extra properties not defined in the DTO (whitelist: true)
  // 4. If validation fails → return 400 Bad Request with error details
  // 5. If validation passes → call this method with the validated DTO
  @Post()
  create(@Body() dto: CreateUserDto) {
    // Delegate to the service. The controller doesn't know HOW users
    // are created — it just passes the validated data to the service.
    return this.userService.create(dto);
  }

  // ─── READ ALL ────────────────────────────────────────────────
  // @Get() with no arguments maps to GET /user (the base path).
  // No @Body() or @Param() needed — this endpoint takes no input.
  @Get()
  findAll() {
    // Delegate to service — returns a Promise that resolves to
    // an array of all User objects from the database.
    return this.userService.findAll();
  }

  // ─── READ ONE ────────────────────────────────────────────────
  // @Get(':id') maps to GET /user/:id where :id is a URL parameter.
  // For example: GET /user/1, GET /user/42, GET /user/999
  //
  // @Param('id') extracts the 'id' part from the URL.
  // IMPORTANT: URL parameters are ALWAYS strings — even if the URL is /user/1,
  // the 'id' variable will be the string "1", not the number 1.
  // That's why the service call uses +id to convert it to a number.
  @Get(':id')
  findOne(@Param('id') id: string) {
    // +id is the unary plus operator — it converts a string to a number.
    // +"1" → 1, +"42" → 42, +"abc" → NaN
    // This is necessary because the database column 'id' is a number (INTEGER),
    // so we need to pass a number to the query, not a string.
    return this.userService.findOne(+id);
  }

  // ─── UPDATE ──────────────────────────────────────────────────
  // @Patch(':id') maps to PATCH /user/:id.
  // PATCH means "partial update" — the client only sends the fields they
  // want to change, not the entire object. This is different from PUT,
  // which replaces the entire resource.
  //
  // This method extracts TWO things from the request:
  // 1. @Param('id') — the user ID from the URL
  // 2. @Body() — the fields to update from the request body
  //
  // The body is validated against UpdateUserDto, where all fields are
  // @IsOptional() — meaning you can send { "name": "New Name" } without
  // including email, and it will only update the name.
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // Convert id string to number and pass both to the service.
    return this.userService.update(+id, dto);
  }

  // ─── DELETE ──────────────────────────────────────────────────
  // @Delete(':id') maps to DELETE /user/:id.
  // Only needs the URL parameter — no request body required for deletion.
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Convert id string to number and delegate to service.
    return this.userService.remove(+id);
  }
}
