<? //Recepcion de datos

  

$nombre=$_POST['nombre']; 
$telefono=$_POST['telefono']; 
$empresa=$_POST['empresa'];  
$correo=$_POST['correo']; 
$asunto=$_POST['asunto'];  
$consulta=$_POST['consulta']; 

$Thank="http://bernardo.netai.net/paginas/sistemaserion/redireccioncorreo.html";
  
// Fin de recpcion de datos   
// Accion de envio   
//---------//   
$para='bhoar@hotmail.es'; 
 
$mensaje='
Mensaje de:  '.$nombre.' 
Telefono: '.$telefono.'  
Correo:  '.$correo.'   
Asunto:  '.$asunto.'   
Consulta:  '.$consulta.'  
';
  
$desde='From: '.$correo.''; 

if  (mail($para, $asunto,$mensaje,$desde))

header ("location: $Thank");
echo 'Mensaje envido con exito, muchas gracias';

/*ini_set(sendmail_from,'');  
mail($para,$asunto,$mensaje,$desde,$Thank);  
echo'Mensaje envido con exito, muchas gracias'; */
  
?> 