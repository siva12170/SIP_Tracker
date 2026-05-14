import { pool } from "../config/db.js";

const createInvestor = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const authEmail = req.user?.email;
    if (!authUserId || !authEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const {
      first_name,
      last_name,
      phone,
      pan_number
    } = req.body;

    conn = await pool.getConnection();

    const [existing] = await conn.query(
      `
      SELECT investor_id
      FROM investors
      WHERE investor_id = ?
      LIMIT 1
      `,
      [authUserId]
    );

    if (existing.length > 0) {
      await conn.query(
        `
        UPDATE investors
        SET
          first_name = ?,
          last_name = ?,
          phone = ?,
          pan_number = ?
        WHERE investor_id = ?
        `,
        [first_name, last_name, phone, pan_number, authUserId]
      );

      return res.json({
        success: true,
        message: "Investor updated successfully",
        investorId: authUserId
      });
    }

    await conn.query(
      `
      INSERT INTO investors
      (
        investor_id,
        user_id,
        first_name,
        last_name,
        email,
        phone,
        pan_number
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        authUserId,
        authUserId,
        first_name,
        last_name,
        authEmail,
        phone,
        pan_number
      ]
    );

    res.status(201).json({
      success: true,
      message: "Investor created successfully",
      investorId: authUserId
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  } finally {
    if (conn) conn.release();
  }
};

const getInvestors = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    conn = await pool.getConnection();
    const [rows] = await conn.query(
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
      [authUserId]
    );
    res.json({
      success: true,
      investors: rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investors"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getInvestor = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { investorId } = req.params;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (Number(investorId) !== authUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
      SELECT *
      FROM investors
      WHERE investor_id = ?
      `,
      [investorId]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Investor not found"
      });
    }
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch investor"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getInvestorHoldings = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { investorId } = req.params;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (Number(investorId) !== authUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
      SELECT
          mf.fund_name,
          SUM(it.units_allocated) AS total_units,
          mf.latest_nav,
          ROUND(
            SUM(it.units_allocated) * mf.latest_nav,
            2
          ) AS current_value
      FROM investment_transactions it
      JOIN mutual_funds mf
          ON it.fund_id = mf.fund_id
      WHERE it.investor_id = ?
      GROUP BY mf.fund_id
      `,
      [investorId]
    );
    res.json({
      success: true,
      holdings: rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch holdings"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getInvestorNetWorth = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { investorId } = req.params;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    if (Number(investorId) !== authUserId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `
      SELECT
          ROUND(
            SUM(total_units * latest_nav),
            2
          ) AS net_worth
      FROM (
          SELECT
              mf.latest_nav,
              SUM(it.units_allocated) AS total_units
          FROM investment_transactions it
          JOIN mutual_funds mf
              ON it.fund_id = mf.fund_id
          WHERE it.investor_id = ?
          GROUP BY mf.fund_id
      ) holdings
      `,
      [investorId]
    );
    res.json({
      success: true,
      investor_id: investorId,
      net_worth: rows[0].net_worth
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to calculate net worth"
    });
  } finally {
    if (conn) conn.release();
  }
};

export { createInvestor, getInvestors, getInvestor, getInvestorHoldings, getInvestorNetWorth };