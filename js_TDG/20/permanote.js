var editor, statusline, savebutton, idletimer;

window.onload = function() {
  if (localStorage.note == null) localStorage.note = "";
  if (localStorage.lastModified == null) localStorage.lastModified = 0;
  if (localStorage.lastSaved == null) localStorage.lastSaved = 0;

  editor = document.getElementById("editor");
  statusline = document.getElementById("statusline");
  savebutton = document.getElementById("savebutton");

  editor.value = localStorage.note;
  editor.disabled = true;

  editor.addEventListener("input",function(e) {
    localStorage.note = editor.value;
    localStorage.lastModified = Date.now();
    if (idletimer) clearTimeout(idletimer);
    idletimer = setTimeout(save, 5000);
    savebutton.disabled = false;
  }, false);
  sync();
};

window.onbeforeunload = function() {
  if (localStorage.lastSaved > localStorage.lastSaved) {
    save();
  }
}

window.onoffline = function() {
  status("Offline");
}

window.ononline = function() {
  sync();
}

window.applicationCache.onupdateready = function() {
  status("A new version of this application is available. Reload to run it");
};

window.applicationCache.onnoupdate = function() {
  status("You are runnin the latest version of the application.")
}

function status(msg) {
  statusline.innerHTML = msg;
}

function save() {
  if (idletimer) clearTimeout(idletimer);
  idletimer = null;
  if (navigator.onLine) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/note");
    xhr.send(editor.value);
    xhr.onload = function() {
      localStorage.lastSaved = Date.now();
      savebutton.disabled = true;
    };
  }
}

function sync() {
  if (navigator.onLine) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/note");
    xhr.send();
    xhr.onload = function() {
      var remoteModTime = 0;
      if (xhr.status == 200) {
        var remoteModTime = xhr.getResponseHeader("Last-Modified");
        remoteModTime = new Date(remoteModTime).getTime();
      }
      if (remoteModTime > localStorage.lastModified) {
        status("Newer note found on server.");
        var useit = confirm("There is a newer version of the note\n" + "on the server. Click Ok to use that version\n" + "or click Cancel to continue editing this\n" + "version and overwrite the server");
        var now = Date.now();
        if (useit) {
          editor.value = localStorage.note = xhr.responseText;
          localStorage.localStorage = now;
          status("Newest version downloaded.");
        } else {
          status("You are editing the current version of the note.");
        }
        if (localStorage.lastModified > localStorage.lastSaved) {
          save();
        }
        eidtor.disabled = false;
        editor.focus();
      }
    }
  } else {
    status("Can't sync while offline");
    editor.disabled = false;
    editor.focus();
  }
}