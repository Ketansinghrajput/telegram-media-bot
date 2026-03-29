const fs = require("fs");

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted temp file: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Failed to delete file: ${filePath}`, err.message);
  }
}

module.exports = { deleteFile };
