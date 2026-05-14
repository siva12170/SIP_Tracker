import { pool } from "../config/db.js";

const createFund = async (req, res) => {
  let conn;
  try {
    const {
      amc_id,
      fund_name,
      fund_type,
      category,
      latest_nav
    } = req.body;

    conn = await pool.getConnection();
    const [result] = await conn.query(
      `
      INSERT INTO mutual_funds
      (
        amc_id,
        fund_name,
        fund_type,
        category,
        latest_nav
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        amc_id,
        fund_name,
        fund_type,
        category,
        latest_nav
      ]
    );
    res.status(201).json({
      success: true,
      message: "Fund created successfully",
      fundId: Number(result.insertId)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to create fund"
    });
  } finally {
    if (conn) conn.release();
  }
};

const getFunds = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const [rows] = await conn.query(
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
    res.json({
      success: true,
      funds: rows
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch funds"
    });
  } finally {
    if (conn) conn.release();
  }
};

const updateFundNAV = async (req, res) => {
  let conn;
  try {
    const { fundId } = req.params;
    const { latest_nav } = req.body;
    conn = await pool.getConnection();

    await conn.query(
      `
      UPDATE mutual_funds
      SET latest_nav = ?
      WHERE fund_id = ?
      `,
      [latest_nav, fundId]
    );
    res.json({
      success: true,
      message: "NAV updated successfully"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Failed to update NAV"
    });
  } finally {
    if (conn) conn.release();
  }
};

export { createFund, getFunds, updateFundNAV };