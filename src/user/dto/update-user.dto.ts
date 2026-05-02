// ============================================================
// FILE: src/user/dto/update-user.dto.ts
// ROLE: DTO (Data Transfer Object) — defines the expected shape and
//       validation rules for the request body when updating a user.
//       Unlike CreateUserDto, ALL fields here are optional because
//       PATCH means "partial update" — send only what you want to change.
// DEPENDS ON: class-validator decorators (IsOptional, IsEmail)
// CALLED BY: UserController.update() via @Body() + global ValidationPipe
// ============================================================

// Import validation decorators from 'class-validator':
// IsOptional: allows the field to be missing entirely from the request body
// IsEmail: if the field IS present, validates it as a valid email format
import { IsEmail, IsOptional } from 'class-validator';

// UpdateUserDto is used for PATCH /user/:id requests.
//
// PATCH vs PUT:
// - PATCH = partial update: send only the fields you want to change
//   Example: { "name": "New Name" } — only updates name, email stays the same
// - PUT = full replacement: send the ENTIRE resource (all fields required)
//
// This project uses PATCH, so all fields in this DTO are optional.
// This is a deliberate design choice to support partial updates.
//
// Notice that this class does NOT extend CreateUserDto or use NestJS's
// PartialType() utility. In many NestJS projects, you'll see:
//   export class UpdateUserDto extends PartialType(CreateUserDto) {}
// This automatically makes all fields from CreateUserDto optional.
// The approach used here (manually defining optional fields) works too,
// but PartialType() reduces duplication if the create DTO has many fields.
export class UpdateUserDto {
  // @IsOptional() tells the ValidationPipe: "This field can be completely
  // absent from the request body, and that's OK — skip validation for it."
  //
  // Without @IsOptional(), a missing 'name' field would trigger validation errors
  // even though we want partial updates.
  //
  // The '?' in 'name?: string' is TypeScript's optional property syntax.
  // It tells TypeScript that this property might not exist on the object.
  // @IsOptional() is the runtime validation equivalent of the compile-time '?'.
  // You need BOTH: '?' for TypeScript, @IsOptional() for class-validator.
  @IsOptional()
  name?: string;

  // @IsOptional() allows email to be absent from the body.
  // @IsEmail() validates that IF email IS provided, it must be a valid format.
  //
  // These decorators stack — they don't cancel each other out:
  // - Body has no email field → @IsOptional() says "that's fine, skip" → ✅ valid
  // - Body has email: "valid@email.com" → @IsEmail() checks format → ✅ valid
  // - Body has email: "not-an-email" → @IsEmail() checks format → ❌ rejected (400)
  // - Body has email: "" → @IsEmail() checks format → ❌ rejected (400)
  @IsOptional()
  @IsEmail()
  email?: string;
}
