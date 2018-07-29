
/// Oboe Fingerings

class OboeFingering {

    constructor(pitch, octList, upList, lowList, isTrill, aPressure, lPressure, iIdx,
		dMin, dMax, mIdx) {
	let upListMain = upList.filter(e => ["x","h","o"].includes(e));
	let lowListMain = lowList.filter(e => ["x","h","o"].includes(e));
	this.isMultiphonic = false;
	this.listUp = upList;
	this.listLow = lowList;
	this.dynMin = dMin;
	this.dynMax = dMax;
	this.multiIdx = mIdx;
	this.trill = isTrill;
	this.airPressure = aPressure;
	this.lipPressure = lPressure;
	this.pitch = pitch;
	this.oct1 = octList.includes(1) ? "x" :  "o" ;
	this.oct2 = octList.includes(2) ? "x" : "o" ;
	this.oct3 = octList.includes(3) ? "x" : "o" ;
	this.octaveList = octList;
	this.upCsharpTrill = upList.includes("cistrill") ? "x" : "o";
	this.upEb = upList.includes("eb") ? "x" : "o";
	this.upB = upList.includes("b") ? "x" : "o";
	this.upBb = upList.includes("bb") ? "x" : "o";
	this.upF = upList.includes("f") ? "x" : "o";
	this.upAb = upList.includes("ab") ? "x" : "o";
	this.lowAb = lowList.includes("ab") ? "x" : "o";
	this.lowAbtrill = lowList.includes("abtrill") ? "x" : "o";
	this.lowDtrill = lowList.includes("dtrill") ? "x" : "o";
	this.lowF = lowList.includes("f") ? "x" : "o";
	this.lowC = lowList.includes("c") ? "x" : "o";
	this.lowCsharp = lowList.includes("cis") ? "x" : "o";
	this.lowEb = lowList.includes("eb") ? "x" : "o";
	this.upMainB = upListMain[0];
	this.upMainA = upListMain[1];
	this.upMainG = upListMain[2];
	this.lowMainFsharp = lowListMain[0];
	this.lowMainE = lowListMain[1];
	this.lowMainD = lowListMain[2];
    }

    pitchString() {
	return String(this.pitch);
    }

    pitchesList() {
	return [this.pitch];
    }
    
    // assign fingers to keys for the upper half (left hand)
    fingersUp() {
	var fingers = [4,3,2,1];
	var output = [];
	this.listUp.forEach(k => {
	    if (k == "o") {
		output.push([0, "o"]);
		fingers.pop();
	    } else if (["x","h","dtrill","cistrill"].includes(k)) {
		output.push([fingers.pop(), k]);
	    } else {
		output.push([4, k]);
		fingers = [];
	    }
	    
	});
	return output;
    }

	
    // assign fingers to keys for the lower half (right hand)
    fingersLow() {
	var fingers = [4,3,2,1];
	var output = [];
	var i = 0;
	var k;
	while (i < this.listLow.length)  {
	    k = this.listLow[i];
	    if (k == "o") {
		output.push([0, "o"]); fingers.pop(); i++;
	    } else if ( ["ab", "abtrill"].includes(k) && (this.listLow[i+1] == "o") ) {
		output.push([fingers.pop(), k]); output.push([0, "o"]); i = i + 2;
	    } else if ( ["x", "h", "ab", "abtrill", "f"].includes(k) ) {
		output.push([fingers.pop(), k]); i++;
	    } else if ( k == "dtrill" ) {
		if (this.listLow[i+1] == "o" ) {
		    output.push([fingers.pop(), k]);
		    output.push([0, "o"]); i = i + 2;
		} else if (this.listLow[0] == "o") {
		    output.push([1, k]); i++;
		} else {
		    output.push([fingers.pop(), k]);
		    i++;
		}
	    } else {
		output.push([4, k]); i++; fingers = [];
	    };
	};
	return output;
    }


    // calculate the finger changes
    getChanges (fingering2) {
	var fingersUp1 = this.fingersUp();
	var fingersLow1 = this.fingersLow();
	var fingersUp2 = fingering2.fingersUp();
	var fingersLow2 = fingering2.fingersLow();
	var calcDifference = function (n, fing1, fing2) {
//	    console.log(fing2);
	    let f1 = fing1.find(el => el[0] == n);
	    let f2 = fing2.find(el => el[0] == n);
	    // is finger n used in both?
	    if ((f1 !== undefined) && (f2 !== undefined)) {
		if (f1[1] == f2[1]) { // no change
		    return false;
		} else {
		    return [n,f1[1],f2[1]]; // return finger, 1st pos,2nd pos
		}
	    } else {
		if (f1 !== undefined) {
		// no longer used
		    return [n,f1[1],false];
		} else if (f2 !== undefined) {
		    // finger is used now
		    return [n,false,f2[1]];
		} else {
		    return false;
		} // remains unused
	    }
	};
	    return [
		[1,2,3,4].map(f => calcDifference(f,fingersUp1,fingersUp2) ),
		[1,2,3,4].map(f => calcDifference(f,fingersLow1,fingersLow2) )
	    ];
    }


