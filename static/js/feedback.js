function suggest_doctors(specialisation){
    //alert(specialisation)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/doctors_speciality_suggestions?speciality=" + specialisation, false);
    xhr.send();
    var myArr = JSON.parse(xhr.responseText);

    var doctors = document.getElementById("doctors");
    var menu = "<option value = ''> Choose a doctor </option>"

    for(i = 0; i < myArr.length; ++i) {
        menu += "<option value = '" + myArr[i]._id + "'>" + myArr[i].name + "</option>"; 
    }

    doctors.innerHTML = menu;

    //console.log(myArr)

}