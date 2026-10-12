# GitHub Copilot Instructions for ExamSathi Nepal

## Coding Standard Principles

1. **TypeScript Strictness**: Always use explicit types. Never use `any`.
2. **Color Palette & Styling**:
   - Slate Navy: `#0e2148`
   - Royal Indigo: `#483aa0`
   - Soft Violet: `#7965c1`
   - Parchment Amber: `#e3d095`
   - Keep CSS modularized across `tokens.css`, `components.css`, `utilities.css`. Do not add inline bloat to index.css.
3. **Assessment Safety**: Never include correct answer keys or answers in examination attempt question endpoints.
4. **Payment Security**: Never activate a subscription solely on frontend success callback. Always execute backend verification against provider endpoints.
5. **Separation of Concerns**: Keep business logic inside NestJS service layers and out of controllers or React UI components.
