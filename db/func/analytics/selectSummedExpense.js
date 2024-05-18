const db = require('../pool');

exports.selectSummedExpenses = async ({
  branchId, startDateTime, endDateTime,
}) => {
  try {
    let conditions = 'WHERE branchid = $1';
    const parameters = [branchId];
    let count = 2;
    if (startDateTime) {
      conditions += ` AND date >= $${count}`;
      parameters.push(startDateTime);
      count += 1;
    }
    if (endDateTime) {
      conditions += ` AND date <= $${count}`;
      parameters.push(endDateTime);
      count += 1;
    }
    const query = `
    SELECT 
      SUM(total) AS sumtotal 
    FROM 
      expenses 
    ${conditions}`;
    const { rows } = await db.query(query, parameters);
    return rows[0];
  } catch (err) {
    console.error('Sum Expenses Data DB Error:', err);
    throw err;
  }
};
