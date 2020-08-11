const { app, dialog } = require('electron').remote
var fs = require('fs');

let title = document.getElementById("title");

var actualPath = "undefined";

document.addEventListener("keydown", (event) => {
    if ((event.key == "S" || event.key == "s") && event.ctrlKey && event.shiftKey) {
        actualPath = undefined;
        save();
    } else if ((event.key == "S" || event.key == "s") && event.ctrlKey && !event.shiftKey) {
        save();
    }
    if (event.key == "o" && event.ctrlKey) {
        OpenLoad();
    }
})

function save() {
    let note = document.getElementById("note").value;
    let t = note.split("\n");

    title.innerHTML = t[0] + " ";
    getCfg(t[0], note);
    console.log(actualPath);
}

function getCfg(t, note) {
    storage.get("cfg", function(error, data) {
        if (error) throw error;
        write(t, JSON.parse(data), findIndex(JSON.parse(data)), note);
    });
}

function saveCfg(t, data, i, filename) {
    let d = data;

    d.savedPath = actualPath;
    d.files[i].title = t;
    d.files[i].path = filename;

    console.log("actualPath save: " + actualPath);

    storage.set("cfg", JSON.stringify(d), function(error) {
        if (error) throw error;
    })
    SetInitial();
}

function write(t, data, i, note) {
    let d = data;

    let p = data.files[i].path;

    console.log(p);
    if (actualPath == "" || actualPath == "undefined" || actualPath == undefined) {
        dialog.showSaveDialog({}).then(result => {
            filename = result.filePath;
            if (filename === undefined) {
                console.log('the user clicked the btn but didn\'t created a file');
                return;
            }
            fs.writeFile(filename, note, (error) => {
                if (error) throw error;
                console.log('WE CREATED YOUR FILE SUCCESFULLY ' + filename);
                saveCfg(t, data, i, filename);
            })
            actualPath = filename;
        });
        return;
    }
    fs.writeFile(actualPath, note, (error) => {
        if (error) throw error;
        console.log('WE SAVED YOUR FILE SUCCESFULLY ' + actualPath);
    });
    saveCfg(t, data, i, actualPath);
}

function findIndex(data) {
    let d = data;
    let n;

    console.log(d);

    for (let i = 0; i < d.files.length; i++) {
        if (d.files[i].path == actualPath || d.files[i].path == "") {
            n = i;
            return n;
        }
    }
}

function OpenLoad() {
    dialog.showOpenDialog({
        filters: [
            { name: 'Text', extensions: ['txt'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        filename = result.filePaths[0];
        if (filename === undefined) {
            console.log('the user clicked the btn but didn\'t created a file');
            console.log(result);
            return;
        }
        fs.readFile(filename, (error, data) => {
            if (error) throw error;
            console.log('WE READED YOUR FILE SUCCESFULLY ' + filename);
            let t = (data + " ").split("\n");

            title.innerHTML = t[0] + " ";
            document.getElementById("note").value = data;
        })
        actualPath = filename;
        console.log("actualPath load: " + actualPath);
    });
}

function LoadByNumber(number) {
    storage.get("cfg", function(error, data) {
        if (error) throw error;
        let d = JSON.parse(data);

        LoadByPath(d.files[number].path);
    });
}

function LoadByPath(path) {
    if (path == "default") {
        storage.get("cfg", function(error, data) {
            if (error) throw error;
            let d = JSON.parse(data);
            let filename = d.savedPath;

            fs.readFile(filename, (error, data) => {
                if (error) throw error;
                console.log('WE READED YOUR FILE SUCCESFULLY ' + filename);
                let t = (data + " ").split("\n");

                title.innerHTML = t[0] + " ";
                document.getElementById("note").value = data;
            })
            actualPath = filename;
        });
    } else {
        fs.readFile(path, (error, data) => {
            if (error) throw error;
            console.log('WE READED YOUR FILE SUCCESFULLY ' + path);
            let t = (data + " ").split("\n");

            title.innerHTML = t[0] + " ";
            document.getElementById("note").value = data;
        })
        actualPath = path;
    }
}

LoadByPath("default");

function Quit() {
    app.quit();
}