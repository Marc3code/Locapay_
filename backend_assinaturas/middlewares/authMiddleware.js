const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: "Token não fornecido" });

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seu_segredo_jwt");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
};
