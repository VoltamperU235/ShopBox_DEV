var table = "";
var tableinit = " ";
var last;
var items = true;
var jsonfinalpos = 0;
var totalmount = 0;
var logged = false;
var someproduct = false;
var lastuser = "lastuser";
var global;
var my_ip_add;

var background = '\
<div class="container" style="margin-top: 1em">\
    <div class="row">\
        <div class="col">\
                <img src="icons/cart.png" class="rounded mx-auto d-block" alt="Responsive image" style="margin-top: 25px;">\
        </div>\
        <div class="col">\
             <p style="margin-top:105px;" class="text-center">Compra algo...!</p>\
             <img src="icons/credit-card.png" class="rounded mx-auto d-block" alt="Responsive image">\
        </div>\
    </div>\
'

$.get("/node/init")
$("#agregarDB").hide();
$("#scanw").hide();
$("#agregaruserDB").hide();
$("#warning").hide();


function show_warning() {
  $("#warning").show();
  setTimeout("hide_warning()", 3000)
  $.get("/node/informed")

}

function hide_warning() {
  $("#warning").hide();
}


function UpdateItemList() {
  table = "";
  tableinit = '\
<table class="table table-striped table-dark">\
<thead>\
    <tr>\
      <th scope="col">#Item</th>\
      <th scope="col">Unidades</th>\
      <th scope="col">Producto</th>\
      <th scope="col">Precio</th>\
      <th scope="col">Subtotal</th>\
    </tr>\
</thead>\
<tbody>\
 ';


  logged = false;

  $.ajax(
    {
      cache: false,
      type: "GET",
      url: '/node/status',
      dataType: 'json',
      success: function (data) {
        console.log("nocambio")
        if (data == 1) {
          idleTime = 0;

          console.log("cambio")
          $.ajax(
            {
              type: 'GET',
              url: '/JSONlite',
              dataType: 'json',
              cache: false,
              success: function (data) {
                console.log(data)
                global = data;
                if (data.length > 0) {
                  someproduct = false;
                  table = "";
                  var numberOfElements = data.length;
                  if (numberOfElements < 2) {
                    please_shop();
                    $(" #user ").html('<p style="font-family: INFO;font-size: 150%; margin-top:30px; margin-bottom:0px;">Login!</p>');
                    $(" #userpicture ").html('<img  class="float-right" id="userlock" src="icons/bloqueado2.png" alt="lock">');

                    return;
                  }
                  items = true;
                  $.each(data, function (key, val) {
                    jsonfinalpos++;

                    if ('precio' in data[key]) {
                      someproduct = true;
                      table += "<tr>";
                      table += '<td scope="col">' + key + '</td>';
                      table += '<td scope="col">' + data[key].counter + '</td>';
                      table += '<td scope="col">' + data[key].producto + '</td>';
                      table += '<td scope="col">Q' + data[key].precio + '</td>';
                      table += '<td scope="col">Q' + data[key].subtotal + '</td>';
                      table += "</tr>";
                    } else if ("user" in data[key]) {
                      logged = true;
                      if (data[key].user != lastuser) {

                        if ("admin" in data[key]) {
                          if (data[key].admin == "1") {
                            $("#agregarDB").show();
                            $("#agregaruserDB").show();
                            $("#scanw").show();
                          }
                        }
                        $(" #user ").html(data[key].user + "<br>" + data[key].empresa);
                        $(" #userpicture ").html('<img id="userlock" class="float-right" src="icons/wifi.png" alt="lock">');

                        lastuser = data[key].user;
                      }
                    } else if (data[key].hasOwnProperty("total")) {
                      totalmount = data[key].total;
                    }
                  });


                  tableinit += table;
                  tableinit += '</tbody></table>';
                  if (!someproduct) {
                    tableinit += '<div class="container-fluid" style="margin-bottom: 15px;">\
                <div class="row">\
                    <div class="col">\
                    </div>\
                    <div class="rounded col-md-auto col-sm-12 col-sx-12 bg-dark text-white" style="font-size: 150%;font-family: INFO;padding-top:10px;">\
                        Añade Algo..!!\
                    </div>\
                    <div class="col"> \
                    </div>\
                </div>\
            </div>';
                  }
                  tableinit += ' <div class="container-fluid text-white bg-dark "><div class="row"><div class="col-md-9 col-sm-7 col-xs-2"></div><div id="totalmount" class="col text-left"> TOTAL: Q' + totalmount + '</div></div></div>';
                  jsonfinalpos = 0;
                  if (logged) {
                    tableinit += '<div class="container" style="margin-top:20px;">\
            <div class="row">\
                <div class="col">'
                    var color = ""
                    if (someproduct) {
                      color = "btn-success";
                    } else {
                      color = "btn-light";

                    }
                    tableinit += '<button id = "buy" onclick = "buy()" type = "button" class="btn ' + color + ' btn-lg rounded float-right"> Comprar</button>';

                    tableinit += '</div>\
                <div class="col">\
                      <button id="cancel" onclick="reload()" type="button" class="btn btn-danger btn-lg rounded float-left">Cerrar Sesión</button>\
                </div>\
            </div>\
            </div>\
            ';
                  }
                  else {

                    console.log("disloged")
                    lastuser = "disloged";
                    $(" #user ").html('<p style="font-family: INFO;font-size: 150%; margin-top:30px; margin-bottom:0px;">Login!</p>');
                    $(" #userpicture ").html('<img  class="float-right" id="userlock" src="icons/bloqueado2.png" alt="lock">');
                    tableinit += '<div id="login" class="container-fluid">\
                  <div class="row text-center">\
                      <div class="col">\
                      </div>\
                      <div class="col-md-auto">\
                          <img src="icons/bloqueado.png" alt="lock">\
                      </div>\
                      <div class="col float-left">\
                          <div style="margin-top: 25px" class="container">\
                              <div class="row">\
                                  <h2>Please Login..!!</h2>\
                              </div>\
                              <div id="logininfo" class="row text-left">\
                                  Para comprar, necesitas ingresar... <br>\
                                  Usa tu Barcode...!!\
                              </div>\
                          </div>\
                      </div>\
                      <div class="col">\
                      </div>\
                  </div>\
                  <div class="row">\
                  <div class="col">\
                    </div>\
                    <div class="col-md-auto">\
                       <button id="cancel" onclick = "reload()" type="button" style="margin-top: 20px;" class="btn btn-danger btn-lg rounded">Cancelar</button>\
                       </div>\
                    <div class="col">\
                    </div>\
                  </div>\
                </div>';
                  }


                  if (tableinit != last) {
                    $("#webpagebody").html(tableinit);
                    console.log("UPDATED");


                  }

                  last = tableinit;
                  tableinit = "";

                }


              }
            }
          )


          $.get("/node/ok");

        }


      }
    })
}


