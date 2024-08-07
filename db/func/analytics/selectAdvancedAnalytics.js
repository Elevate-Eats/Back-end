// Function to fetch daily analytics data

const db = require('../pool');

exports.selectAdvancedAnalytics = async ({
  companyId, branchId, startDate, endDate,
}) => {
  try {
    let conditions = 'WHERE companyid = $1';
    const parameters = [companyId];
    let count = 2;

    if (branchId) {
      conditions += ` AND branchId = $${count}`;
      parameters.push(branchId);
      count += 1;
    }
    if (startDate) {
      conditions += ` AND date >= $${count}`;
      parameters.push(startDate);
      count += 1;
    }
    if (endDate) {
      conditions += ` AND date <= $${count}`;
      parameters.push(endDate);
      count += 1;
    }
    const query = `SELECT SUM(totalsales) AS sumTotalsales, 
                   SUM(numberoftransactions) AS sumTransactions, 
                   SUM(numberofitemssold) AS sumItemsSold
                   FROM dailyanalytics ${conditions}`;
    const { rows } = await db.query(query, parameters);
    return rows;
  } catch (err) {
    console.error('Daily Analytics Data DB Error:', err);
    throw err;
  }
};
