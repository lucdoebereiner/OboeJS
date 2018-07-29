// Lilypond Output, these are all private methods

Array.prototype.collectWithPrevious = function(fun) {
    var prev;
    var result = [];
    var i = 0;
    while (i < this.length) {
	result.push(fun(prev,this[i]));
	prev = this[i];
	i = i + 1;
    };
    return result;
};


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.lilyInRed = function() {
    return (" \\with-color #red {" + this + "}");
};


String.prototype.lilyInBlue = function() {
    return (" \\with-color #blue {" + this + "}");
};

String.prototype.lilyStrikethrough = function() {
    if (this.length == 2) {
	return (" \\concat{" + this[0] + " \\fontsize #2 { \\bold { \\char ##x0337 }} "
		+ this[1] + "}");
    } else {
	return (" \\concat{" + this + " \\fontsize #2 { \\bold { \\char ##x0337 }} }");
    }
};

String.prototype.lilyStrikethrough338 = function() {
    if (this.length == 2) {
	return (" \\concat{" + this[0] + " \\fontsize #2 { \\bold { \\char ##x0338 }} "
		+ this[1] + "}");
    } else {
	return (" \\concat{" + this + " \\fontsize #2 { \\bold { \\char ##x0338 }} }");
    }
};

String.prototype.lilyBlueStrikethrough = function() {
    return this.lilyStrikethrough().lilyInBlue();
};

String.prototype.lilyBlueStrikethrough338 = function() {
    return this.lilyStrikethrough338().lilyInBlue();
};

function inexactToExact(value) {
    let sign = Math.sign(value);
    if (sign == 0) {
	return 0;
    } else if (sign == 1) {
	return Math.floor(value);
    } else  {
	return Math.floor(value) + 1;
    };
}

function reduceInterval(value) {
    let exactAbs = Math.abs(inexactToExact(value));
    return (((exactAbs % 12) + (Math.abs(value) - exactAbs)) * Math.sign(value));
}



function lilyMidiToLily(midi,inbetween = "") {
    let reduced = reduceInterval(midi);
    let oct = Math.floor(midi / 12);
    let octave,pclass;
    if (reduced == 11.75) {oct = oct+1;};
    switch(oct) {
    case 1:
	octave = ",,,";
	break;
    case 2:
	octave = ",,";
	break;
    case 3:
	octave = ",";
	break;
    case 4:
	octave = "";
	break;
    case 5:
	octave = "'";
	break;
    case 6:
	octave = "''";
	break;
    case 7:
	octave = "'''";
	break;
    case 8:
	octave = "''''";
	break;
    case 9:
	octave = "'''''";
	break;
    };
    let pitchStrings = [
	inbetween + " c",
	"naturalArrowup".lilyArrow()  + inbetween + " cih",
	inbetween + " cih",
	"sharpArrowdown".lilyArrow()  + inbetween + " cih",
	inbetween + " cis",
	"sharpArrowup".lilyArrow() + inbetween + " cis",
	inbetween + " deh",
	"naturalArrowdown".lilyArrow() + inbetween + " deh" ,
	inbetween + " d" ,
	"naturalArrowup".lilyArrow() + inbetween + " dih" ,
	inbetween + " dih",
	"sharpArrowdown".lilyArrow() + inbetween + " dis" ,
	inbetween + " dis" ,
	"sharpArrowup".lilyArrow() + inbetween + " dis" ,
	inbetween + " eeh" ,
	"naturalArrowdown".lilyArrow() + inbetween + " eeh" ,
	inbetween + " e" ,
	"naturalArrowup".lilyArrow() + inbetween + " eis" ,
	inbetween + " eih" ,
	"naturalArrowdown".lilyArrow() + inbetween + " feh" ,
	inbetween + " f" ,
	"naturalArrowup".lilyArrow() + inbetween + " fih" ,
	inbetween + " fih" ,
	"sharpArrowdown".lilyArrow() + inbetween + " fis" ,
	inbetween + " fis" ,
	"sharpArrowup".lilyArrow() + inbetween + " fih" ,
	inbetween + " geh" ,
	"naturalArrowdown".lilyArrow() + inbetween + " geh" ,
	inbetween + " g",
	"naturalArrowup".lilyArrow() + inbetween + " gih",
	inbetween + " gih" ,
	"sharpArrowdown".lilyArrow() + inbetween + " gis",
	inbetween + " gis",
	"sharpArrowup".lilyArrow() + inbetween + " gis" ,
	inbetween + " aeh" ,
	"naturalArrowdown".lilyArrow() + inbetween + " aeh" ,
	inbetween + " a",
	"naturalArrowup".lilyArrow() + inbetween + " aih" ,
	inbetween + " aih" ,
	"sharpArrowdown".lilyArrow() + inbetween + " ais",
	inbetween + " ais",
	"sharpArrowup".lilyArrow() + inbetween + " ais" ,
	inbetween + " beh" ,
	"naturalArrowdown".lilyArrow() + inbetween + " beh",
	inbetween + " b" ,
	"naturalArrowup".lilyArrow() + inbetween + " bih" ,
	inbetween + " bih",
	"naturalArrowdown".lilyArrow() + inbetween + " ceh"];
    pclass = pitchStrings[reduced*4];
    return String(pclass) + String(octave) + "!";
}



