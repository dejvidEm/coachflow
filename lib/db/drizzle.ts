import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Parse the connection URL to extract components
// This handles special characters in passwords that can't be in a URL string
function parsePostgresUrl(url: string) {
  // Format: postgresql://user:password@host:port/database
  const match = url.match(/^postgresql?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!match) {
    throw new Error('Invalid POSTGRES_URL format. Expected format: postgresql://user:password@host:port/database');
  }

  let password = match[2];
  
  // Try to decode URL-encoded password if it contains % characters
  // But catch errors if the encoding is invalid (like %m which is not valid URL encoding)
  if (password.includes('%')) {
    try {
      // Check if it's valid URL encoding by trying to decode
      const testDecode = decodeURIComponent(password);
      // If decoding succeeded without error, use decoded version
      password = testDecode;
    } catch (e) {
      // If decoding fails (e.g., %m is not valid encoding), use password as-is
      // This handles cases where % is a literal character in the password
    }
  }

  return {
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
    user: match[1],
    password: password,
  };
}

// Always parse the URL manually to handle special characters in passwords
// This avoids issues with URL parsing when passwords contain characters like [, ], %, ?, *
const config = parsePostgresUrl(process.env.POSTGRES_URL);

export const client = postgres({
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  password: config.password,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
