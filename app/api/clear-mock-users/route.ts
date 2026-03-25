/**
 * Clear Mock Users API
 *
 * Clears all mock users from localStorage
 * Call this endpoint to reset mock user data
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // This endpoint is for demonstration purposes
  // localStorage can only be cleared client-side
  
  return NextResponse.json({
    success: true,
    message: 'To clear mock users, run this in your browser console:',
    command: "localStorage.removeItem('mock_users')",
    alternative: 'Or visit /clear-mock-users in your browser',
  })
}

export async function GET() {
  // Return a simple HTML page that clears localStorage
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clear Mock Users</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      padding: 2rem 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #333; margin-bottom: 1rem; font-size: 1.5rem; }
    p { color: #666; margin-bottom: 1.5rem; }
    .status {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    .status.success { background: #d4edda; color: #155724; }
    .status.info { background: #d1ecf1; color: #0c5460; }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #5a67d8; }
    a {
      display: inline-block;
      margin-top: 1rem;
      color: #667eea;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🗑️ Clear Mock Users</h1>
    <div id="status" class="status info">Clearing mock users...</div>
    <button onclick="clearMockUsers()">Clear Now</button>
    <br>
    <a href="/admin">← Back to Admin</a>
  </div>

  <script>
    function clearMockUsers() {
      localStorage.removeItem('mock_users');
      const status = document.getElementById('status');
      status.className = 'status success';
      status.textContent = '✅ Mock users cleared successfully!';
      
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    }

    // Auto-clear on page load
    clearMockUsers();
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
