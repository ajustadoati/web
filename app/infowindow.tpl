<div ng-controller="templateController" width="155px">
	<div>
	  	<div>
	      
	        <b>{{parameter.nombre}}</b>
	            
	      	
	     </div>
	     
	       <div>
	       	Telefono: {{parameter.telefono}}
	       </div>
	       
		       <div >Enviar Whatsapp <a href="https://api.whatsapp.com/send?phone='+{{parameter.telefono}}+'&text=Hola%20desde%20ajustadoati" target="_blank"><img src="img/icon_message.png" width="25" height="25"/></a>
		       </div>
	   	 </div>
	 
</div>