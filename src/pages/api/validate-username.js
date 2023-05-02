export default async (req, res) => {
    if (req.method === 'GET') {
      const username = req.query.username
      try {
        const response = await fetch(`${process.env.NODEJS_URL}/signup/validateusername/${username}`)
        const data = await response.json()
        res.status(response.status).json(data)
      } catch (error) {
        res.status(error.response.status).json(error.response.data)
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  }