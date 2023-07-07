//DRAGGABLE ELEMENT (COURTESY OF W3SCHOOLS)
dragElement(document.getElementById("draggable"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "draghead")) {
        document.getElementById(elmnt.id + "draghead").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//INSTRUCTIONS CONTROL
let instructionsButton = document.querySelector("#instructions"),
    closeButton = document.querySelector("close"),
    draggable = document.querySelector("#draggable"),
    draggableClass = document.querySelector("#draggable").classList;
instructionsButton.addEventListener("click", openInstructions);
closeButton.addEventListener("click", closeInstructions);

function openInstructions() {
    draggable.setAttribute("style", "transition:0.3s");
    draggableClass.remove("hidden"); draggableClass.add("visible");
    setTimeout(draggableNoStyle, 300);
}

function draggableNoStyle() {
    draggable.removeAttribute("style");
}

function closeInstructions() {
    draggableClass.remove("visible"); draggableClass.add("hidden");
}

//BUTTONS
//declarations.
let clearButton = document.querySelector("#clear_form"),
    copyButton = document.querySelector("#copy_output"),
    submitButton = document.querySelector("#submit"),
    sexRadio = document.getElementsByName("sex"),
    speciesRadio = document.getElementsByName("species");

//event listeners.
clearButton.addEventListener("click", clearForm);
copyButton.addEventListener("click", copyOutput);
submitButton.addEventListener("click", writeHistory);

//clear form button: clears form from old history and up.
function clearForm() {
    document.getElementsByName("name")[0].value = "";
    document.querySelector("#male").checked = true; document.querySelector("#female").checked = false;
    document.querySelector("#canine").checked = true; document.querySelector("#feline").checked = false;
    document.getElementsByName("old_history")[0].value = "";
}

//copy to clipboard button: copies output to clipboard.
function copyOutput() {
    let copyText = document.getElementById("output");

    copyText.select(); copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}

//HISTORY WRITING
//takes arguments, parsing the last argument as "oldHistory" with the rest as "searchTerms". if a search term is not in "oldHistory", returns null.
function searchOldHistory() {
    let args = Array.from(arguments),
        oldHistory = args.pop(),
        searchTerms = args,
        lowerCase = oldHistory.toLowerCase(),
        result = null;
    for (i = 0; i < searchTerms.length; i++) {
        let searchTerm = searchTerms[i].toLowerCase();
        result = oldHistory.substring(lowerCase.indexOf(searchTerm) + searchTerm.length);
        if (lowerCase.indexOf(searchTerm) == -1) {
            result = null;
        } else {
            result = result.split("*")[0];
            result = result.substring(0, result.length - 2);
            break;
        }
    }
    return result;
}

//checks which radios are checked.
function isChecked(radioName) {
    let list = document.getElementsByName(radioName),
        value;
    list.forEach(function (input) {
        if (input.checked == true) {
            value = input.value;
        }
    });
    return value;
}

//generates pronouns from whichever sex is checked.
function pronounCheck(sexValue) {
    let pronoun = "";
    if (sexValue == "male") {
        pronoun = "he";
    } else {
        pronoun = "she";
    }
    return pronoun;
}

//figures out whether patient will require feline-specific values or not.
function speciesValues(array, patient) {
	let species = isChecked("species"),
	    output;
	if (species == "canine") {
	    output = array[0] + array[1]
        } else {
            output = array[0] + "\n\n*FeLV*:" + patient.FeLV + "\n\n*FIV*:" + patient.FIV + "\n\n*Indoor or outdoor*:" + patient.inOut + basic[1]
        }
	return output;
}

//puts everything together and outputs new history.
function writeHistory() {
    //gathering values.
    let oldHistory = document.getElementsByName("old_history")[0].value,
        historyType = document.getElementsByName("desired_history")[0].value,
        patient = {
            name: document.getElementsByName("name")[0].value,
            sex: isChecked("sex"),
            species: isChecked("species"),
            prevDental: searchOldHistory("*Previous oral surgery or cleaning*:", oldHistory),
            healthProblems: searchOldHistory("*Health problems*:", "*Current health problems or other concerns*:", "*Pertinent Medical History*:", oldHistory),
            medications: searchOldHistory("*Medications*:", oldHistory),
            allergies: searchOldHistory("*Allergies*:", oldHistory),
            rabies: searchOldHistory("*Rabies*:", oldHistory),
            FeLV: searchOldHistory("*FeLV*:", oldHistory),
            FIV: searchOldHistory("*FIV*:", oldHistory),
            inOut: searchOldHistory("*Indoor or outdoor*:", oldHistory),
            diet: searchOldHistory("Diet*:", "*Current diet*:", oldHistory),
            patientBio: searchOldHistory("*Patient bio*:", oldHistory),
            treats: searchOldHistory("*Chews & treats*:", oldHistory),
            toys: searchOldHistory("*Toys*:", oldHistory),
            dentalProducts: searchOldHistory("*Dental care products used at home*:", oldHistory),
            brushing: searchOldHistory("*Brushing*:", oldHistory)
        },
        petPronoun = pronounCheck(patient.sex),
        //declaring default values for when said values are null.
        defPatientBio = patient.name + " is #INPUT#['Does " + patient.name + " have specialized training?'/a pet/a show dog/a breeding dog/an agility dog/an obedience dog/a shutzhund dog/a police dog/a service dog/a hunting dog]who was acquired #INPUT#['Acquired from?'/from a breeder/from a shelter/from a private party/as a stray]when " + petPronoun + " was #INPUT#",
        defAllergies = " #INPUT#['Does patient have any known allergies?'/No known allergies./#INPUT#]",
        defRabies = " #INPUT#['Is patient up-to-date on rabies vaccine?'/Up to date until #INPUT#/Not up to date according to our records as of #INPUT#./Not up to date, patient is exempt. See letter from rDVM./Not up to date, patient is too young.]",
        defBrushing = "Owner is #INPUT#['Brushing teeth?'/not brushing teeth.['Would you like a tooth brushing lesson?'/Demonstrated how to brush teeth and encouraged daily brushing with pet toothpaste and a soft bristle toothbrush./Owner declined a tooth brushing lesson./Unable to brush teeth./]/brushing once a day.['Would you like to review your technique or like any tips?'/'No'/Reviewed brushing technique and products with owner./]/brushing every other day.['Would you like to review your technique or like any tips?'/'No'/Reviewed brushing technique and products with owner./]/brushing twice a week.['Would you like to review your technique or like an tips?'/'no'/Reviewed brushing technique and products with owner./]/brushing once a week.['Would you like to review your technique or like any tips?'/'no'/Reviewed brushing technique and products with owner./]/brushing once a month.['Would you like to review your technique or like any tips?'/'no'/Reviewed brushing technique and products with owner./]/brushing twice a month.['Would you like to review your technique or like any tips?'/'no'/Reviewed brushing techniques and products with owner./]/not brushing; {AnimalName} has no remaining teeth.]",
        defFeLV = " #INPUT#['Is this cat'/positive/negative/not tested/unknown]",
        defFIV = " #INPUT#['Is this cat'/positive/negative/not tested/unknown]",
        defInOut = "* #INPUT#['Is this cat'/Indoor/Outdoor]",
        defaultsStrings = ["defPatientBio", "defAllergies", "defRabies", "defBrushing", "defFeLV", "defFIV", "defInOut"],
        defaults = [defPatientBio, defAllergies, defRabies, defBrushing, defFeLV, defFIV, defInOut]
        basic = [];

    //set "brushing" section.
    let brushingString = patient.brushing;
    if (brushingString == null) {
        patient.brushing = defBrushing;
    } else {
        patient.brushing = brushingString.substring(0, brushingString.indexOf("\n"));
    }

    //go through each key in patient and figure out which ones are null and need to be replaced with default values.
    for (const key in patient) {
        let firstLetter = key.charAt(0).toUpperCase(),
            remainingLetters = key.substring(1),
            currentKey = firstLetter + remainingLetters,
            defaultIndex = defaultsStrings.indexOf("def" + currentKey);
        console.log(key + ": " + patient[key]);
        if (patient[key] == null && defaultIndex > -1) {
            patient[key] = " " + defaults[defaultIndex];
        } else if (patient[key] == null && defaultIndex == -1) {
            patient[key] = " #INPUT#";
        }
    }

    //if statements for specific but common situations wherein unnecessary information needs to get removed.
    let healthProblemString = patient.healthProblems,
    dietString = patient.diet,
    medicationString = patient.medications,
    inOutString;
    if (patient.inOut != null) {
        inOutString = patient.inOut;
    };
    if (dietString.indexOf(patient.name) != -1) {
        dietString = patient.diet;
        patient.diet = dietString.substring(0, dietString.indexOf(patient.name) - 2);
    };
    if (inOutString.indexOf("\n") != -1) {
        inOutString = patient.inOut;
        patient.inOut = inOutString.substring(0, inOutString.indexOf("\n") - 1);
    };
    if (healthProblemString.indexOf("\n\n") != -1) {
        patient.healthProblems = healthProblemString.substring(0, healthProblemString.indexOf("\n\n"));
    };
    if (medicationString.indexOf("Verified") != -1) {
        patient.medications = medicationString.substring(0, medicationString.indexOf("Verified") - 1);
    };

    //actually writing the history.
    if (historyType == "admission") {
        document.getElementsByName("output")[0].value = "*Time patient last ate*: #INPUT#\n\n*Health problems*:" + patient.healthProblems + "\n\n#INPUT#['Any changes to health, appetite or behavior?'/No changes to health, appetite or behavior/Changes since last appointment: #INPUT#]\n\n*Medications*:" + patient.medications + "\n\n*Allergies*:" + patient.allergies + "\n\n*Diet*:" + patient.diet + "\n\n*Dental care products used at home*:" + patient.dentalProducts + "\n\n*Brushing*:" + patient.brushing + "\n\n#INPUT#['Is the owner still giving bad list treats?'/Owner is still giving toys or treats that are not recommended. Reminded owner items can damage teeth./Owner has discarded all toys and treats that can damage teeth./'Was not giving any bad items to begin with']\n\n#INPUT#['Does client want a toenail trim while patient is under anesthesia?'/Perform a toenail trim./Do NOT perform a toenail trim.]\n\n#INPUT#['Go over treatment plan with owner'/Went over treatment plan with owner./Owner did not consent to treatment plan.]\n\n#INPUT#['Does owner consent to us performing agreed-upon treatment(s) without prior phone call?'/Owner consents to us performing agreed-upon treatment(s) without prior phone call./Owner would like phone call prior to *all* treatment(s), even if previously discussed at consultation.]\n\n#INPUT#['Does owner consent to us performing treatment(s) deemed necessary mid-procedure, even if said treatment(s) may exceed estimate, without prior phone call?'/Owner consents to us performing additional treatment(s) deemed necessary mid-procedure, even if said treatment(s) may exceed estimate, without prior phone call./Owner would like phone call prior to performing additional treatment(s) deemed necessary mid-procedure.]\n\n#INPUT#['Go over anesthetic consent form.'/Owner consents to anesthetic procedure and signed anesthesia consent form./Owner does not consent to anesthesia and did not sign form.]\n\n#INPUT#['Go over CPR status.'/Owner consents to use of CPR should patient arrest./Owner **does not** consent to CPR; if patient arrests, do not resuscitate.]\n\n*Primary contact name and number for today*: #INPUT#";
    } else if (historyType == "c&s") {
        basic = ["*Reason for visit*: #INPUT#\n\n*Time patient last ate*: #INPUT#\n\n*Oral history*: #INPUT#\n\n*Previous oral surgery or cleaning*:" + patient.prevDental + "\n\n*Health problems*:" + patient.healthProblems + "\n\n*Recent bloodwork and diagnostics*: #INPUT#\n\n*Medications*:" + patient.medications + "\n#INPUT#['Did you ask the owner if the above medications are accurate and currently being administered?'/Verified the above medication, dosage and frequency with owner. They are accurate and currently being administered./'No is not an option. Go back and verify with owner to ensure patient safety.']\n\n*Allergies*:" + patient.allergies + "\n\n*Rabies*:" + patient.rabies, "\n\n*Diet*:" + patient.diet + "\n\n*Patient bio*:" + patient.patientBio + "\n\n*Chews & treats*: " + patient.treats + "\n\n*Toys*:" + patient.toys + "\n\n#INPUT#['Did you review the Good-Bad List with client?'/Reviewed list of items that may break teeth./'No']\n\n*Dental care products used at home*:" + patient.dentalProducts + "\n\n*Brushing*: " + patient.brushing + "\n\n#INPUT#['Does client want a toenail trim while patient is under anesthesia?'/Perform a toenail trim./Do NOT perform a toenail trim.]\n\n#INPUT#['Go over treatment plan with owner'/Went over treatment plan with owner./Owner did not consent to treatment plan.]\n\n#INPUT#['Does owner consent to us performing agreed-upon treatment(s) without prior phone call?'/Owner consents to us performing agreed-upon treatment(s) without prior phone call./Owner would like phone call prior to *all* treatment(s), even if previously discussed at consultation.]\n\n#INPUT#['Does owner consent to us performing treatment(s) deemed necessary mid-procedure, even if said treatment(s) may exceed estimate, without prior phone call?'/Owner consents to us performing additional treatment(s) deemed necessary mid-procedure, even if said treatment(s) may exceed estimate, without prior phone call./Owner would like phone call prior to performing additional treatment(s) deemed necessary mid-procedure.]\n\n#INPUT#['Go over anesthetic consent form.'/Owner consents to anesthetic procedure and signed anesthesia consent form./Owner does not consent to anesthesia and did not sign form.]\n\n#INPUT#['Go over CPR status.'/Owner consents to use of CPR should patient arrest./Owner **does not** consent to CPR; if patient arrests, do not resuscitate.]\n\n*Primary contact name and number for today*: #INPUT#"];
        document.getElementsByName("output")[0].value = speciesValues(basic, patient);
    } else if (historyType == "recheck") {
        document.getElementsByName("output")[0].value = "*" + patient.name + " was last seen on*:  #INPUT#\n*Procedure performed*: #INPUT#\n\n*How has " + patient.name + " been doing since the last appointment?* #INPUT#\n\n#INPUT#['Any new concerns or medical issues?'/Owner is concerned about #INPUT#/There are no concerns at this time.]\n\n*Health problems*:" + patient.healthProblems + "\n\n*Medications*:" + patient.medications + "\n\n*Diet*:" + patient.diet + "\n\n*Brushing*:" + patient.brushing
    } else if (historyType == "6mo") {
        basic = [document.getElementsByName("output")[0].value = "*Reason for visit*: #INPUT#\n\n*" + patient.name + " was last seen on*:  #INPUT#\n*Procedure performed*: #INPUT#\n\n*Oral history*: #INPUT#\n\n*Health problems*:" + patient.healthProblems + "\n\n*Recent bloodwork and diagnostics*: #INPUT#\n\n*Medications*:" + patient.medications + "\n\n*Allergies*:" + patient.allergies + "\n\n*Rabies*:" + patient.rabies, "\n\n*Diet*:" + patient.diet + "\n\n*Dental care products used at home*:" + patient.dentalProducts + "\n\n*Brushing*:" + patient.brushing];
        document.getElementsByName("output")[0].value = speciesValues(basic, patient);
    } else if (historyType == "echo") {
        document.getElementsByName("output")[0].value = "*Time patient last ate*: #INPUT#\n\n*Diet*:" + patient.diet + "\n\n*Health problems*:" + patient.healthProblems + "\n\n*Medications*:" + patient.medications + "\n\n#INPUT#['Go over use of oral sedation.'/Owner consents to use of oral sedation if necessary./Owner **does not** consent to use of oral sedation; do not administer.]\n\n#INPUT#['Go over CPR status.'/Owner consents to use of CPR should patient arrest./Owner **does not** consent to CPR; if patient arrests, do not resuscitate.]\n\n*Primary contact for today*: #INPUT#"; 
    }
}