 // Inicializacion de variables
var database = null;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;



var database = indexedDB.open("iglesiasdb", 1);// abrimos la bd
        
database.onupgradeneeded = function (e) { //Se crea la bd si no existe
    var active = database.result;
            
    var options = {
            keyPath: 'id',
            autoIncrement: true
        };
            
    var opc_iglesias = {
            keyPath: 'id'
        };
    
    var opc_favoritos = {
            keyPath: 'id',
            autoIncrement: true
        };
            
                       
    var object = active.createObjectStore('usuarios', options);
    var transaction = e.target.transaction;
           
    var objIglesias = active.createObjectStore('iglesias', opc_iglesias);
    
    var objFavoritos = active.createObjectStore('favoritos', opc_favoritos);
            
    object.createIndex('by_username', 'username', { unique : true});
            
    objFavoritos.createIndex('by_fav', ['id_iglesia', 'id_user'], {unique: true});
    objFavoritos.createIndex('by_id_user', 'id_user', {unique: false});
            
    //Cargando iglesias correspondientes
    transaction.oncomplete = function (e) {
        var transact = active.transaction(["iglesias"], "readwrite");
        var iglesias = transact.objectStore("iglesias");
             
        iglesias.add({id: 1, name: 'Catedral San Cristobal', place: 'San Cristobal'});
        iglesias.add({id: 2, name: 'Iglesia Nuestra Señora del Rosario de Chiquinquira', place: 'Lobatera'});
        iglesias.add({id: 3, name: 'Iglesia San Jose', place: 'San Cristobal'});
        iglesias.add({id: 4, name: 'Iglesia San Juan Bautista', place: 'San Cristobal'});
        iglesias.add({id: 5, name: 'Santuario Nuestra Senora del Perpetuo Socorro', place: 'San Cristobal'});
        iglesias.add({id: 6, name: 'Iglesia El Angel', place: 'San Cristobal'});
        iglesias.add({id: 7, name: 'Basílica de Nuestra Señora de la Consolación de Táriba', place: 'Tariba'});
        iglesias.add({id: 8, name: 'Basílica del Espiritu Santo', place: 'La Grita'});
        iglesias.add({id: 9, name: 'Iglesia Santa Barbara', place: 'Rubio'});
        iglesias.add({id: 10, name: 'Iglesia San Antonio de Padua', place: 'San Antonio del Tachira'});
        iglesias.add({id: 11, name: 'Iglesia San Pedro de Seboruco', place: 'Seboruco'});
        iglesias.add({id: 12, name: 'Iglesia San Pedro', place: 'San Pedro del Rio'});
        iglesias.add({id: 13, name: 'Iglesia Nuestra Señora del Carmen', place: 'Peribeca'});
        iglesias.add({id: 14, name: 'Iglesia San Bartolome de Vargas', place: 'El Cobre'});
        iglesias.add({id: 15, name: 'Iglesia San Jose', place: 'San Jose de Bolivar'});

        console.log('iglesias agregadas correctamente');
    }
};
        
database.onsuccess = function (e) {
    console.log('databse loaded');
};
        
