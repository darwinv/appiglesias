 // Begin scoping function
var database=null;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
     
        var database = indexedDB.open("iglesiasdb",1);
        
        database.onupgradeneeded = function (e) {
            var active = database.result;
            var options = {
              keyPath: 'id',
              autoIncrement: true
            };
         var object = active.createObjectStore('usuarios',options);
            object.createIndex('by_username','username',{ unique : true});
            
        };
        
        database.onsuccess = function (e){
            console.log('databse loaded');
        };
        
        database.onerror = function (e) {
            console.log('Error loading database');
        };

    
    function registrar(){
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
        setTimeout(function(){  window.location.href = 'index.html'; }, 3000);
                
            };
    
}

function logout(){
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
        
      request.onsuccess = function (){
        var userActual = request.result;

            if (userActual === undefined) {
               // alert("usuario no encontrado");
                 $("#wrong_user").popup("open"); 
            setTimeout(function(){  $("#wrong_user").popup("close"); }, 2000);
            }else{
                
                if(userActual.passwd!=password){
                    //alert("clave incorrecta");
                     $("#wrong_passwd").popup("open"); 
                    setTimeout(function(){  $("#wrong_passwd").popup("close"); }, 2000);
                    
                }else{
                    sessionStorage.setItem('name',userActual.name);
                    sessionStorage.setItem('username',userActual.username);
                    sessionStorage.setItem('id_user',userActual.id);
                    //sessionStorage.setItem('logueado','si');
                    //alert("Bienvenido: "+userActual.name);
                $("#welcome_user").append("<span> "+userActual.name+ "</span>" );
                 $("#welcome_user").popup("open"); 
                    
                setTimeout(function(){ window.location.href = 'index.html'; }, 3000);    
                }
            }
            
        };
         
    data.oncomplete = function (e) {
                document.querySelector("#username_login").value = '';
                document.querySelector("#pass_login").value = '';                
            };  
      

  }






      



