var text1 = "";
var text2 = "";
var text3 = "";
var text4 = "";
var nets;
var x = 0;
var arraylen;

$("#init").hide();
$("#loader").hide();

$(document).ready(function (e) {

    $("form[ajax=true]").submit(function (e) {

        e.preventDefault();

        var form_data = $(this).serialize();
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();

        var inputext = $("#ssid").val();


        if (inputext == "") {
            alert("Ingrese el SSID para poder conectarte ^-^");
            return;
        }

        $("#content").hide();
        
        $("#loader").show();

        $.ajax({
            url: form_url,
            type: form_method,
            data: form_data,
            cache: false,
            success: function (returnhtml) {
                var out = "";
                if (returnhtml == "127.0.0.1") {
                    out = "La conexión no se pudo realizar, intenta nuevamente con otra red.. :(";
                } else {
                    out = "Conexión realizada exitosamente con la siguiente dirección IP: " + returnhtml ;
                    $("#init").show();
                }
                $("#result").html(out);
                $("#content").show();
                $("#loader").hide();
              
            }
        });

    });

});

scan();

function scan() {
    $.get("/node/nets", function (data) {
        nets = data;
        arraylen = nets.length;
        nets.forEach(myFunction);
        $("#webpagebody").html(text1);
        $("#webpagebody2").html(text2);
        $("#webpagebody3").html(text3);
        $("#webpagebody4").html(text4);
    });
}

function myFunction(value) {

    if ((nets[x] !== "")) {
        if (x < (arraylen / 4)) {
            text1 += '<button  onclick="button(this)" class="btn btn-block btn-primary" style="margin-bottom:15px; margin-top:15px;">';
            text1 += nets[x] + "</button>";
        }
        else if (x < (arraylen / 2)) {
            text2 += '<button onclick="button(this)" class="btn btn-block btn-primary" style="margin-bottom:15px; margin-top:15px;">';
            text2 += nets[x] + "</button>";
        } else if (x < (3 * arraylen / 4)) {
            text3 += '<button onclick="button(this)" class="btn btn-block btn-primary" style="margin-bottom:15px; margin-top:15px;">';
            text3 += nets[x] + "</button>";
        } else {
            text4 += '<button onclick="button(this)" class="btn btn-block btn-primary" style="margin-bottom:15px; margin-top:15px;">';
            text4 += nets[x] + "</button>";
        }

    }
    x++;
}


function button(obj) {
    var t = $(obj).text();
    $("#ssid").val(t)
}

function go(){
    console.log("Iniciando");
    window.location.replace("/index.html");
}

function Reset(){
    location.reload();
  }