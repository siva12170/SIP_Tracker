import { pool } from "../config/db.js";

const getDashboardPayload = async (conn, userId = null) => {
  let investors = [];
  let sips = [];
  let funds = [];

  if (userId) {
    const [investorRows] = await conn.query(
      `
      SELECT
        investor_id,
        first_name,
        last_name,
        email,
        phone,
        pan_number,
        created_at
      FROM investors
      WHERE investor_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );
    investors = investorRows;

    const [sipRows] = await conn.query(
      `
      SELECT
        s.sip_id,
        s.sip_amount,
        s.sip_date,
        s.start_date,
        s.status,
        s.created_at,
        mf.fund_name,
        CONCAT(i.first_name, ' ', i.last_name) AS investor_name
      FROM sips s
      JOIN mutual_funds mf
        ON s.fund_id = mf.fund_id
      JOIN investors i
        ON s.investor_id = i.investor_id
      WHERE s.investor_id = ?
      ORDER BY s.created_at DESC
      `,
      [userId]
    );
    sips = sipRows;

    const [fundRows] = await conn.query(
      `
      SELECT DISTINCT
        mf.fund_id,
        mf.fund_name,
        mf.fund_type,
        mf.category,
        mf.latest_nav,
        a.amc_name
      FROM mutual_funds mf
      JOIN amcs a
        ON mf.amc_id = a.amc_id
      JOIN sips s
        ON s.fund_id = mf.fund_id
      JOIN investors i
        ON s.investor_id = i.investor_id
      WHERE s.investor_id = ?
      ORDER BY mf.fund_name ASC
      `,
      [userId]
    );
    funds = fundRows;
  } else {
    const [investorRows] = await conn.query(
      `
      SELECT
        investor_id,
        first_name,
        last_name,
        email,
        phone,
        pan_number,
        created_at
      FROM investors
      ORDER BY created_at DESC
      `
    );
    investors = investorRows;

    const [sipRows] = await conn.query(
      `
      SELECT
        s.sip_id,
        s.sip_amount,
        s.sip_date,
        s.start_date,
        s.status,
        s.created_at,
        mf.fund_name,
        CONCAT(i.first_name, ' ', i.last_name) AS investor_name
      FROM sips s
      JOIN mutual_funds mf
        ON s.fund_id = mf.fund_id
      JOIN investors i
        ON s.investor_id = i.investor_id
      ORDER BY s.created_at DESC
      `
    );
    sips = sipRows;

    const [fundRows] = await conn.query(
      `
      SELECT
        mf.fund_id,
        mf.fund_name,
        mf.fund_type,
        mf.category,
        mf.latest_nav,
        a.amc_name
      FROM mutual_funds mf
      JOIN amcs a
        ON mf.amc_id = a.amc_id
      `
    );
    funds = fundRows;
  }

  return { investors, sips, funds };
};

const getDashboard = async (req, res) => {
  let conn;
  try {
    const userId = Number(req.user?.userId) || null;
    conn = await pool.getConnection();
    const payload = await getDashboardPayload(conn, userId);
    res.json({
      success: true,
      ...payload
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getPublicDashboard = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const payload = await getDashboardPayload(conn);
    res.json({
      success: true,
      ...payload
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public dashboard data"
    });
  } finally {
    if (conn) conn.release();
  }
};

export { getDashboard, getPublicDashboard };
