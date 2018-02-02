var TIMELIMIT = 12000;

/// Array Utility Methods
Array.prototype.occurrencesOf = function(el) {
    let c = 0;
    this.forEach(arEl => { if (arEl == el) { c++; }});
    return c;
};


Array.prototype.countAllElements =  function() {
    this.map(el => this.occurrencesOf(el));
};

Array.prototype.lazyAndFunctionList = function() {
    let result = true;
    var i = 0;
    while ( result && (i < this.length) ) {
	result = this[i]();
	i++;
    }
    return result;
};

Array.prototype.lazyAndFunctionListInput = function(l) {
    let result = true;
    var i = 0;
    while ( result && (i < this.length) ) {
	result = this[i](l);
	i++;
    }
    return result;
};


Array.prototype.concatStringList = function() {
    return this.reduce( (acc, cur) => acc + cur );
};

Array.prototype.mapIndices = function(idcs) {
    return idcs.map(i => this[i]);
};

Array.prototype.removeLast = function() {
    let copy = this.slice;
    copy.pop();
    return copy;
};

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
};

Array.prototype.includesEq = function(el) {
    return this.some(e =>  {
	if (e instanceof Array && el instanceof Array) {
	    return e.equals(el);
	} else {
	    return (e === el);
	}
    });
};

// Hide method from for-in loops
//Object.defineProperty(Array.prototype, "equals", {enumerable: false});

Array.prototype.setDifference = function(ar2) {
    let result = [];
    this.forEach(el =>  { if (!ar2.includes(el)) { result.push(el); }  } );
    return result;
};

Array.prototype.mutualSetDifference = function(ar2) {
    return this.setDifference(ar2).concat(ar2.setDifference(this)); 
};

Array.prototype.intervalList = function() {
    let result = [];
    let i = 0;
    while (i < (this.length - 1)) {
	result.push(reduceInterval(this[i+1] - this[i]));
	i++;
    };
    return result;
};

Array.prototype.intervalListWithOct = function() {
    let result = [];
    let i = 0;
    while (i < (this.length - 1)) {
	result.push(this[i+1] - this[i]);
	i++;
    };
    return result;
};

// ON FINGERING LISTS

Array.prototype.makeIntervalList = function() {
    return this.map(f => f.pitch).intervalList();
}

Array.prototype.makeIntervalListWithOct = function() {
    return this.map(f => f.pitch).intervalListWithOct();
}



function reduceInterval(interval) {
    let fl = Math.abs(Math.floor(interval));
    return (((fl % 12) + (Math.abs(interval) - fl)) * Math.sign(interval));
}


// Predicates

Array.prototype.predAll = function(pred) {
    let res = true;
    let i = 0;
    while ( (i < this.length) && res) {
	res = pred(this[i]);
	i++;
    }
    return res;
};


Array.prototype.predAllElementsAlike = function() {
    let result = true;
    let i = 0;
    let el;
    if (this.length > 0) {
	el = this[0];
	while (result && (i < this.length)) {
	    if (el instanceof Array && this[i] instanceof Array) {
		result = el.equals(this[i]);
	    } else {
	    	result = el == this[i];
	    };
	    i++;
	};
    };
    return result;
};


Array.prototype.predAllDifferent = function() {
    let res = true;
    let ar = this.slice();
    while ( (ar.length > 0) && res) {
	let e = ar.pop();
	if (ar.includesEq(e)) { res = false; };
    };
    return res;
};

// Array.prototype.predFingeringsAllDifferent = function() {
//     let result = true;
//     let ar = this.slice();
//     while ((ar.length > 0)  && result) {
// 	let e = ar.pop();
// 	ar.forEach(arEl => result = !(e.equal(arEl)));
//     }	
//     return result;
// };

Array.prototype.predSuccessive = function(pred) {
    let result = true;
    let i = 0;
    while ( ( i < (this.length - 1) ) && result ) {
	if (!(pred(this[i],this[i+1])))  {
	    result = false;
	} else {
	    i++
	};
    };
    return result;
};