    numberOfFingerChanges(fingering2) {
	let changes = this.getChanges(fingering2);
	    return (changes[0].filter(el => el != false).length +
		    changes[1].filter(el => el != false).length);
    }


    
    numberOfChanges(fingering2) {
	let changes = this.getChanges(fingering2);
	let octChanges = this.getOctaveChange(fingering2);
	let octDiff = 0;
	if (octChanges.length > 0) {
	    octDiff =  octChanges[0].mutualSetDifference(octChanges[1]).length;
	}
	return (changes[0].filter(el => el != false).length +
		changes[1].filter(el => el != false).length +
		octDiff);
    }

    // GENERAL
    fingerUsedLeft(finger) {
	let fing = this.fingersUp().filter(el => el[0] == finger);
	if (fing.length > 0) { return fing; } else { return false; };
    }

    

    fingerUsedRight(finger) {
	let fing = this.fingersLow().filter(el => el[0] == finger);
	if (fing.length > 0) { return fing; } else { return false; };
    }

    equal(fingering2) {
	return ((this.listUp.equals(fingering2.listUp)) &&
		(this.listLow.equals(fingering2.listLow)) &&
		(this.octaveList.equals(fingering2.octaveList)));
    }

    
    // LITTLE FINGER
    // does a little finger change from one key to another key?
    changeLittleFinger(fingering2) {
	let changes = this.getChanges(fingering2);
	let lf1 = changes[0].filter(el => { if (el != false) { return el[0] == 4; } else { return false; } });
	let lf2 = changes[1].filter(el => { if (el != false) { return el[0] == 4; } else { return false; } });
	let lf1ch = (lf1.length > 0) ? lf1[0].includes(false) : true;
	let lf2ch = (lf2.length > 0) ? lf2[0].includes(false) : true;
//	console.log(changes);
//	console.log("lf1: " + lf1);
//	console.log("lf2: " + lf2);
	return !(lf1ch && lf2ch);
    }

    leftLittleFingerKeys() {
	return this.fingersUp().filter(el => el[0] == 4);
    }
    
    // does the left little finger press two or more keys at once?
    leftLittleFingerDouble() {
	return (this.leftLittleFingerKeys().length > 1);
    }

    // left little finger with double keys is changing?
    leftLittleFingerDoubleChange(fingering2) {
	let leftLittle1 = this.leftLittleFingerKeys().map(el => el[1]);
	let leftLittle2 = fingering2.leftLittleFingerKeys().map(el => el[1]);
	if ((leftLittle1.length > 1) || (leftLittle2.length > 1)) {
	    return !(leftLittle1.equals(leftLittle2));
	} else {
	    return false;
	};
    }

    // SPECIFIC DIFFICULTIES

    // half to full or full to half closed changes?
    changeHalf(fingering2) {
	let changes = this.getChanges(fingering2);
	let realChanges = changes[0].filter(el => el != false).concat(
	    changes[1].filter(el => el != false));
	    return realChanges.some(el => el.includes("x") && el.includes("h"));
    }

    changeDirections(fingering2) {
	let changes = this.getChanges(fingering2);
	let checkChange = function(change) {
	    if (change[1] == false) {
		return "closing";
	    } else  {
		if (change[2] != false) {
		    return "switching";
		} else  {
		    return "opening";
		}
	    }};
	    return [changes[0].filter(el => el != false).map(checkChange),
		    changes[1].filter(el => el != false).map(checkChange)];
	}

    containsKeySwitches(fingering2) {
	let directions = this.changeDirections(fingering2);
	return directions[0].concat(directions[1]).includes("switching");
    }

    allChangesAlike(fingering2) {
	var directions = this.changeDirections(fingering2);
	return directions[0].concat(directions[1]).predAllElementsAlike();
    }
    
    getOctaveChange(fingering2) {
	let oct1 = this.octaveList;
	let oct2 = fingering2.octaveList;
	if (oct1.equals(oct2)) { return false; } else { return [oct1,oct2]; };
    }

