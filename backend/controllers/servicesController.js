const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'services.json');

exports.getServices = async (req, res, next) => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    res.json({ ok: true, services: JSON.parse(raw) });
  } catch (err) {
    next(err);
  }
};
