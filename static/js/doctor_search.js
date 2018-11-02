function suggest() {
    document.getElementById("suggestion_box").innerHTML = "";
    var search_txt = document.getElementById("search_txt");
    if(search_txt.value == "") {
        document.getElementById("suggestion_box").innerHTML = "";
    }
    else {
        var xhr = new XMLHttpRequest();
        console.log(xhr.readyState);
        xhr.open("GET", "/doctor_name_suggestions?name=" + search_txt.value, true);

        

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200){
                var myArr = JSON.parse(this.responseText);
                console.log(myArr);
                display_suggestion(myArr);
            }
            //console.log(xhr.readyState);
        };
        
        function display_suggestion(arr) {
            for (var i = 0; i < arr.length; i++) {
                div = document.createElement("div");
                div.className = "input-groupx input-group-bigx"
                div.innerHTML = arr[i];
                div.onclick = suggestion_selected;
                div.onmouseover = function (e) {
                    this.style.backgroundColor="#CEC5C5"
                };
                div.onmouseout = function (e) {
                    this.style.backgroundColor="white"
                };
                document.getElementById("suggestion_box").appendChild(div);
            }
        }
        xhr.send();
        //console.log(xhr.readyState);
    }
}

function suggestion_selected(e) {
    document.getElementById("suggestion_box").innerHTML = "";
    search_txt.value = e.target.innerHTML;
}

function search() {
    var info_div = document.getElementById("results");
    var search_txt = document.getElementById("search_txt");
    info_div.innerHTML = "";
    var xhr = new XMLHttpRequest();
    console.log(xhr.readyState);
    xhr.open("POST", "/search", true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");			

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200){
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
            display_search(myArr);
        }
        //console.log(xhr.readyState);
    };
    
    function display_search(arr) {
        for (var i = 0; i < arr.length; i++) {
            div = document.createElement("div");
            div.className = "tab-pane active input-groupx input-group-bigx";
            div.style = "color: #000";
            // div.style.width = "250px";
            div.innerHTML = 
                    "Name: " + arr[i].name + "<br/>" +  
                    "Specialization: " + arr[i].specialization + "<br/>" + 
                    "Highest Qualification: " + arr[i].qualification + "<br/>" +
                    "Years of experience: " + arr[i].experience + "<br/>" +
                    "e-mail: " + '<a href="mailto:' + arr[i].email + '">' + arr[i].email + "</a>" + "<br/>" +
                    "About: " + arr[i].about + "<br/>" 
                    ;

            // div.onmouseover = function (e) {
            //     this.style.backgroundColor="#CEC5C5"
            // };
            // div.onmouseout = function (e) {
            //     this.style.backgroundColor="white"
            // };
            info_div.appendChild(div);
        }
    }
    xhr.send("doctor_name=" + search_txt.value);
    //console.log(xhr.readyState);
}