    // simple octave key change
    simpleOctChange(fingering2) {
	var octChange = this.getOctaveChange(fingering2);
//	console.log(octChange);
	if (octChange == false) {
	    return true;
	} else if ([
	    [[],[1]],[[1],[0]],
	    [[],[3]],[[3],[0]],
	    [[1],[1,2]],[[1,2],[1]],
	    [[2],[1,2]],[[1,2],[2]],
	    [[3],[2,3]],[[2,3],[3]]
	].includesEq(octChange)) {
	    return true;
	} else {
	    return false;
	}
    }

    // rest of changes compatible with changing octave keys
    fingersOctCompatible(realChangesLeft) { // list with changes only
	var changingFingers = realChangesLeft.map(ch => ch[0]);
	if (changingFingers.length == 0) {
	    return true;
	} else if ([[4], [2,3], [2,3,4]].includesEq(changingFingers) ) {
	    return true;
	} else {
	    return false;
	}
    }

    // private method
    _CheckFingers(realChanges, fingers) {
//	console.log(fingers);
	let changingFingers = realChanges.map(ch => ch[0]);
	if (changingFingers.length == 0) {
	    return true;
	} else if  ( [ [1], [2], [3], [4], [1,2], [3,4], [1,2,3], [2,3,4] ]
		     .includesEq(changingFingers))  {
	    return true;
	} else if ([2,4].equals(changingFingers) && !(fingers.some(f => f[0] == 3))) {
	    return true;
	} else if ([2,3].equals(changingFingers) && !(fingers.some(f => f[0] == 1))
		   && !(fingers.some(f => f[0] == 4))) {
	    return true;
	} else if ([1,2,4].equals(changingFingers) && !(fingers.some(f => f[0] == 3))) {
	    return true;
	} else {
	    return false;
	}
    }

    simpleChangeOneHand(fingering2) {
	let changes = this.getChanges(fingering2);
	let realChangeLeft = changes[0].filter(el => el != false);
	let realChangeRight = changes[1].filter(el => el != false);
//	console.log(realChangeLeft);
//	console.log(realChangeRight);
	if ( (realChangeLeft.length > 0) && (realChangeRight.length > 0) ) {
//	    console.log("both");
	    return false;
	} else {
	    if ( realChangeLeft.length > 0 ) {
//		console.log("left");
		if ( this.getOctaveChange(fingering2) == false) {
		    return (this.simpleOctChange(fingering2) &&
			    this.fingersOctCompatible(realChangeLeft));
		} else {
		    return this._CheckFingers(realChangeLeft,this.fingersUp());
		}
	    } else {
		if ( realChangeRight.length > 0 ) {

		    return (this.simpleOctChange(fingering2) &&
			    this._CheckFingers(realChangeRight,this.fingersLow()));
		} else {
		    return true;
		}
	    }
	}
    }
	
    simpleChangeTwoHands(fingering2) {
	let changes = this.getChanges(fingering2);
	let realChangeLeft = changes[0].filter(el => el != false);
	let realChangeRight = changes[1].filter(el => el != false);
	let fingersLeft = realChangeLeft.map(el => el[0]);
	let fingersRight = realChangeRight.map(el => el[1]);

	if ( !(realChangeLeft.length == 0) && !(realChangeRight.length == 0) &&
	     (this.getOctaveChange(fingering2) == false)) {
	    
	    return ((fingersLeft.equals([3]) && fingersRight.equals([1]) &&
		     !(this.fingersUp().some(f => f[0] == 4))) ||

		    (fingersLeft.equals[3] && fingersRight.equals([2]) &&
		     !(this.fingersUp().some(f => f[0] == 4)) &&
		     !(this.fingersLow().some(f => f[0] == 4)) &&
		     !(this.fingersLow().some(f => f[0] == 3))) ||
		   
		    (fingersLeft.equals([4]) && fingersRight.equals([2]) &&
		     !(this.fingersUp().some(f => f[0] == 4)) &&
		     !(this.fingersLow().some(f => f[0] == 4)) &&
		     !(this.fingersLow().some(f => f[0] == 3))));
	} else {
	    return false;
	}
    }

    // not correct check with database 10/11 (which are wasy neighbors)
    easyNeighbors(fingering2) {
	let changes = this.getChanges(fingering2);
	let octChange = this.getOctaveChange(fingering2);
	//"easy called".postln;
	// check that there is a change
//	console.log(this.simpleChangeOneHand(fingering2));
//	console.log(this.simpleChangeTwoHands(fingering2));
//	console.log(!(this.containsKeySwitches(fingering2)));
//	console.log(!(this.leftLittleFingerDoubleChange(fingering2)));
	return ((((changes[0].filter(el => el != false).concat(changes[1].filter(el => el != false))).length > 0) ||
		 !(this.octaveList.equals(fingering2.octaveList))) &&
	      
		!(this.changeHalf(fingering2)) &&
	      
		(this.lipPressure == fingering2.lipPressure) &&
	      
		(Math.abs(this.airPressure - fingering2.airPressure) < 2) &&
	      
		this.allChangesAlike(fingering2) &&
	      
		!(this.containsKeySwitches(fingering2)) &&
	      
		!(this.leftLittleFingerDoubleChange(fingering2)) &&
	      
		!(this.changeLittleFinger(fingering2)) &&
	      
		(this.simpleChangeOneHand(fingering2) ||
		 this.simpleChangeTwoHands(fingering2)));
    }

	
}



