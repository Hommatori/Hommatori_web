import { serialize } from 'cookie';

async function login(req, res) {  
  const response = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.authorization,
    },
    body: JSON.stringify(req.body),
    credentials: 'include',
  });

  if (response.ok) {    
    const data = await response.json();

    const cookies = [
      serialize('session', JSON.stringify(data.sessionCookie), {
        maxAge: data.sessionCookie.originalMaxAge,
        path: data.sessionCookie.path,
      }),
      serialize('user', JSON.stringify(data.user), {
        maxAge: data.sessionCookie.originalMaxAge,
        path: data.sessionCookie.path,
      }),
    ];
    res.setHeader('Set-Cookie', cookies);

    res.status(200).json('Logged in');
  } else {
    res.status(401).send('Unauthorized');
  }
}

export default login;