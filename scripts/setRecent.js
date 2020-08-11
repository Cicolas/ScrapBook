const storage = require('electron-json-storage');
storage.setDataPath("D:\\Nicolas\\Prog\\javascript\\notepad\\scripts");

function SetInitial() {
    let btns = document.getElementsByClassName("navButton");

    storage.get("cfg", function(error, data) {
        if (error) throw error;
        let d = JSON.parse(data);
        console.log(d.files);
        let titles = ["", "", "", "", "", "", "", "", "", ""];
        for (let i = 0; i < btns.length; i++) {
            if (d.files[i].title != undefined) {
                titles[i] = d.files[i].title;
            }
        }
        for (let i = 0; i < btns.length; i++) {
            if (titles[i] != "") {
                btns[i].innerHTML = titles[i];
            }
        }
    });
}

SetInitial();