class OboeMultiphonicFingering extends OboeFingering {

    constructor(pitches, octList, upList, lowList, difficulty,
		trill = false, airPressure = 3, lipPressure = 1.5, 
		dynMin = "ppp", dynMax = "fff", multiIdx = false, monoIdx = false, reed = 3,
		rep = "rep", rolling = false, regBeating = false, irregBeating = false,
		noisy = false, moduleIndices = []) {
	super(pitches, octList, upList, lowList, trill, airPressure,
	      lipPressure, undefined, dynMin, dynMax, multiIdx);
	// let upListMain = upList.filter(e => ["x","h","o"].includes(e));
	// let lowListMain = lowList.filter(e => ["x","h","o"].includes(e));
	// this.listUp = upList;
	// this.listLow = lowList;
	// this.dynMin = dynMin;
	// this.dynMax = dynMax;
	// this.multiIdx = multiIdx;
	this.monoIdx = monoIdx;
	this.difficulty = difficulty;
	this.isMultiphonic = true;
	// this.trill = trill;
	// this.airPressure = airPressure;
	// this.lipPressure = lipPressure;
	// this.pitch = pitches;
	// this.oct1 = octList.includes(1) ? "x" :  "o" ;
	// this.oct2 = octList.includes(2) ? "x" : "o" ;
	// this.oct3 = octList.includes(3) ? "x" : "o" ;
	// this.octaveList = octList;
	// this.upCsharpTrill = upList.includes("cistrill") ? "x" : "o";
	// this.upEb = upList.includes("eb") ? "x" : "o";
	// this.upB = upList.includes("b") ? "x" : "o";
	// this.upBb = upList.includes("bb") ? "x" : "o";
	// this.upF = upList.includes("f") ? "x" : "o";
	// this.upAb = upList.includes("ab") ? "x" : "o";
	// this.lowAb = lowList.includes("ab") ? "x" : "o";
	// this.lowAbtrill = lowList.includes("abtrill") ? "x" : "o";
	// this.lowDtrill = lowList.includes("dtrill") ? "x" : "o";
	// this.lowF = lowList.includes("f") ? "x" : "o";
	// this.lowC = lowList.includes("c") ? "x" : "o";
	// this.lowCsharp = lowList.includes("cis") ? "x" : "o";
	// this.lowEb = lowList.includes("eb") ? "x" : "o";
	// this.upMainB = upListMain[0];
	// this.upMainA = upListMain[1];
	// this.upMainG = upListMain[2];
	// this.lowMainFsharp = lowListMain[0];
	// this.lowMainE = lowListMain[1];
	// this.lowMainD = lowListMain[2];
	this.reed = reed;
	this.rep = rep;
	this.rolling = rolling;
	this.regBeating = regBeating;
	this.irregBeating = irregBeating;
	this.noisy = noisy;
	// indices to monophonic fingerings that allow smooth transitions
	this.moduleIndices = moduleIndices;
    }


    pitchString() {
	let str = "";
	let sorted = this.pitch.sort((a,b) => b[1] - a[1]);
	for (var i = 0; i < sorted.length; i++) {
	    str = str + `(${sorted[i][0]}, ${sorted[i][1]})`;
	    if (i != (sorted.length - 1)) {
		str = str + ", ";
	    };
	};
	return str;
    }
    
    // one list (chord) for each system
    lilyChords() {
	let lower = this.pitch.filter(p => p[0] <= 79.5 );
	let upper = this.pitch.filter(p => p[0] > 79.5 );
	if (lower.size == 0) {
	    lower = " s4 ";
	} else {
	    lower = lilyPitchListToChord(lower);
	};
	if (upper.size == 0) {
	    upper = " s4 ";
	} else {
	    upper = lilyPitchListToChord(upper);
	};
	return [lower,upper];
    }

	// with 4
    strongestPitches() {
	return this.pitch.filter(p => p[1] == 4).map(p => p[0]);
    }

    pitchesList() {
	return this.pitch.map(p => p[0]);
    }

}
