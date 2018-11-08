function process(val) {
    if( val == "ward" ) {
        $.ajax({
            type: "GET",
            url: "/gimme_a_ward_number"
        }).done(function(o) {
           if(o == ""){
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No wards are free!',
                    footer: 'Plz take the patient to another hospital asap'
                });
           }
           else {
                $("#ward_number").val(o);
                $("#icu_number").val("")
           }
        });
    } else if( val == "icu" ){
        $.ajax({
            type: "GET",
            url: "/gimme_a_icu_number"
        }).done(function(o) {
           if(o == ""){
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No ICUs are free!',
                    footer: 'Plz take the patient to another hospital asap'
                });
           }
           else {
                $("#icu_number").val(o);
                $("#ward_number").val("")
           }
        });
    }
    
}

function nurse(val) {
    //swal(val)
    if( val == "yes" ) {
        $.ajax({
            type: "GET",
            url: "/assign_nurse"
        }).done(function(o) {
           $("#nurse_id").val(o);
        });
    }
    else{
        $("#nurse_id").val("");
    }
}

function doctor(specialization) {
    if (specialization != "") {
        $.ajax({
            type: "GET",
            url: "/assign_doctor?specialization=" + specialization 
        }).done(function(o) {
            $("#doctor_id").val(o);
        });
    }
    else{
        $("#doctor_id").val("");
    }
}

function registered() {
    swal({
        type: 'success',
        title: 'Done...',
        text: 'Successfully registered patient',
        footer: '......'
    });
}