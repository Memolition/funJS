//Functions JavaScript(funnjs) By Memolition
function funnjsTrim(input) {
    return input.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/([\s]+)/g, '-');
}

funnFormValidate = function(form, mssg){
	mssg = mssg || 'Error: Form not Valid';
	var form_to = form.name,
	elems = document.forms[form_to].getElementsByTagName("input");
	for(var i = 0; i < elems.length + 1; i++) {
		if(elems[i].type != 'submit') {
			var string = funnjsTrim(elems[i].value);
			if(!string.length) {
				alert(mssg);
				error = 'error';
				return false
			}
		}
	}
		if(typeof error == "undefined"){
			alert('Valid');
			return true;
		}
}