// pred takes two args
Array.prototype.predAllCombinations = function(pred) {
    let ar = this.slice();
    let result = true;
    while ( (ar.length > 0)  && result ) {
	let cur = ar.pop();
	result = ar.predAll(el => pred(cur,el));
    };
    return result;
};

Array.prototype.predAlternatingSigns = function() {
    let result = true;
    let i = 1;
    let el;
    if (this.length > 0) {
	el = Math.sign(this[0]);
	while (result && (i < this.length)) {
	    result = Math.sign(this[i]) != el;
	    el = Math.sign(this[i]);
	    i++;
	};
    };
	return result;
};


// FINGERING PREDICATES

Array.prototype.predFirstPitch = function(pred) {
    return pred(this.at(0).pitch);
};

Array.prototype.predFirstPitchEqual = function(p) {
    return (this[0].pitch == p);
};

Array.prototype.predPitchesAllDifferent = function() {
    return this.map(f => f.pitch).predAllDifferent();
};

Array.prototype.predPossibleTimbreIdx = function(timbreSet) {
	return this.map(f => f.timbreIdx).predAll(el => timbreSet.includes(el));
};

Array.prototype.predPossiblePitches = function(pitchSet) {
	return this.map(f => f.pitch).predAll(el => pitchSet.includes(el));
};

Array.prototype.predExcludePitches = function(pitchSet) {
    return this.map(f => f.pitch).predAll(el => !(pitchSet.includes(el)));
};

Array.prototype.predAscendingPitch = function() {
    return this.makeIntervalListWithOct().predAll(el => el > 0);
};

Array.prototype.predDescendingPitch = function() {
    return this.makeIntervalListWithOct().predAll(el => el < 0);
};

Array.prototype.predAlternatingPitchDirection = function() {
    return this.makeIntervalListWithOct().predAlternatingSigns();
};

// with octave reduction
Array.prototype.predPossibleIntervals = function(intervals) {
    return this.makeIntervalList().predAll(el => intervals.includes(el));
};


Array.prototype.predExcludeIntervals = function(intervals) {
    return this.makeIntervalList().predAll(el => !(intervals.includes(el)));
};


Array.prototype.predIntervalRange = function(min,max) {
    return this.makeIntervalListWithOct().predAll(el => (Math.abs(el) >= min) && (Math.abs(el) <= max));
};

// without modulo
Array.prototype.predPossibleIntervalsOct = function(intervals) {
    return this.makeIntervalListWithOct().predAll(el => intervals.includes(el));
};

Array.prototype.predExcludeIntervalsOct = function(intervals) {
    return this.makeIntervalListWithOct().predAll(el => intervals.includes(el));
}

Array.prototype.predPitchRange = function(pmin, pmax) {
    return this.map(f => f.pitch).predAll(p => (p >= pmin) && (p <= pmax));
}

Array.prototype.predPitchSeq = function(seq) {
    return (this.map(f => f.pitch).equals(seq));
}

Array.prototype.predNoImmediatePitchRepetition = function() {
    return this.predSuccessive( (f1,f2) =>  f1.pitch != f2.pitch);
};

Array.prototype.predIntervalContent = function(intervals) {
    return this.predAllCombinations( (f1,f2) =>
				     intervals.includes((f2.pitch - f1.pitch).reduceInterval));
};

Array.prototype.predExcludeTrills = function() {
    return this.predAll(f => f.trill == false);
};

Array.prototype.predNumberOfChanges = function(chmin, chmax) {
    return this.predSuccessive( (f1,f2) => {
	let nch = f1.numberOfChanges(f2);
	return ((nch >= chmin) && (nch <= chmax) &&
		// also exclude difficult little finger changes
		!(f1.changeLittleFinger(f2)) &&
		!(f1.leftLittleFingerDoubleChange(f2)));
    });
};

	// all are neighbors of all others
Array.prototype.predNeighborGroup = function() {
    return this.predAllCombinations( (f1,f2) => f1.easyNeighbors(f2));
};

