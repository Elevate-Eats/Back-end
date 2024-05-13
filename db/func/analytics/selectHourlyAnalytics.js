const db = require('../pool');

exports.selectHourlyAnalytics = async ({
  companyId, branchId, startDateTime, endDateTime,
}) => {
  try {
    let conditions = 'WHERE companyid = $1';
    const parameters = [companyId];
    let count = 2;

    if (branchId) {
      conditions += ` AND branchid = $${count}`; // Ensure consistent column naming (branchid, not branchId)
      parameters.push(branchId);
      count += 1;
    }
    if (startDateTime) {
      conditions += ` AND datetime >= $${count}`;
      parameters.push(startDateTime);
      count += 1;
    }
    if (endDateTime) {
      conditions += ` AND datetime <= $${count}`;
      parameters.push(endDateTime);
      count += 1;
    }
    const query = `SELECT * FROM hourlyanalytics ${conditions} ORDER BY datetime ASC`;
    const { rows } = await db.query(query, parameters);
    return rows;
  } catch (err) {
    console.error('Hourly Analytics Data DB Error:', err);
    throw err;
  }
};