String.prototype.lilyArrow = function() {
    let pattern = {
	"sharpArrowdown":
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.sharp.arrowdown\"} ",
	"sharpArrowup":
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.sharp.arrowup\"} ",
	"naturalArrowup":
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.natural.arrowup\"} ",
	"naturalArrowdown": 
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.natural.arrowdown\"} ",
	"flatArrowdown":
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.flat.arrowdown\"} ",
	"flatArrowup":
	" \\tweak Accidental.stencil #ly:text-interface::print \\tweak Accidental.text \\markup {\\musicglyph #\"accidentals.flat.arrowup\"} "
    };
    return pattern[this];
};


function lilyAddAdditionalKey(sym, oldKeys, keys, withRed, defaultValue, mainOld) {
    let str = sym.capitalize();
    //("keys: " ++ keys.asString).postln;
    //("this: " ++ str).postln;
    if (withRed && keys.includes(sym) && !oldKeys.includes(sym) && (mainOld.length >  0)) {
	return str.lilyInRed();
    } else if (withRed && !keys.includes(sym) && oldKeys.includes(sym)) {
	return str.lilyBlueStrikethrough338();
    } else if (keys.includes(sym)) {
	return (str + " ");
    } else  {
	return defaultValue;
    }
}



function lilyAddAdditionalKeyString(str, sym, oldKeys, keys, withRed, defaultVal, mainOld) {
    if (withRed && keys.includes(sym) && !oldKeys.includes(sym)  && (mainOld.length > 0)) {
	return str.lilyInRed();
    } else if (withRed && !keys.includes(sym) && oldKeys.includes(sym))  {
	return str.lilyBlueStrikethrough338();
    } else if (keys.includes(sym)) {
	return (str + " ");
    } else {
	return defaultVal;
    }
}



// this mainFingersOld
function lilySelectColorMain(mainFingersOld, mainFingers, i) {
    //("old: " ++ mainFingersOld.asString).postln;
    //("new: " ++ mainFingers.asString).postln;
    if ((mainFingers.length > 0) && (mainFingersOld.length > 0)) {
	if ((mainFingers[i] == "o") && (mainFingersOld[i] != "o")) {
	    return "\\tweak #'color #blue ";
	} else if ((mainFingers[i] == "h") && (mainFingersOld[i] == "x")) {
	    return "\\tweak #'color #blue ";
	} else if  (mainFingers[i] != mainFingersOld[i]) { 
	    return "\\tweak #'color #red ";
	} else {
	    return " ";
	}
    } else {
	return " ";
    }
}

	// this octOld
function lilyMainFingersUpperChordString(octOld, upOld, oct, up, withRed) {
    var mainFingers = up.filter(el => ["o","h","x"].includes(el)); 
    var additional = up.filter(el => !["o","h","x"].includes(el));
    var mainFingersOld = upOld.filter(el => ["o","h","x"].includes(el));
    var additionalOld = upOld.filter(el => !["o","h","x"].includes(el));
    let main1;
    let main2;
    let main3;
    switch (mainFingers[0]) {
    case "o":
	main1 = "\\headOpen c''' ";
	break;
    case "h":
	main1 = "\\headHalf c''' ";
	break;
    case "x":
	main1 = "\\headClosed c''' ";
	break;
    };

    switch (mainFingers[1]) {
    case "o":
	main2 = "\\headOpen g'' ";
	break;
    case "h":
	main2 = "\\headHalf g'' ";
	break;
    case "x":
	main2 = "\\headClosed g'' ";
	break;
    };

    
    switch (mainFingers[2]) {
    case "o":
	main3 = "\\headOpen d'' ";
	break;
    case "h":
	main3 = "\\headHalf d'' ";
	break;
    case "x":
	main3 = "\\headClosed d'' ";
	break;
    };
    
    return (lilyMakeUpperAdditionalKeysString(additionalOld,additional,mainFingersOld,withRed) +
	    "<" +
	    lilySelectColorMain(mainFingersOld,mainFingers,0) + main1 +
	    lilySelectColorMain(mainFingersOld,mainFingers,1) + main2 +
	    lilySelectColorMain(mainFingersOld,mainFingers,2) + main3 +
	  "-\\rightHandFinger #1 " + ">" +
	    lilyMakeOctString(octOld,oct, withRed) + "\n");
}


