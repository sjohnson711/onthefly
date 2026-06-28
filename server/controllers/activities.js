import { pool } from '../config/database.js'

const createActivity = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const { activity } = req.body
    const results = await pool.query(
      'INSERT INTO activities (trip_id, activity) \
      VALUES($1, $2) \
      RETURNING *',
      [trip_id, activity]
    )

    res.status(201).json(results.rows[0])
  }

  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const getActivities = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM activities ORDER BY id ASC')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const getTripActivities = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const results = await pool.query('SELECT * FROM activities WHERE trip_id = $1 ORDER BY id ASC', [trip_id])
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const updateActivityLikes = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { num_votes } = req.body

    const results = await pool.query(
      'UPDATE activities \
      SET num_votes = $1 \
      WHERE id = $2 \
      RETURNING *',
      [num_votes, id]
    )

    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

const deleteActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query('DELETE FROM activities WHERE id = $1', [id])
    res.status(200).json(results.rows)
  }
  catch (error) {
    res.status(409).json( { error: error.message } )
  }
}

export default {
  createActivity,
  getActivities,
  getTripActivities,
  updateActivityLikes,
  deleteActivity
}
