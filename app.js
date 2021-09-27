const express = require('express');
const fs = require('fs');
const bp = require("body-parser");
const app = express()
const port = process.env.PORT || 8000;
const _session_keyword = [];
const _symptoms = []
let req_count = 0;
app.get('/', (req, res) => {
  req_count = 0;
  res.sendFile('./client/index.html', { root: __dirname })
})
app.get('/data', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    res.send(JSON.parse(data));
    console.log(JSON.parse(data));
  })

  console.log(req_count);
})
app.use(bp.json());
app.post('/req', (req, res) => {
  console.log(_symptoms)
  console.log(req_count);
  __push_to_client(req, res);

})

app.listen(port, () => console.log(`port runing on port ${port}`));



// Sub routines
// Sub routines
// Sub routines
// Sub routines
// Sub routines
// Sub routines


const __push_to_client = (req, res) => {
  const _result = __analyze_word(req.body.data);
  switch (req_count) {
    case 0: __acquintance(); break;
    case 1: __cough_test(); break;
    case 2: __fever_test(); break;
    case 3: __breathing_test(); break;
  }
  function __acquintance() {
    _session_keyword.push(req.body.data);
    req_count++;
    
    res.send(res.json({ response: [`Hello there ${req.body.data}`, "How often do u experience cough ?"] }));

  }
 
  function __cough_test() {
    if (_result.length == 1) {
      const  intense  = _result[0].intense;
     intense ? _symptoms.push({ cough_test: intense }) : null
      req_count++;
      res.send(res.json({ response: ['Ok','How about fever ?'] }));
    }else{
      res.send(res.json({ response: [`Your response didn't seem clear enough`,`Do you mean you cough very often ?`] }));
    }
  }
  function __fever_test() {
    if (_result.length == 1) {
      const  intense  = _result[0].intense;
      intense ?  _symptoms.push({ fever_test: intense }) : null
      req_count++;
      res.send(res.json({ response: ['Alright','Any difficulty breathing ?'] }));
    }else{
      res.send(res.json({ response: [`Your response didn't seem clear enough`,`Do you mean you experience fever often ?`] }));
    }
  }
  function __breathing_test() {
    if (_result.length == 1) {
      const  intense  = _result[0].intense;
      intense ? _symptoms.push({ breathing_test: intense }) : null
      req_count++;
      __advice(_symptoms);
    }else{
      res.send(res.json({ response: [`Your response didn't seem clear enough`,`Do you mean you experience difficulty breathing ?`] }));
    }
  }
  function __advice(sym) {
    
    const result =[]
    if(sym.length == 0){
       result.push(`Congratulations, you tested negative to COVID`,'you seem to be taking good care of yourself keep it up','thank you for using this CLI')
    }else if(sym.length == 2){
      result.push('You are advised to visit any COVID testing center for a confirmatory test.','thank you for using this CLI')
    }else if(sym.length == 1){
       result.push('You tested negative','Ensure to always rest well','Excercise daily','Employ good diet','thank you for using this CLI')
    }else{
      result.push('You are advised to earnestly visit visit any COVID testing center for a confirmatory test.','thank you for using this CLI')
    }
    res.send(res.json({ response: result }));
  }
 
}

function __analyze_word(word) {
  word=word.toLowerCase();
  const word_array = word.split(' ');
  const data = JSON.parse(fs.readFileSync('./dictionary/brain.json').toString());
  const _intense = data.intense;
  const _less_intense = data.less_intense;
  let _result = []
  word_array.forEach((each) => {
    if (_intense.includes(each)) {
      _result.push({ intense: true })
    }
    if (_less_intense.includes(each)) {
      _result.push({ intense: false })
    }
  })

  return _result == [] ? null : _result

}