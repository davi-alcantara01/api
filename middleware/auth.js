const jwt = require("jsonwebtoken");
const secretKey = "misly";


module.exports = function auth(req, res, next) {
  const authToken = req.headers['authorization'];
  
  if(authToken != undefined) {
    const bearer = authToken.split(" ")
    const token = bearer[1];
    
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.status(401);
        res.json({error: "Token inválido"});
      } else {
        req.user = {
          id: data.id,
          email: data.email
        }
        res.status(200);
        console.log(res.user);
        next();
      }
    })

  } else {
    res.status(401);
    res.json({error: "Acesso não autorizado"})
  }
}