database.onerror = function (e) {
    console.log('Error loading database');
};

    
function registrar() {
    var active = database.result;
    var data = active.transaction(["usuarios"], "readwrite");
    var object = data.objectStore("usuarios");
    
    var request = object.put({
            username: document.querySelector("#username").value,
            name: document.querySelector("#name").value,
            passwd: document.querySelector("#pass").value
        });

    request.onerror = function (e) {
        alert(request.error.name + '\n\n' + request.error.message);
    };

    data.oncomplete = function (e) {
        document.querySelector("#username").value = '';
        document.querySelector("#name").value = '';
        document.querySelector("#pass").value = '';
        console.log('Objeto agregado correctamente');
        $("#succes_register").popup("open");
        setTimeout(function () {  window.location.href = 'index.html'; }, 3000);
                
    };
    
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
    
function ingresar() {
    var active = database.result;
    var data = active.transaction(["usuarios"], "readonly");
    var object = data.objectStore("usuarios");
    var username = document.querySelector("#username_login").value;
    var password = document.querySelector("#pass_login").value;
    var index = object.index('by_username');
    var request = index.get(String(username));
        
    request.onsuccess = function () {
        var userActual = request.result;

        if (userActual === undefined) {
               // alert("usuario no encontrado");
            $("#wrong_user").popup("open");
            setTimeout(function () {  $("#wrong_user").popup("close"); }, 2000);
        } else {
                
            if (userActual.passwd != password) {                
                $("#wrong_passwd").popup("open");
                setTimeout(function () { $("#wrong_passwd").popup("close"); }, 2000);
                    
            } else {
                sessionStorage.setItem('name', userActual.name);
                sessionStorage.setItem('username', userActual.username);
                sessionStorage.setItem('id_user', userActual.id);
                cargarFavoritos();
                $("#welcome_user").append("<span> " + userActual.name + " </span> ");
                $("#welcome_user").popup("open");
                setTimeout(function () { window.location.href = 'index.html'; }, 3000);   
            }
        }
            
    };
         
    data.oncomplete = function (e) {
        document.querySelector("#username_login").value = '';
        document.querySelector("#pass_login").value = '';        
    };
      

}
 

$(document).on("pagecreate", "#favoritas", function () {

var idUser = sessionStorage.getItem('id_user');
  var active = database.result;
    var data = active.transaction(["favoritos"], "readonly");
    var object = data.objectStore("favoritos");
    var index = object.index('by_id_user');    
    var request = index.openCursor(String(idUser));
        
    
    request.onsuccess = function(event){       
         var cursor = request.result;
    if(cursor){
        console.log('si hay cursor, iduser: '+idUser);
      //  console.log(cursor.value.iglesia);
        $('#favs').append('<li> <h3> '+ cursor.value.iglesia+ '</h3> <p> '+ cursor.value.lugar +' </p> </li>');
        $('#favs').listview('refresh');
         //elements.push(cursor.value.id_iglesia);
         cursor.continue();
        }
    };   
    
   
    
   
});
 
$(document).on("pageinit", "#iglesias", function () {

    if (sessionStorage.getItem('username')) {       
        habilitarChecks();
    }
    
    $(".favorito").change(function () {
        var nombre = $(this).closest('li').find('h3').text();
       var lugar = $(this).closest('li').find('p').text();
        
       // console.log($(this).parent('h3').text());
    var idIglesia = $(this).data("id");
        var idUser = sessionStorage.getItem('id_user');
        if ($(this).is(':checked')) {
        
            agregarFavorito(idIglesia, idUser, nombre, lugar);               
        } else { eliminarFavorito(idIglesia, idUser);
            }
    });
});



// ---  Agregar a Favorito --- // 
function agregarFavorito(idIglesia, idUser, nombre, lugar) {
    var active = database.result;
    var data = active.transaction(["favoritos"], "readwrite");
    var object = data.objectStore("favoritos");
    
    var request = object.put({
                    id_iglesia: idIglesia,
                    id_user: idUser,
                    iglesia: nombre,
                    lugar: lugar
                });
    
    request.onerror = function (e) {
            alert(request.error.name + '\n\n' + request.error.message);
                };
    
    data.oncomplete = function (e) {
        console.log('se agrego a favorita correctamente');
        cargarFavoritos();
            };  
}

//Eliminar de Favorito
function eliminarFavorito(idIglesia,idUser){
    
     var active = database.result;
        var data = active.transaction(["favoritos"], "readwrite");
        var object = data.objectStore("favoritos");
    
    var index = object.index('by_fav');
    var request = index.openCursor(IDBKeyRange.only([idIglesia, idUser]));   
    console.log(request);
    //var request = index.delete([String(idIglesia),String(idUser)]);
    
    request.onerror = function (e) {
            alert(request.error.name + '\n\n' + request.error.message);
                };
    
  
    request.onsuccess = function() {
    var cursor = request.result;

    if (cursor) {
        cursor.delete();
        cursor.continue();
    }
};
    
    
    data.oncomplete = function (e) {
        console.log('se elimino de favorita correctamente');
        cargarFavoritos();
            };  
    
}

      

function cargarFavoritos(){    
    this.elements=[];
    var idUser = sessionStorage.getItem('id_user');
    var active = database.result;
    var data = active.transaction(["favoritos"], "readonly");
    var object = data.objectStore("favoritos");
    var index = object.index('by_id_user');    
    var request = index.openCursor(String(idUser));
        
    
    request.onsuccess = function(event){       
         var cursor = request.result;
    if(cursor){
        console.log('si hay cursor, iduser: '+idUser);
        console.log(cursor.value.id_iglesia);
         elements.push(cursor.value.id_iglesia);
         cursor.continue();
        }
    console.log(elements);

    };
    
    data.oncomplete = function (e) {        
        sessionStorage.setItem('favoritos',JSON.stringify(elements));
        console.log(elements);
     };  
    
}

function habilitarChecks(){
    var favoritos = JSON.parse(sessionStorage.getItem("favoritos"));
    console.log(favoritos);
    for(var i=0;i<favoritos.length;i++) {
        
      if(!$("#fav"+favoritos[i]).is(':checked')){               
          $("#fav"+favoritos[i]).attr('checked', true).checkboxradio('refresh');
         
      }  
    }
    
}


