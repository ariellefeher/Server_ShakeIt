const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 4000;
const mongo_db_url = 'mongodb+srv://arielleandmayan:Milab123@lets-shake-it.ldwjdzp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongo_db_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db_name = "LetsShakeIt";
const user_collection = "Users";
const cocktail_collection = "Cocktail-Recipes";
const kit_collection = "Kits";
const lesson_collection = "Lessons";
const trivia_collection = "Trivia";

app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`Connected to port ${port} woohoo!`);
});

//1. Fetching the Kits (after QR Code scanner)
app.get('/kit', async (req, res) => {
  console.log("Kit Request Received!");
  let kitName = req.query.name;

  console.log("Kit Name: " + kitName);
  client.connect().then(async() => {
    const info = client.db(db_name).collection(kit_collection);
    const kit = await info.findOne({kit_name: kitName });
    
    if (kit != null) {
      console.log("Kit Found in DB!");
      // console.log("Kit Name: " + kit.kit_name, "Recipes: " + kit.recipes + "items_in_kit: " + kit.items_in_kit);
      return res.json({kit_name: kit.kit_name, recipes: kit.recipes, lessons: kit.lessons, items_in_kit: kit.items_in_kit, trivia: kit.trivia, success: true});
    } else {
      console.log("Kit Not Found in DB ! :(");
      return res.json({ success: false, message: "Kit Not Found" });
    }
  });
});


// 2. Fetching Cocktail Recipies
app.get('/cocktail', async (req, res) => {
  console.log("Cocktail Request Received!");
  let cocktailName = req.query.name;

  console.log("Cocktail Name: " + cocktailName);
  client.connect().then(async() => {
    const info = client.db(db_name).collection(cocktail_collection);
    const cocktail = await info.findOne({cocktail_name: cocktailName });
    
    if (cocktail != null) {
      console.log("Cocktail Found in DB!");
      // console.log("Cocktail Name: " + cocktail.cocktail_name, "Steps: " + cocktail.steps);
      return res.json({cocktail_name: cocktail.cocktail_name, ingredients: cocktail.ingredients, steps: cocktail.steps, success: true});
    } else {
      console.log("Cocktail Not Found in DB ! :(");
      return res.json({ success: false, message: "Cocktail Not Found" });
    }
  });
});


// 3. Fetching Lessons
app.get('/lesson', async (req, res) => {
  console.log("Lesson Request Received!");
  let lessonName = req.query.name;

  console.log("Lesson Name: " + lessonName);
  client.connect().then(async() => {
    const info = client.db(db_name).collection(lesson_collection);
    const lesson = await info.findOne({lesson_name: lessonName });
    
    if (lesson != null) {
      console.log("Lesson Found in DB!");
      // console.log("Lesson Name: " + lesson.lesson_name, "Steps: " + lesson.steps);
      return res.json({lesson_name: lesson.lesson_name, steps: lesson.steps, success: true});
    } else {
      console.log("Lesson Not Found in DB ! :(");
      return res.json({ success: false, message: "Lesson Not Found" });
    }
  });
});

//4. Fetching Trivia
app.get('/trivia', async (req, res) => {
  console.log("Trivia Request Received!");
  let triviaName = req.query.name;

  console.log("Trivia Name: " + triviaName);
  client.connect().then(async() => {
    const info = client.db(db_name).collection(trivia_collection);
    const trivia = await info.findOne({trivia_name: triviaName });
    
    if (trivia != null) {
      console.log("Trivia Found in DB!");
      // console.log("Trivia Name: " + trivia.trivia_name, "Tools: " + trivia.tools, "Definitions: " + trivia.definitions);
      return res.json({trivia_name: trivia.trivia_name, tools: trivia.tools, definitions: trivia.definitions, success: true});
    } else {
      console.log("Trivia Not Found in DB ! :(");
      return res.json({ success: false, message: "Trivia Not Found" });
    }
  });
});


/*A. User Registration */
app.post("/signup", async (req, res) => {
  let username = req.query.username;
  let password = req.query.password;
  //let email = req.query.email;
  //let university = req.query.university;
  console.log("Input - Username: "+username + ", Password: "+password);
    client.connect().then(async() => {
      const info = client.db(db_name).collection(user_collection);
      const existingUser = await info.findOne({username: username});
      
      if(existingUser != null) {
        console.log("Username Already Exists");
        return res.json({ success: false, error: 'Username already exists' });
      }
      //If No Username Exists in the DB already
      const newUser = await info.insertOne({username: username, password : password,study_reservations: [] });
      
      console.log("User Successfully Registered in DB!" + username + " with Password: "+ password);
      return res.json({username: username, password: password, success: true});
    });
});
/*B. User Login */
app.get("/login", async(req, res) => {
  let username = req.query.username;
  let password = req.query.password;
  console.log("Input - Username: "+username + ", Password: "+password);
    client.connect().then(async() => {
      const info = client.db(db_name).collection(user_collection);
      const user = await info.findOne({username: username});
       
      if (user == null) {
        console.log("User Not Found");
        return res.json({ success: false, message: "Invalid login credentials" });
      }
      console.log("Found user in DB!! " + user.username + " The Password in DB: "+ user.password);
      
      if( password == user.password) {
        console.log("Login Success!!!");
        
        return res.json({ username: username, password: password, success: true}); 
      }
      else {
        console.log("Passwords don't match");
        return res.json({ success: false, message: "Invalid login credentials" });
      }
           
    }); 
});

