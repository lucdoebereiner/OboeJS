//import * as lily from 'lilypond';

Array.prototype.getByKey = function(key) {
    return this.find(el => el[0] == key)[1];
};

// in place
Array.prototype.shuffle = function(a) {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

var constraints = [];

// ids of constraints that cand only be used with mono domain
var monoConstraints = ["first-pitch", "ascending-pitches",
		       "descending-pitches","pitch-sequence",
		       "no-consec-pitch-rep","interval-content",
		       "interval-range","alternating","possible-intervals","exclude-intervals"];

// ids of constraints that cand only be used with multi domain
var multiConstraints = ["beating","shared-consecutive","difficulty",];

var solver;

class FormSpec {
    
    // name : string
    // type : "number" | "numberlist"
    // as a list of pairs
    constructor(name,spec,id) {
	this.name = name;
	this.spec = spec;
	this.data = [];
	this.id = id;
    }
    
    buildForm() {
	let form = document.createElement("form");
	let formspec = this;
	form.id = this.id+"-form";
	this.ids = this.spec.map(s => {
	    let label = document.createElement("label");
	    let input = document.createElement("input");
	    let inid = formspec.id + "-" + s[0].replace(/\s+/g, '-').toLowerCase();
	    input.id = inid;
	    label.htmlFor = inid;
	    label.innerHTML = s[0];
	    input.type = s[1];
	    if (input.type == "text") {
		input.placeholder="n1, n2, n3,...";
		input.required = true;
	    } else if (input.type == "number") {
		input.step = 0.5;
		input.required = true;
	    };
	    if (s[0] != "") {
		form.appendChild(label);
	    };
	    form.appendChild(input);
	    return [inid,s[1],s[2]];
	});
	return form;
    }

    getData() {
	if (this.ids == undefined) {
	    return [];
	} else {
	    return this.ids.map(i => {
		let el = document.getElementById(i[0]);
		let val;
		switch (i[1]) {
		case "number":
		    val = Number(el.value);
		    break;
		case "checkbox":
		    val = el.checked;
		    break;
		case "text":
		    val = el.value.split(',').map(Number);
		    break;
		};
		return [i[2], val];
	    });
	}
	
    }
    
}


class Constraint {

    constructor(name,inputSpec,id) {
	this.name = name;
	this.id = id;
	this.spec = new FormSpec(name,inputSpec,id);
	this.data;
	//	     contstraints.push(this);
    }

    toHTML() {
	// after adding
	let div = document.createElement("div");
	//	     let header = document.createElement("h4");
	let constraint = this;
	let button = document.createElement("button");
	div.id = this.id;
	div.className = "added-constraint";
	div.innerHTML = "<strong>" + this.name + "</strong>   ";
	button.id = this.id + "-button";
	//	     button.style.cssFloat = "right";
	button.onclick = function () {
	    constraint.remove();
	    addConstraintOption(constraint.id, constraint.name);
	};
	button.innerHTML = "Remove";
	//	     div.appendChild(header);
	div.appendChild(button);
	document.getElementById("constraints").appendChild(div);
	// iter over form spec data
    }

    remove() {
	constraints = constraints.filter(c => c.id != this.id);
	let el = document.getElementById(this.id);
	el.parentElement.removeChild(el);
    }

    createForm() {
	let div = document.createElement("div");
	//	     let text = document.createElement("p");
	let addButton = document.createElement("input");
	let form = this.spec.buildForm();
	let constraint = this;
	div.className = "constraint-form";
	div.id = this.id + "-form-container";
	div.innerHTML = "<strong>" + this.name + "</strong>";
	addButton.id = this.id+"-add-button";
	addButton.type = "submit";
	addButton.style.cssFloat = "right";
	form.onsubmit = function () {

	    constraint.toHTML();
	    constraint.data = constraint.spec.getData();
	    let container = document.getElementById("current-constraint");
	    container.removeChild(div);
	    removeConstraintOption(constraint.id);
	    constraints.push(constraint);
	    
	};
	addButton.value = "Add";
	//	     div.appendChild(text);
	form.appendChild(addButton);
	div.appendChild(form);
	document.getElementById("current-constraint").appendChild(div);
    }

    toPredicate() {
	let constraint = this;
	switch(this.id) {
	case "all-different":
	    return function (l) { return l.predAllDifferent(); };
	    break;
	case "possiblepitches":
	    return function (l) { return  l.predPossiblePitches(constraint.data.getByKey("pitches")); };
	    break;
	case "easy-neighbors":
	    return function (l) { return l.predSuccessive( (f1,f2) => f1.easyNeighbors(f2) ); };
	    break;
	case "number-of-changes":
	    return function (l) { return l.predNumberOfChanges(constraint.data.getByKey("min"), constraint.data.getByKey("max")); };
	    break;
	case "first-pitch":
	    return function (l) { return l.predFirstPitchEqual(constraint.data.getByKey("pitch")); };
	    break;
	case "ascending-pitches":
	    return function (l) { return l.predAscendingPitch(); };
	    break;
	case "descending-pitches":
	    return function (l) { return l.predDescendingPitch(); };
	    break;
	case "exclude-pitches":
	    return function (l) { return  l.predExcludePitches(constraint.data.getByKey("pitches")); };
	case "alternating":
	    return function (l) { return l.predAlternatingPitchDirection(); };
	    break;
	case "possible-intervals":
	    return function (l) { return l.predPossibleIntervals(constraint.data.getByKey("intervals")); };
	    break;
	case "exclude-intervals":
	    return function (l) { return l.predExcludeIntervals(constraint.data.getByKey("intervals")); };
	    break;
	case "pitch-range":
	    return function (l) { return l.predPitchRange(constraint.data.getByKey("min"), constraint.data.getByKey("max")); };
	    break;
	case "pitch-sequence":
	    return function (l) { return l.predPitchSeq(constraint.data.getByKey("pitches")); };
	    break;
	case "no-consec-pitch-rep":
	    return function (l) { return l.predNoImmediatePitchRepetition(); };
	    break;
	case "interval-content":
	    return function (l) { return l.predIntervalContent(constraint.data.getByKey("intervals")); };
	case "easy-group":
	    return function (l) { return l.predNeighborGroup(); };
	    break;
	case "interval-range":
	    return function (l) { return l.predIntervalRange(constraint.data.getByKey("min"), constraint.data.getByKey("max")); };
	    break;
	case "beating":
	    return function (l) { return l.predAllBeating(constraint.data.getByKey("none")); };
	    break;
	case "shared-consecutive":
	    return function (l) { return l.predConsecShared(); };
	    break;
	case "difficulty":
	    return function (l) { return l.predDifficulty(constraint.data.getByKey("min"), constraint.data.getByKey("max")); };
	    break;
	}
    }
    
}




function removeConstraintOption(option) {
    let selectobject  = document.getElementById("constraint-menu");
    for (var i=0; i<selectobject.length; i++){
	if (selectobject.options[i].value == option )
	    selectobject.options[i].disabled = true;
    }
    selectobject.selectedIndex = 0;
}

function addConstraintOption(optionValue) {
    let selectobject  = document.getElementById("constraint-menu");
    for (var i=0; i<selectobject.length; i++){
	if (selectobject.options[i].value == optionValue )
	    selectobject.options[i].disabled = false;
    }
    /* 
     * 	 let select = document.getElementById("constraint-menu");
     * 	 let option = document.createElement("option");
     * 	 option.text = text;
     * 	 option.value = optionValue;
     * 	 select.add(option);*/
}


function constraintUpdated(element) {
    let idx=element.selectedIndex;
    let val=element.options[idx].value;
    let constraint;
    document.getElementById("current-constraint").innerHTML = "";
    switch (val) {
    case "all-different":
	constraint = new Constraint("No repetitions of fingerings",[],"all-different");
	break;
    case "possiblepitches":
	constraint = new Constraint("Possible pitches",[["","text","pitches"]],"possiblepitches");
	break;
    case "easy-neighbors":
	constraint = new Constraint("Easy fingering transitions",[],"easy-neighbors");
	break;
    case "number-of-changes":
	constraint = new Constraint("Number of changing fingers",[["Minimum","number","min"],["Maximum","number","max"]],"number-of-changes");
	break;
    case "exclude-pitches":
	constraint = new Constraint("Exclude pitches",[["","text","pitches"]],"exclude-pitches");
	break;
    case "first-pitch":
	constraint = new Constraint("First pitch",[["","number","pitch"]],"first-pitch");
	break;
    case "ascending-pitches":
	constraint = new Constraint("Ascending pitches",[],"ascending-pitches");
	break;
    case "descending-pitches":
	constraint = new Constraint("Descending pitches",[],"descending-pitches");
	break;
    case "alternating":
	constraint = new Constraint("Alternating interval directions",[],"alternating");
	break;
    case "possible-intervals":
	constraint = new Constraint("Possible intervals",[["","text","intervals"]],"possible-intervals");
	break;
    case "exclude-intervals":
	constraint = new Constraint("Exclude intervals",[["","text","intervals"]],"exclude-intervals");
	break;
    case "pitch-range":
	constraint = new Constraint("Pitch range",[["Minimum","number","min"],["Maximum","number","max"]],"pitch-range");
	break;
    case "pitch-sequence":
	constraint = new Constraint("Pitch sequence",[["","text","pitches"]],"pitch-sequence");
	break;
    case "no-consec-pitch-rep":
	constraint = new Constraint("No consecutive pitch repetitions",[],"no-consec-pitch-rep");
	break;
    case "interval-content":
	constraint = new Constraint("Interval content",[["","text","intervals"]],"interval-content");
	break;
    case "easy-group":
	constraint = new Constraint("Easy fingering transitions group",[],val);
	break;
    case "interval-range":
	constraint = new Constraint("Interval range",[["Minimum","number","min"],["Maximum","number","max"]],"interval-range");
	break;
    case "beating":
	constraint = new Constraint("Beating multiphonics",[["All (unchecked) / None (checked)","checkbox","none"]],"beating");
	break;
    case "shared-consecutive":
	constraint = new Constraint("Shared strongest partials",[],"shared-consecutive");
	break;
    case "difficulty":
	constraint = new Constraint("Difficulty",[["Minimum (1-3)","number","min"],["Maximum (1-3)","number","max"]],"difficulty");
	break;
    default:
	throw "unrecognized constraint";
	break;


    };
    constraint.createForm();
}



function nextSolution() {
    showLoader();

    setTimeout(function () {
	try {
	    let solution = solver.solve();
	    if (solution == false) {
		document.getElementById("results").innerHTML = "There are no (more) solutions.";
		document.getElementById("next-solution").disabled = true;
	    } else {
		let text = solution.map(f => {
		    return `${f.octaveList}\t` + `${f.listUp}`.replace("cis", "c#").padEnd(16) +
			`${f.listLow}`.replace("cis", "c#").padEnd(16) +
			`${f.pitchString()}`;
		}).join("\n");
		showResults(text, solution);
		document.getElementById("next-solution").disabled = false;
	    };
	}
	catch(err) {
	    document.getElementById("results").innerHTML = err;
	};
    }, 100);
}

function showResults(text,solution) {
    let container = document.getElementById("results");
    container.innerHTML = "";
    let textarea = document.createElement("textarea");
    textarea.id = "result-text";
    textarea.rows = 24;
//    textarea.columns = 80;
//    textarea.style.overflowX = "scroll";
    textarea.wrap = "off";
    textarea.readOnly = true;
    textarea.innerHTML = text;//.replace("cis", "c#");
    let downButton = document.createElement("button");
    let lilyButton = document.createElement("button");
    downButton.id = "download-text";
    lilyButton.id = "download-lily";
    downButton.type = "button";
    lilyButton.type = "button";
    //    lilyButton.disabled = true;
    lilyButton.onclick = () => { downloadLilypond(solution);};
    downButton.innerHTML = "Download";
    downButton.onclick = downloadResult;
    lilyButton.innerHTML = "Download Lilypond File";
    let space = document.createTextNode(" ");
    container.appendChild(textarea);
    container.appendChild(downButton);
    container.appendChild(space);
    container.appendChild(lilyButton);
}

function showLoader() {
    let results = document.getElementById("results");
    results.innerHTML = "";
    let spinner = document.createElement("div");
    spinner.className = "loader";
    results.appendChild(spinner);
}

function findSolution() {
    console.log(constraints);
    // showLoader();
    
    let funs = constraints.map(c => c.toPredicate());
    let n = Number(document.getElementById("number").value);
    let randomize = Boolean(document.getElementById("randomizeBox").checked);
    let domain;
    let domainType = document.getElementById("database-select").value;
    switch (domainType) {
    case "mono":
	domain = oboeMonoDB.slice();
	break;
    case "multi":
	domain = oboeMultiDB.slice();
	break;
    case "all":
	domain = oboeMonoDB.slice().concat(oboeMultiDB.slice());
	break;
    };

    if (((domainType != "mono") && (constraints.some(c => monoConstraints.includes(c.id)))) ||
	((domainType != "multi") && (constraints.some(c => multiConstraints.includes(c.id))))) {
	alert("Inconsistent selection of constraints and domain.");
	return;
    };

    ; // copy here
    if (randomize) {
	domain = domain.shuffle();
    };
    solver = new Solver(n, domain, l =>funs.lazyAndFunctionListInput(l));

    nextSolution();
}

function downloadStringWithDate(text,fileEnding) {
    let date = new Date();
    let month = ("0" + (date.getMonth() +　1)).slice(-2);
    let day = ("0" + (date.getDay())).slice(-2);
    let hours = ("0" + (date.getHours())).slice(-2);
    let minutes = ("0" + (date.getMinutes())).slice(-2);
    let seconds = ("0" + (date.getSeconds())).slice(-2);
    let dateString = date.getFullYear() + month + day + hours + minutes + seconds;
    let blob = new Blob([text], {type: "text/plain;charset=utf-8"});    
    saveAs(blob, "oboeseq_" + dateString + "." + fileEnding);    
}

function downloadResult() {
    let text = document.getElementById("result-text").innerHTML;
    downloadStringWithDate(text, "txt");

}

function downloadLilypond(seq) {
//    let text = lily.sequenceToLilypond(seq, true);
    let text = sequenceToLilypond(seq, true);
    downloadStringWithDate(text, "ly");
}