function lilyMainFingersLowerChordString(lowOld,low, withRed) {
    var mainFingers = low.filter(el => ["o","h","x"].includes(el));
    var additional = low.filter(el => !["o","h","x"].includes(el));
    var mainFingersOld = lowOld.filter(el => ["o","h","x"].includes(el));
    var additionalOld = lowOld.filter(el => !["o","h","x"].includes(el));
    let main1;
    let main2;
    let main3;

    switch (mainFingers[0]) {
    case "o":
	main1 = "\\headOpen e' ";
	break;
    case "h":
	main1 = "\\headHalf e' ";
	break;
    case "x":
	main1 = "\\headClosed e' ";
	break;
    };

    switch (mainFingers[1]) {
    case "o":
	main2 = "\\headOpen b ";
	break;
    case "h":
	main2 = "\\headHalf b ";
	break;
    case "x":
	main2 = "\\headClosed b ";
	break;
    };

    switch (mainFingers[2]) {
    case "o":
	main3 = "\\headOpen f ";
	break;
    case "h":
	main3 = "\\headHalf f ";
	break;
    case "x":
	main3 = "\\headClosed f ";
	break;
    };
    return (lilyMakeLowerAdditionalKeysString(additionalOld,additional,mainFingersOld,withRed) +
	    "<" +
	    lilySelectColorMain(mainFingersOld,mainFingers,0) +
	    main1 + "-\\rightHandFinger #1 " +
	    lilySelectColorMain(mainFingersOld,mainFingers,1) +
	    main2 +
	    lilySelectColorMain(mainFingersOld,mainFingers,2) +
	    main3 + ">\n");
}

function lilyPitchListToChord(pitchList) {
    var result = " <";
    for (let p of pitchList) {
	let sizeString;
	switch (p[1]) {
	case 1:
	    sizeString = " \\tweak font-size #-4 ";
	    break;
	case 2:
	    sizeString = " \\tweak font-size #-1 ";
	    break;
	case 3:
	    sizeString = " \\tweak font-size #+1 ";
	    break;
	case 4:
	    sizeString = " \\tweak font-size #+3 ";
	    break;
	};
	result = result + lilyMidiToLily(p[0],sizeString);
    };
    return (result + ">\n ");
}

function lilyMakeOctString(oldOct, oct, withRed) {
    var firstString = "";
    var secondString = "";
    var thirdString = "";
    if (oct.includes(2)) {
	secondString = "^\\markup{ \\translate #'(1 . -1) \\fontsize #-3 " +
	    ((withRed && oldOct.includes(2).not) ? ("\\char ##x2510 ".lilyInRed() + "}") : "\\char ##x2510 }");
    } else if (withRed && oldOct.includes(2)) {
	secondString = "^\\markup{ \\translate #'(1 . -1) \\fontsize #-3 " +
	    "\\char ##x2510 ".lilyBlueStrikethrough() + "}";
    } else {
	secondString = "";
    };

    if (oct.includes(1)) {
	if (withRed) {
	    if (oldOct.includes(1)) {
		firstString = "1.";
	    } else {
		firstString = "1.".lilyInRed();
	    }
	} else {
	    firstString = "1.";
	}
    } else {
	if (oldOct.includes(1)) {
	    firstString = "1.".lilyBlueStrikethrough() + " ";
	}
    };

    

    if (oct.includes(3)) {
	if (withRed) {
	    if (oldOct.includes(3)) {
		firstString = "3.";
	    } else {
		thirdString = "3.".lilyInRed();
	    }
	} else {
	    thirdString = "3.";
	}
    } else {
	if (oldOct.includes(3)) {
	    thirdString = "3.".lilyBlueStrikethrough();
	}
    };
    
    return (secondString +
	    "^\\markup{ \\translate #'(0.5 . 1) \\fontsize #-6 {\\center-align " +
	    (((firstString != "") && (thirdString != "")) ? 
	     ("\\concat{" + firstString + " " + thirdString + "}}} ") :
	     ("\\concat{" + firstString + thirdString + "}}} "))
	   );
}

