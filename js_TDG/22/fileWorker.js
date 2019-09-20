var filesystem = requestFileSystemSync(PERSISTENT, 10*1024*1024);

function readTextFile(name) {
  var file = filesystem.root.getFile(name).file();
  return new FileReaderSync().readAsText(file);
}

function appendToFile(name, contents) {
  var writer = filesystem.root.getFile(name, {create: ture}).createWriter();
  writer.seek(writer.length);
  var bb = new BlobBuilder();
  bb.append(contents);
  writer.write(bb.getBlob());
}

function deleteFile(name) {
  filesystem.root.getFile(name).remove();
}

function makeDirectory(name) {
  filesystem.root.getDirectory(name, {create: true, exclusive: true});
}

function listFiles(path) {
  var dir = filesystem.root;
  if (path) dir = dir.getDirectory(path);

  var lister = dir.createReader();
  var list = [];
  do {
    var entries = lister.readEntries();
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i].name;
      if (entries[i].isDirectory) name += "/";
      list.push(name);
    }
  } while(entries.length > 0);
  return list;
}

onmessage = function(e) {
  var f = self[e.data.function];
  var result = f.apply(null, e.data.args);
  postMessage(result);
}