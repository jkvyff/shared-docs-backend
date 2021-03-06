const app = require("express")();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./queries");
const io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("new-operations", data => {
    io.emit(`new-remote-operations-${data.groupId}`, data);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    allRoutes: true,
    origin: "https://shared-docs-f3513.firebaseapp.com",
    methods: "GET, PUT, UPDATE"
  })
);

app
  .route("/docs")
  .get(db.getDocs)
  .post(db.addDoc);
app
  .route("/docs/:slug")
  .get(db.getOrAddBySlug)
  .put(db.updateDoc);

http.listen(process.env.PORT || 4000, () => {
  console.log("listening on *:4000");
});
