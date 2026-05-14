import { pool } from "../config/db.js";

const createSIP = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const {
      portfolio_id,
      fund_id,
      sip_amount,
      sip_date,
      start_date
    } = req.body;

    conn = await pool.getConnection();

    const [investorRows] = await conn.query(
      `
      SELECT investor_id
      FROM investors
      WHERE investor_id = ?
      LIMIT 1
      `,
      [authUserId]
    );

    if (investorRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Investor profile not found for logged-in user"
      });
    }

    if (portfolio_id != null) {
      const [portfolioRows] = await conn.query(
        `
        SELECT portfolio_id
        FROM portfolios
        WHERE portfolio_id = ?
          AND investor_id = ?
        LIMIT 1
        `,
        [portfolio_id, authUserId]
      );

      if (portfolioRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid portfolio for logged-in user"
        });
      }
    }

    const [result] = await conn.query(
      `
      INSERT INTO sips
      (
        investor_id,
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
      `,
      [
        authUserId,
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date
      ]
    );
    res.status(201).json({
      success: true,
      message: "SIP registered successfully",
      sipId: Number(result.insertId)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to create SIP"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getSIPs = async (req, res) => {
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
      [authUserId]
    );
    res.json({
      success: true,
      sips: rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SIPs"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getSIP = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { sipId } = req.params;
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
          s.*,
          mf.fund_name
      FROM sips s
      JOIN mutual_funds mf
          ON s.fund_id = mf.fund_id
      WHERE s.sip_id = ?
        AND s.investor_id = ?
      `,
      [sipId, authUserId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "SIP not found"
      });
    }

    res.json({
      success: true,
      sip: rows[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SIP"
    });
  } finally {
    if (conn) conn.release();
  }
};

const processSIP = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { sipId } = req.params;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();
    const [sipRows] = await conn.query(
      `
      SELECT *
      FROM sips
      WHERE sip_id = ?
        AND investor_id = ?
      `,
      [sipId, authUserId]
    );
    if (sipRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "SIP not found"
      });
    }
    const sip = sipRows[0];
    const [fundRows] = await conn.query(
      `
      SELECT latest_nav
      FROM mutual_funds
      WHERE fund_id = ?
      `,
      [sip.fund_id]
    );
    const latestNAV = fundRows[0].latest_nav;
    const unitsAllocated = sip.sip_amount / latestNAV;
    await conn.query(
      `
      INSERT INTO investment_transactions
      (
        sip_id,
        investor_id,
        fund_id,
        nav,
        amount,
        units_allocated,
        transaction_date,
        transaction_type
      )
      VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'SIP')
      `,
      [
        sip.sip_id,
        sip.investor_id,
        sip.fund_id,
        latestNAV,
        sip.sip_amount,
        unitsAllocated
      ]
    );
    await conn.commit();
    res.json({
      success: true,
      message: "SIP installment processed successfully",
      nav: latestNAV,
      amount: sip.sip_amount,
      units_allocated: unitsAllocated
    });
  } catch (err) {
    console.log(err);
    if (conn) await conn.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to process SIP"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getSIPTransactions = async (req, res) => {
  let conn;
  try {
    const authUserId = Number(req.user?.userId);
    const { sipId } = req.params;
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
          transaction_id,
          amount,
          nav,
          units_allocated,
          transaction_date
      FROM investment_transactions it
      JOIN sips s
        ON it.sip_id = s.sip_id
      WHERE it.sip_id = ?
        AND s.investor_id = ?
      ORDER BY transaction_date DESC
      `,
      [sipId, authUserId]
    );
    res.json({
      success: true,
      transactions: rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions"
    });
  } finally {
    if (conn) conn.release();
  }
};

export { createSIP, getSIPs, getSIP, processSIP, getSIPTransactions };