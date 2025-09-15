const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const filesDir = path.join(__dirname, 'files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

app.get("/", (req, res) => {
    fs.readdir(`./files`, function(err, files) {
        if (err) {
            console.error('Error reading files directory:', err);
            files = [];
        }
        res.render("index", {files: files || []});
    });
});

app.get("/file/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error('Error reading file:', err);
            filedata = "File not found or error reading file";
        }
        res.render("show", {filename: req.params.filename, filedata: filedata});
    });
});

app.post("/create", (req, res) => {
    const filename = req.body.title.split(' ').join('');
    fs.writeFile(`./files/${filename}`, req.body.details, function(err) {
        if (err) {
            console.error('Error writing file:', err);
        }
        res.redirect("/");
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
