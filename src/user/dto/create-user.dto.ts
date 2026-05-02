// ============================================================
// FILE: src/user/dto/create-user.dto.ts
// ROLE: DTO (Data Transfer Object) — defines the exact shape and
//       validation rules for the request body when creating a new user.
//       Acts as a contract: "To create a user, you MUST send a non-empty
//       name and a valid email address."
// DEPENDS ON: class-validator decorators (IsNotEmpty, IsEmail)
// CALLED BY: UserController.create() via @Body() + global ValidationPipe
// ============================================================

// Import validation decorators from the 'class-validator' library.
// These decorators define rules that the ValidationPipe checks against
// the incoming request body. They do nothing on their own — they only
// activate when the ValidationPipe processes the DTO.
//
// IsNotEmpty: rejects if the value is empty string "", null, undefined, or missing
// IsEmail: rejects if the value doesn't match a valid email format
import { IsEmail, IsNotEmpty } from 'class-validator';

// This class defines WHAT data is required when creating a new user.
//
// A DTO is NOT an entity — it doesn't map to a database table.
// An entity defines the DATABASE shape (what columns exist).
// A DTO defines the API INPUT shape (what the client must send).
//
// They can look similar, but serve different purposes:
// - Entity (User): has id, name, email — includes auto-generated fields
// - DTO (CreateUserDto): has name, email — only client-provided fields
//
// WHY use a DTO instead of accepting raw JSON?
// 1. VALIDATION: Decorators enforce rules before your code runs
// 2. SECURITY: whitelist: true strips any extra properties not in the DTO
// 3. DOCUMENTATION: The class clearly shows what the API expects
// 4. TYPE SAFETY: TypeScript catches mismatches at compile time
export class CreateUserDto {
  // @IsNotEmpty() validates that the 'name' field:
  // - Is present in the request body
  // - Is not an empty string ("")
  // - Is not null or undefined
  //
  // If this validation fails, the ValidationPipe returns a 400 error:
  // { "message": ["name should not be empty"], "statusCode": 400 }
  //
  // The 'name' property has no '?' (optional marker) and no @IsOptional(),
  // so it is REQUIRED — every create request MUST include a name.
  @IsNotEmpty()
  name: string;

  // @IsEmail() validates that the 'email' field contains a valid email format.
  // It checks for the pattern: local@domain.tld
  //
  // Valid:   "tanvir@example.com", "user@domain.co"
  // Invalid: "not-an-email", "@.com", "user@", ""
  //
  // If this validation fails, the ValidationPipe returns a 400 error:
  // { "message": ["email must be an email"], "statusCode": 400 }
  //
  // NOTE: @IsEmail() already implies the field must be present (non-optional),
  // because there's no @IsOptional() decorator. If the field is missing entirely,
  // the validation will fail.
  @IsEmail()
  email: string;
}
