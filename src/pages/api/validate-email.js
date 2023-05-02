export default async (req, res) => {
    if (req.method === 'GET') {
      const email = req.query.email
      try {
        const response = await fetch(`${process.env.NODEJS_URL}/signup/validateemail/${email}`)
        const data = await response.json()
        res.status(response.status).json(data)
      } catch (error) {
        res.status(error.response.status).json(error.response.data)
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  }