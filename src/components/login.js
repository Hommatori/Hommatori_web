export default async function login(req, res) {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization,
      },
      body: JSON.stringify(req.body),
    });
  
    if (response.ok) {
      const data = await response.json();
      req.session.user = data.user;
      res.status(200).json({ user: data.user });
    } else {
      res.status(401).send('Unauthorized');
    }
  }