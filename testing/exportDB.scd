[1,2].asString

format("%", [1,2])

false.asString


~oboeMonoDB[0].asString

(
var f = File("~/Work/oboe/oboeJS/oboedb.js".standardizePath, "w");
f.write("var oboeMonoDB = [\n");
~oboeMonoDB.do({arg fing; f.write(fing.asString ++ ",\n")});
f.write("];\n");
f.close;
)