// FINGERING PREDICATES

Array.prototype.predFirstPitch = function(pred) {
    return pred(this[0].pitch);
};

Array.prototype.predFirstPitchEqual = function(p) {
    return (this[0].pitch == p);
};

Array.prototype.predPitchesAllDifferent = function() {
    return this.map(f => f.pitch).predAllDifferent();
};

/// Backtracking Solver

class Solver {

    constructor(n, domain, predicate) {
	this.n = n;
	this.domain = domain;
	this.predicate = predicate;
	this.solutionsIndices = [];
	this.resultIndices = [];
	this.solutionFound = [];
	this.lastSolution = false;
    }

    backtrack() {
//	console.log("backtracking");
	if (this.solutionsIndices.length == 0) {
	    return false;
	    // last element
	} else if (this.solutionsIndices.slice([-1][0]) >= (this.domain.length  -1)) {
	    this.solutionsIndices.pop();
	    return this.backtrack();
	} else {
	    this.solutionsIndices[this.solutionsIndices.length - 1] = (this.solutionsIndices[this.solutionsIndices.length - 1] + 1);
	    return true;
	}
    }

    // solveAux() {
    // 	if ((new Date().getTime() - this.startTime ) > TIMELIMIT) {
    // 	    throw "Exceeded time out";
    // 	}
    // 	if (this.predicate(this.domain.mapIndices(this.solutionsIndices))) {
    // 	    if (this.solutionsIndices.length >= this.n) {
    // 		this.solutionFound = this.domain.mapIndices(this.solutionsIndices);
    // 		return this.solutionsIndices;
    // 	    } else {
    // 		this.solutionsIndices.push(0);
    // 		return this.solveAux();
    // 	    }
    // 	} else {
    // 	    let res = this.backtrack();
    // 	    if (res) {  return this.solveAux(); } else { return false; }; 
    // 	}
    // }

    // attempt at iterative version without recursion in order not to exceed stock
    solveAux() {
	
	let result;
	let searching = true;

	while (searching) {

	    if ((new Date().getTime() - this.startTime ) > TIMELIMIT) {
		throw "Exceeded time out";
	    }
	    
	    // check predicate
	    if (this.predicate(this.domain.mapIndices(this.solutionsIndices))) {
		
		if (this.solutionsIndices.length >= this.n) {
		    // solution found
		    this.solutionFound = this.domain.mapIndices(this.solutionsIndices);
		    this.resultIndices = this.solutionsIndices.slice();
		    searching = false;
		    result = this.solutionsIndices;
		} else {
		    // fulfills constraints but no long enough
		    this.solutionsIndices.push(0);
		    //   return this.solveAux();
		}
	    } else {
		let res = this.backtrack();
		if (!res) {
		    result = false;
		    searching = false;
		    //return this.solveAux();
		} 
	    };
	};
	return result;
    }

    
    solve() {
	this.startTime = new Date().getTime();
	let solution;
	// no more solutions
	if (this.lastSolution) {
	    console.log("false 1");
	    return false;
	} else {
	    if (this.solutionsIndices.length == 0) {
		this.solutionsIndices.push(0);
	    }
	    solution = this.solveAux();
	    if (solution == false) {
		console.log("false 2");
		return false;
	    } else {
		let nextSol = this.backtrack();
		if (nextSol == false) {
		    this.lastSolution = true;
		    console.log("backtracking end");
		    console.log(this.solutionFound);
		    return this.solutionFound;
		} else {
		    console.log("found something");
		    console.log(nextSol);
		    console.log(this.solutionFound);
		    return this.solutionFound;
		}
	    }
	}   
    }

}

/// Oboe Fingerings

class OboeFingering {

    constructor(pitch, octList, upList, lowList, isTrill, aPressure, lPressure, iIdx,
		dMin, dMax, mIdx) {
	let upListMain = upList.filter(e => ["x","h","o"].includes(e));
	let lowListMain = lowList.filter(e => ["x","h","o"].includes(e));
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
