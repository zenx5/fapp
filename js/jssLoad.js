function jssLoad(){
	var elem = document.querySelectorAll('*[class^=jss-]');
	for(var i = 0; i < elem.length; i++){
		var classlist = elem[i].classList;
		for(j = 0; j < classlist.length; j++){
			if(classlist[j].search("jss-c-")!=-1){
				var type = classlist[j].split("-")[2].replace("!","-"); 
				//console.log(type)
				var tag = classlist[j].split("-")[3];
				var value = classlist[j].split("-")[4];
				if(type === '*'){
					for(var k = 0; k < elem[i].childElementCount; k++){
						elem[i].children[k].style[tag] = value.split('_').join(' ');
					}	
				}
				else{
					selectElem = elem[i].querySelectorAll(type);
					for(var k = 0; k < selectElem.length; k++){
						selectElem[k].style[tag] = value.split("_").join(" ");
					}	
				}	
			}
			else if(classlist[j].search("jss-")!=-1){
				var tag = classlist[j].split("-")[1];
				var value = classlist[j].split("-")[2].split("_").join(" ");
				//console.log(tag+" = "+value)
				elem[i].style[tag] = value;
			}
		}
	}
}	