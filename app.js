const express = require('express');
const app = express();

var path = require('path');
//app.use(express.static(__dirname+'./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('./public')));

// app.get('/', (req, res)=>{
//     res.sendFile('./public/index.html', { root: __dirname });
//   })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening on port 3000'));
