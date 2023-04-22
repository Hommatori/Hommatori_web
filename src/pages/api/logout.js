import { serialize } from 'cookie';

async function logout(req, res) {
  const response = await fetch('http://localhost:8080/logout', {
    method: 'POST',
    headers: {
      'Cookie': req.headers.cookie, // Pass the session cookie to the backend
    },
    credentials: 'include',
  });

  if (response.ok) {
    // Delete the cookies
    const cookie1 = serialize('user', '', { maxAge: 0, path: '/' });
    const cookie2 = serialize('session', '', { maxAge: 0, path: '/' });


    // Set the cookie as an HTTP response header
    res.setHeader('Set-Cookie', [cookie1, cookie2]);
    res.setHeader('location', '/');
    res.status(200).json({ message: 'Logged out' });
  } else {
    res.status(response.status).json({ message: 'Logout failed' });
  }
}

export default logout;