function lilyMakeUpperAdditionalKeysString(oldKeys, keys, mainOld, redChanges) {
    var bottomKeys = keys.filter(k => !((k == "dtrill") || (k == "cistrill")));
    let dtrill, cistrill, additional;

    if (redChanges && keys.includes("dtrill") && !oldKeys.includes("dtrill")) {
	dtrill = "\"-D\" ".lilyInRed();
    } else if (redChanges && !keys.includes("dtrill") && oldKeys.includes("dtrill")) {
	dtrill = "\"-D\" ".lilyBlueStrikethrough338();
    } else if (keys.includes("dtrill")) {
	dtrill = "\"-D\" ";
    } else {
	dtrill = "\" \" ";
    };

    if (redChanges && keys.includes("cistrill") && !oldKeys.includes("cistrill")) {
	cistrill = "\"-C#\" ".lilyInRed();
    } else if (redChanges && !keys.includes("cistrill") && oldKeys.includes("cistrill")) {
	cistrill = "\"-C#\" ".lilyBlueStrikethrough338();
    } else if (keys.includes("cistrill")) {
	cistrill = "\"-C#\" ";
    } else {
	cistrill = "\" \" ";
    };


    if ( (bottomKeys.length == 0) &&
	 (oldKeys.filter(k => !((k == "dtrill") || (k == "cistrill"))).length == 0)) {
	additional = "\" \"";
    } else {
	additional = (lilyAddAdditionalKey("ab",oldKeys,bottomKeys,redChanges,"",mainOld) +
		      lilyAddAdditionalKey("eb",oldKeys,bottomKeys,redChanges,"",mainOld) +
		      lilyAddAdditionalKey("b",oldKeys,bottomKeys,redChanges,"",mainOld) +
		      lilyAddAdditionalKey("bb",oldKeys,bottomKeys,redChanges,"",mainOld) +
		      lilyAddAdditionalKey("f",oldKeys,bottomKeys,redChanges,"",mainOld));
    };
		    
    return (`\\once \\override TextScript.outside-staff-priority = ##f
		\\override StrokeFinger.font-shape = #'upright
		\\override StrokeFinger #'text = \\markup{\\override #'(baseline-skip . 2.2)
		\\fontsize #-3 \\bold \\column{  
		${dtrill}
		${cistrill}
		\\override #'(baseline-skip . 0.8) \\column{ 
                ${additional}
			
}}}
\\override StrokeFinger.extra-offset = #'(-0.5 . 0.3)
\\override Stem.transparent = ##t\n`
	   );
}



function lilyMakeLowerAdditionalKeysString(oldKeys,keys, mainOld, redChanges) {
    let ckey,ciskey,additional;

    if (keys.includes("c") || oldKeys.includes("c")) {
	if ( !(keys.includes("f") || oldKeys.includes("f")) &&
	     !(keys.includes("dtrill") || oldKeys.includes("dtrill")) &&
	     !(keys.includes("ab") || oldKeys.includes("ab"))) {
	    ckey = "\" \" ";
	} else {
	    ckey = "";
	};
	ckey = ckey + lilyAddAdditionalKey("c", oldKeys,keys,redChanges,"\" \" ",mainOld);
    } else {
	ckey = "";
    };


    if (keys.includes("cis") || oldKeys.includes("cis")) {
	if ( !(keys.includes("f") || oldKeys.includes("f")) &&
	     !(keys.includes("c") || oldKeys.includes("c")) &&
	     !(keys.includes("eb") || oldKeys.includes("eb"))) {
	    ciskey = "\" \" ";
	} else {
	    ciskey = "";
	};
	ciskey = ciskey + lilyAddAdditionalKeyString("\"C#\" ","cis",oldKeys,keys,redChanges,"\" \" ",mainOld);
    } else {
	ciskey = "";
    };

    if (keys.includes("eb") || oldKeys.includes("eb")) {
	additional = lilyAddAdditionalKey("eb",oldKeys,keys,redChanges,"\" \" ",mainOld);
    } else if (!(keys.includes("c") || oldKeys.includes("c")) &&
	       !(keys.includes("eb") || oldKeys.includes("eb"))) {
	additional = "\" \" ";
    } else {
	additional = "";
    };
    
    return (`\\override StrokeFinger.font-shape = #'upright
\\override StrokeFinger #'text = \\markup{\\override #'(baseline-skip . 2.3)
  \\fontsize #-3 \\bold \\column{  
		${lilyAddAdditionalKey("ab",oldKeys,keys,redChanges,"",mainOld)}
		${lilyAddAdditionalKeyString("Ab-","abtrill",oldKeys,keys,redChanges,"\" \" ",mainOld)}
			${lilyAddAdditionalKeyString("D-","dtrill",oldKeys,keys,redChanges, 
(keys.includes("ab") || oldKeys.includes("ab")) ? "" :  "\" \" ",mainOld)} 
		${lilyAddAdditionalKeyString("F","f",oldKeys,keys,redChanges,"\" \" ",mainOld)}
${ckey} ${ciskey} ${additional}
  }}
\\override Stem.transparent = ##t
			\\override StrokeFinger.extra-offset = #'(${(keys.includes("abtrill") ? "-3.4 " : "-3.15 ")} . -1.6)\n`);
}


