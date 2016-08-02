<?php
	
	$correP = $_POST['correo'];
	$asunt = $_POST['asunto'];
	$mensaj = $_POST['mensaje'];
	$nombre = $_POST['nombreDe'];
	$correD = $_POST['correoDe'];
	$cabecera = "From:".$nombre."<".$correD.">";
	
	if (mail($correP, $asunt, $mensaj, $cabecera))
	{
		echo "Mensaje enviado correctamente: Espere la respuesta";
	}
	else 
	{
		echo "Error al enviar mensaje: No espere respuesta";
	}
	
	/*nuevo formulario*/
	$apellido=$_POST['apellido'];  
	$nombre=$_POST['nombre'];  
	$empresa=$_POST['empresa'];  
	$correo=$_POST['correo']; 
	$asunto=$_POST['asunto'];  $
	consulta=$_POST['consulta'];   
		// Fin de recpcion de datos   
		// Accion de envio   
		//---------//   
		$para='bhoar@hotmail.es!';  $mensaje='   
		Mensaje de:  '.$apellido.', '.$nombre.'   
		Correo:  '.$correo.'   
		Asunto:  '.$asunto.'   
		Consulta:  '.$consulta.'  '; $desde='
		From: '.$correo.' <bhoar@hotmail.es>';  
		ini_set(sendmail_from,'bhoar@hotmail.es');  
		mail($para,$asunto,$mensaje,$desde);  
		echo'Mensaje envido con exito, muchas gracias'; 
	
?>