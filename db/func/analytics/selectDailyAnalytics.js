const moment = require('moment'); // Ensure moment is installed and required
const db = require('../pool');

exports.selectDailyAnalytics = async ({
  companyId, branchId, startDate, endDate,
}) => {
  try {
    let conditions = 'WHERE companyid = $1';
    const parameters = [companyId];
    let count = 2;

    if (branchId) {
      conditions += ` AND branchid = $${count}`;
      parameters.push(branchId);
      count += 1;
    }
    if (startDate) {
      conditions += ` AND date >= $${count}`;
      parameters.push(moment(startDate).tz('UTC').set({
        hour: 18, minute: 0, second: 0, millisecond: 0,
      }).toDate());
      count += 1;
    }
    if (endDate) {
      conditions += ` AND date <= $${count}`;
      parameters.push(moment(endDate).tz('UTC').set({
        hour: 17, minute: 0, second: 0, millisecond: 0,
      }).toDate());
    }
    console.log(parameters);
    const query = `SELECT * FROM dailyanalytics ${conditions} ORDER BY date ASC`;
    const { rows } = await db.query(query, parameters);
    return rows;
  } catch (err) {
    console.error('Daily Analytics Data DB Error:', err);
    throw err;
  }
};