function lilyFileHeader() {
	 return `\\version \"2.18.0\"



headOpen =
#(define-music-function
     (parser location note)
     (ly:music?)
   #{
\\tweak  NoteHead.stencil #ly:text-interface::print
\\tweak NoteHead.text #(markup  #:fontsize -2 #:char #x25CB)
#note
	#})


headClosed   =
#(define-music-function
     (parser location note)
     (ly:music?)
   #{

\\tweak NoteHead.stencil #ly:text-interface::print
\\tweak NoteHead.text #(markup  #:fontsize -2 #:char #x25CF)
#note
	#})

headHalf   =
#(define-music-function
     (parser location note)
     (ly:music?)
   #{

\\tweak NoteHead.stencil #ly:text-interface::print
\\tweak NoteHead.text #(markup  #:fontsize -2 #:char #x25D1)
#note
	#})


headQuarter   =
#(define-music-function
     (parser location note)
     (ly:music?)
   #{

\\tweak NoteHead.stencil #ly:text-interface::print
\\tweak NoteHead.text #(markup  #:fontsize -2 #:char #x25D5)
#note
	#})
`;
}



function lilySequenceToPitches(seq) {
    var lists = seq.map(f => {
	if (f.isMultiphonic) {
	    return f.lilyChords();
	} else {
	    return [lilyMidiToLily(f.pitch), " s4 "];
	}
    });
    return [lists.map(el => el[0]).join(''),
	    lists.map(el => el[1]).join('')];
}


function lilySequenceToString(sequence,redChanges) {
    var pitches = lilySequenceToPitches(sequence);
    let upperchord,lowerchord;
    if (redChanges) {
	upperchord = sequence.collectWithPrevious((prev,fing) => {
	    let lst = (prev == undefined) ? [] : prev.octaveList;
	    return lilyMainFingersUpperChordString(lst,
						   (prev == undefined) ? [] : prev.listUp,
						   fing.octaveList,
						   fing.listUp,
						   (prev != undefined));
	}).join('');
    } else {
	upperchord = sequence.map(
	    f => lilyMainFingersUpperChordString([],[],f.octaveList,
						 f.listUp,redChanges)).join('');
    };
    
    if ( redChanges ) {
	lowerchord = sequence.collectWithPrevious((prev,fing) => {
	    let lst = (prev == undefined) ? [] : prev.listLow;
	    return lilyMainFingersLowerChordString(lst,
						   fing.listLow,redChanges);
	}).join('');
    } else {
	lowerchord = sequence.map(
	    f => lilyMainFingersLowerChordString([],[],
						 f.listLow,redChanges)).join('');
    };
    
    return (`
			\\new ChoirStaff {

			<<
			\\new Staff {

  \\override Staff.StaffSymbol.line-positions = #'(-9 -6 -3 3 6 9)
  \\override NoteHead #'no-ledgers = ##t
  \\override Stem.transparent = ##t
  \\override TextScript.outside-staff-priority = ##f
  \\override Staff.Clef.transparent = ##t
  \\override Staff.TimeSignature.transparent = ##t
<<
{ \n ${upperchord}
}
\\\\
{\n ${lowerchord} 

}
>>
	}  ${
(sequence.some(el => el.isMultiphonic) ?
`\\new Staff {
\\override Accidental.font-size = #-3
  \\override Staff.TimeSignature.transparent = ##t
  \\override Stem.transparent = ##t
  \\set fontSize = #-1
  \\clef \"treble^8\"  ${pitches[1]} }` : "")}

			\\new Staff {
\\override Accidental.font-size = #-3
  \\override Staff.TimeSignature.transparent = ##t
  \\override Stem.transparent = ##t
			\\set fontSize = #-1  ${pitches[0]}
			}
			>>
			}\n`);
}

function lilyLayoutEnding() {
    return `\\layout {
    \\context {
      \\Score
		\\override BarLine #'transparent = ##t
      proportionalNotationDuration = #(ly:make-moment 1 20)
    }
  }
`;
}

function sequenceToLilypond(sequence, changesRed) {
    //	export function sequenceToLilypond(sequence, changesRed) {
    return lilyFileHeader() + lilySequenceToString(sequence,changesRed) + lilyLayoutEnding();
}
