// Function to update a Branch's Profile Pic

const db = require('../pool');

exports.selectBranchProfile = async (id) => {
  try {
    const query = 'SELECT profilepicname FROM branches WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0].profilepicname;
  } catch (err) {
    console.error('Select Branch Profile Pic DB Error:', err);
    throw err;
  }
};
