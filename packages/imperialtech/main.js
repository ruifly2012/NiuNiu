"use strict";
var path = require("path");
var fs = require("fs");

function onBeforeBuildFinish(options, callback) 
{
    Editor.log("imperialtech: Building " + options.platform + " to " + options.dest);

    let d = new Date();
    let year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let hours = '' + d.getHours();
    let minutes = '' + d.getMinutes();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    let version = year + month + day + "_" + hours + minutes;

    let mainJsPath = path.join(options.dest, "main.js");
    let script = fs.readFileSync(mainJsPath, "utf8");
    script += "\n" + "window.version = \'v" + version + "\';";  // TODO: replace with version number.
    script += "\n" +"console.log = function() {}";
    script += "\n" + "console.info = function() {}";
    script += "\n" + "console.error = function() {}";
    script += "\n" + "console.debug = function() {}";
    script += "\n" + "console.trace = function() {}";
    script += "\n" + "console.exception = function() {}";
    script += "\n" + "console.timeEnd = function() {}";
    script += "\n" + "console.time = function() {}";
    script += "\n" + "console.warn = function() {}";
    fs.writeFileSync(mainJsPath, script);

    Editor.log("version: " + version);

    callback();
}

module.exports = 
{
    load() 
    {
      Editor.Builder.on("before-change-files", onBeforeBuildFinish);
    },
        
    unload() 
    {
      Editor.Builder.removeListener("before-change-files", onBeforeBuildFinish);
    },
        
    // register your ipc messages here
    messages: {
      "open" () {
        // open entry panel registered in package.json
        Editor.Panel.open("package-template");
      },
      "say-hello" () {
        Editor.log("imperialtech Hello World!");
        // send ipc message to panel
        Editor.Ipc.sendToPanel("package-template", "package-template:hello");
      },
      "clicked" () {
        Editor.log("imperialtech Button clicked!");
      }
    },
};