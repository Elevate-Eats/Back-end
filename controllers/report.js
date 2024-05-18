exports.getDailyReport = async (req, res) => {
  const { branchId, date } = req.query;

  const formattedDate = new Date(date).toISOString();

  const apiKey = process.env.API_KEY;
  const serviceUrl = process.env.REPORT_SERVICE_URL;

  const url = new URL('/api/v1/reports/generate-daily-report/', serviceUrl);
  url.searchParams.append('branchId', branchId);
  url.searchParams.append('date', formattedDate);

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    res.setHeader('Content-Type', 'application/pdf');

    return response.body.pipe(res);
  } catch (error) {
    console.error('Failed to fetch daily report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily report',
    });
  }
};

exports.predictTransaction = async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const apiKey = process.env.API_KEY;
  const serviceUrl = process.env.REPORT_SERVICE_URL;

  const url = new URL('/api/v1/reports/predict-transaction', serviceUrl);
  url.searchParams.append('branchId', branchId);
  url.searchParams.append('startDate', new Date(startDate).toISOString().split('T')[0]);
  url.searchParams.append('endDate', new Date(endDate).toISOString().split('T')[0]);
  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const dataAsArray = Array.isArray(data) ? data : [data];

    return res.status(200).json({
      success: true,
      data: dataAsArray,
    });
  } catch (error) {
    console.error('Failed to fetch transaction prediction:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction prediction',
    });
  }
};
