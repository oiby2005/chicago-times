const mysql = require("./node_modules/mysql2/promise");

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "wsj_db"
    });
    const [res] = await conn.query("UPDATE shorts SET video_url = ? WHERE id = ?", [
      "https://rumble.com/embed/v7e3gbk/",
      "video_slot_2"
    ]);
    console.log("MySQL updated successfully, affected rows:", res.affectedRows);
    await conn.end();
  } catch (e) {
    console.error("MySQL update error:", e.message);
  }
})();
