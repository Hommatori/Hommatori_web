// Import the `serialize` function from the `cookie` package
// The `serialize` function is used to create a cookie string that can be set as a cookie header in an HTTP response
import { serialize } from 'cookie'

// Api route / function for deleting session related cookies from browser
// Since the 'accessToken' cookie is an HTTP-only cookie, it must be deleted server side in NextJS API route
async function logout(req, res) {

  // Send a POST request to the NodeJS API login endpoint -> NodeJS calls clearCookie()
  // Altough since we have established cookies in between the client and NextJS server, we must clear them below
  // But NodeJS will call clearCookie() to clear cookies established between mobile app and NodeJS
  await fetch(`${process.env.NODEJS_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  })

  // Delete the cookies
  const cookie1 = serialize('userData', '', { maxAge: -1, path: '/', expires: new Date(0) })
  const cookie2 = serialize('accessToken', '', { maxAge: -1, path: '/', expires: new Date(0) })

  // Set the cookies in the response header to clear them. The `maxAge` and `expires` options are set to now
  // to ensure that the cookies are immediately deleted by the browser
  res.setHeader('Set-Cookie', [cookie1, cookie2])

  // Send a JSON response with a status code of 200 and redirect to main page
  res.status(200).json({ message: 'Logged out' })
}

export default logout