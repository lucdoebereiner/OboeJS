var TIMELIMIT = 12000;


// Utility Methods
function interpolate(x, start, end) {
    return ((end - start) * x) + start;
}

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
	    i++;
	};
    };
    return result;
};

Array.prototype.predSuccessiveCounter = function(pred) {
    let result = true;
    let i = 0;
    while ( ( i < (this.length - 1) ) && result ) {
	if (!(pred(this[i],this[i+1],i)))  {
	    result = false;
	} else {
	    i++;
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
    return this.map(f => f.pitchesList()).predAll(el => el.every(p => pitchSet.includes(p)));
};

Array.prototype.predExcludePitches = function(pitchSet) {
    return this.map(f => f.pitchesList()).predAll(el => el.every(p => !pitchSet.includes(p)));
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
};

Array.prototype.predPitchRange = function(pmin, pmax) {
//    return this.map(f => f.pitch).predAll(p => (p >= pmin) && (p <= pmax));
    return this.map(f => f.pitchesList()).predAll(ps => ps.every(p => (p >= pmin) && (p <= pmax)));
};

Array.prototype.predPitchSeq = function(seq) {
    return (this.map(f => f.pitch).equals(seq));
};

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


// changes transition
Array.prototype.predNumberOfChangesTransition = function(n, chminStart, chmaxStart, chminEnd, chmaxEnd) {
    return this.predSuccessive( (f1,f2,i) => {
	let nch = f1.numberOfChanges(f2);
	let curMin = interpolate(i/n, chminStart, chminEnd);
	let curMax = interpolate(i/n, chmaxStart, chmaxEnd);
	return ((nch >= curMin) && (nch <= curMax) &&
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

// Multiphonic predicates

Array.prototype.predAllBeating = function(none) {
    return this.map(f => f.regBeating || f.irregBeating).predAll(beating => none ? !beating : beating );
};

// share at least on partial
Array.prototype.predConsecShared = function() {
    return this.predSuccessive((f1,f2) => f1.strongestPitches().some(p => f2.strongestPitches().includes(p)));
};

Array.prototype.predDifficulty = function(min,max) {
    return this.map(f => f.difficulty).predAll(d => (d >= min) && (d <= max));
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