function countDown() {

  setTimeout("countDown()", 700);
  UpdateItemList();
  // setTimeout("please_shop()", 900);

}

function detect() {

  setTimeout("detect()", 1000);
  $.get("/node/error", function (data) {
    if (data == 1) {
      show_warning();
      idleTime = 0;
    }
  });
}

function please_shop() {
  if (items == true) {
    $("#webpagebody").html(background);
    last = " ";
    items = false;
  }
}

function buy() {
  if (!someproduct) {
    alert("Antes de pagar, compra algo ^-^");
  } else {
    $.get("/node/Buy");
    alert("Gracias por comprar")
  }
}

function reload() {
  $.get("/node/ResetJSON");
  window.location.reload();
  lastuser = "default"
}

function log() {
  alert("Usar tu Barcode para ingresar")
}
countDown();
detect();


window.onerror = function (error) {
  window.location.reload();

};

function Reset() {
  window.location.reload();
}

var idleTime = 0;
$(document).ready(function () {
  //Increment the idle time counter every minute.
  var idleInterval = setInterval(timerIncrement, 10000); // 10 seconds

  //Zero the idle timer on mouse movement.
  $(this).mousemove(function (e) {
    idleTime = 0;
  });
  $(this).keypress(function (e) {
    idleTime = 0;
  });
});

function timerIncrement() {
  idleTime = idleTime + 1;
  if (idleTime > 3) { // 1 minutes
    $.get("/node/ResetJSON");
    location.replace("/mupi.html")
  }
}


function my_ip() {

  setTimeout("my_ip()", 10000);
  $.ajax(
    {
      cache: false,
      type: "GET",
      url: '/node/ip',

      success: function (data) {
        my_ip_add = data;
        $("#IP").val("IP: " + my_ip_add)

      }
    }
  )
}
my_ip();


