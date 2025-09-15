const express = require("express");
const path = require("path");

const app = express();

let notes = {};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    const files = Object.keys(notes);
    res.render("index", {files: files});
});

app.get("/file/:filename", (req, res) => {
    const filename = req.params.filename;
    const filedata = notes[filename] || "File not found";
    res.render("show", {filename: filename, filedata: filedata});
});

app.post("/create", (req, res) => {
    const filename = req.body.title.split(' ').join('');
    notes[filename] = req.body.details;
    res.redirect("/");
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", notes: Object.keys(notes) });
});

module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
