export const handleErrors = (err, req, res, next) => {
  console.error('An error occurred:', err)
  res.status(500).json({ message: 'Internal Server Error' })
}
