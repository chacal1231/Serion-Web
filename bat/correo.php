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
	
?>