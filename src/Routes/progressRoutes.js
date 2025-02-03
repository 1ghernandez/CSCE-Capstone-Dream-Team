const express = require('express');
const pool = require('../Config/dbh');

const router = express.Router();

// Save or update progress
router.post('/save', async (req, res) => {
    const { id, progress } = req.body;

    if (progress < 0 || progress > 100) {
        return res.status(400).json({ error: 'Progress percentage must be between 0 and 100.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO user_info (id, progress)
             VALUES ($1, $2)
             ON CONFLICT (id)
             DO UPDATE SET progress = $2
             RETURNING *`,
            [id, progress]
        );
        res.json({ status: 'success', progress: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save progress.' });
    }
});

// Fetch progress
router.get('/fetch/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM progress WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress.' });
    }
});

module.exports = router;
