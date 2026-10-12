# Authorization & Entitlement System

## 1. Role-Based Access Control (RBAC)

Supported Roles:

- `SUPER_ADMIN`: Complete platform access, system configuration, audit controls.
- `ADMIN`: User management, order monitoring, content oversight.
- `CONTENT_EDITOR`: Creating/editing subjects, chapters, notes, and questions.
- `STUDENT`: Default role on registration. Can access free content and active subscription entitlements.

Roles are enforced using NestJS Decorators:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'CONTENT_EDITOR')
@Post('questions')
createQuestion(@Body() dto: CreateQuestionDto) { ... }
```

## 2. Resource-Level Entitlement System

Content and assessments carry an access flag:

- `isFreePreview`: If `true`, any authenticated user (or public visitor where configured) can access it.
- If `false`, the request passes through `EntitlementGuard`:
  1. Queries user's active subscriptions (`status === 'ACTIVE'` and `endDate >= now()`).
  2. Confirms active plan covers the target examination category.
  3. Rejects with `403 Forbidden` if no valid entitlement exists.
