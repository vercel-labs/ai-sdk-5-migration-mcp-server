/**
 * API endpoint to serve pre-built AI SDK v4 to v5 conversion functions
 */

import { generateConversionFunctions } from '@/lib/conversion-functions';

export async function GET() {
  return new Response(generateConversionFunctions(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="convert-messages.ts"',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
