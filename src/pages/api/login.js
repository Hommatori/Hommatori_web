import jwt from 'jsonwebtoken'

// NextJS API route to call on user login
async function login(req, res) {
  try {
    // Send a POST request to the NODEJS API login endpoint with the user's credentials
    const response = await fetch(`${process.env.NODEJS_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization
      },
      body: JSON.stringify(req.body),
      credentials: 'include'
    })

    if (response.ok) {
      // Extract the `accessToken` value from the `Set-Cookie` header of the HTTP response
      const setCookieHeader = response.headers.get('set-cookie')
      const accessToken = setCookieHeader.split('=')[1].split(';')[0]

      // Verify the `accessToken` using the `jwt.verify`
      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      const userData = decodedToken.user

      // Create two cookie strings containing the `accessToken` and user data, respectively
      // Set the `HttpOnly` flag on the `accessToken` cookie to prevent client-side scripts from accessing it
      // Set the `Path` attribute of both cookies to `/` to make them accessible on all pages of the website
      // Set the `Max-Age` attribute of both cookies to 1 day (in seconds) to make them expire after 1 day
      const accessTokenCookie = `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}` // 1 day in seconds
      const userDataCookie = `userData=${JSON.stringify(userData)}; Path=/; Max-Age=${24 * 60 * 60}` // 1 day in seconds

      // Use the `setHeader` method of the `res` object to set the `Set-Cookie` header of the HTTP response
      // Pass an array containing the two cookie strings created above to the `setHeader` method
      res.setHeader('Set-Cookie', [accessTokenCookie, userDataCookie])

      // Use the `json` method of the `res` object to send a JSON response with a string value of 'logged in'
      // and a status code of 200 to indicate that the login was successful
      res.status(200).json('logged in')
    } else {
      // If the response status is not OK (i.e., 200), send a response with a status code of 401 (Unauthorized)
      res.status(401).send('Unauthorized')
    }
  } catch (error) {
    // If an error occurs while logging in, send a response with a status code of 500 (Internal Server Error)
    // and a JSON object with a `message` property set to 'An error occurred while logging in'
    res.status(500).json({ message: 'An error occurred while logging in' })
  }
}

export default login