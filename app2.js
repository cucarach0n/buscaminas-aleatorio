let generarTablaVirtual =(numero)=>{
	let tabla =new Array(numero);
	
	for(i = 0; i< numero; i++){
		tabla[i] = new Array(numero);
		for(j = 0; j< numero; j++){
			tabla[i][j] = "x";
		};
	};

	return tabla;
};
let tamanoTabla = 10;
let tablaV = generarTablaVirtual(tamanoTabla);
let victoria = false;
let recorrerNumero=(posicionX,posicionY,numero)=>{
			var arrayBorde = [];
			var n1 = -2;
			var n2 = -2;
			var a , b;
			for(i = 0; i < 3;i++){
				n1 = n1 + 1;
				a = posicionX + n1;
				if(a >= 0 && a < numero){
					for(j = 0; j < 3;j++){
						n2 = n2 + 1;
						b = posicionY + n2;
						if(b >= 0 && b < numero ){
							if(a != posicionX || b != posicionY ){
							   arrayBorde.push([a,b]);
							};
							
						};
					};
				};
				n2 = -2;
			};
			return arrayBorde;
		
	};

let Mina = {
	
	numeroGenerado : undefined,
	arrayBorde : undefined,
	arrayMinas : undefined,
	contarMinas : ()=>{
		let arrayMinas =[];
		for(minas of Mina.arrayBorde){
			if(tablaV[minas[0]][minas[1]] == "*"){
				arrayMinas.push([minas[0],minas[1]]);
			};
		};
		return arrayMinas;
	},
	 diferenciarVacios :()=>{
		let arrayVacios =[];
		for(borde of Mina.arrayBorde){
			if(tablaV[borde[0]][borde[1]] == "x" )
			 {
				arrayVacios.push([borde[0],borde[1]]);
			 }
		};
		return arrayVacios;
	},
	//funcion que inserta las minas de acuerdo al numero generado aleatoriamente
	 insertarMinas :(arrayVacios)=>{
	 	//obtengo el conteo de minas
		let cantidadMinas = Mina.arrayMinas.length;
		//valido que el numero generado sea meyor a la cantidad de minas existentes
		while(cantidadMinas < Mina.numeroGenerado){
			let numeroAleatorio =  Math.floor((Math.random() * arrayVacios.length));

			tablaV[arrayVacios[numeroAleatorio][0]][arrayVacios[numeroAleatorio][1]] = "*";
			//cuenta.push([arrayVacios[numeroAleatorio][0],arrayVacios[numeroAleatorio][1]])
			arrayVacios.splice(numeroAleatorio,1);
			cantidadMinas += 1;
		};
		for(espacioVacio of arrayVacios){
			tablaV[espacioVacio[0]][espacioVacio[1]] = "#";
		}
	}
};
let Numero = {

	numeroAleatorio : 0,
	tamanoBorde :0,
	arrayVacios : [],
	//falta asignar valores probabilistos para la generacion de numeros aleatorios
	//en un orden de mayor grado de exito
	generarNumeroAleatorio:()=>{
		return Math.floor((Math.random() * (Numero.tamanoBorde+1) ));
	},
	//por mejorar
	//funcion que valida el numero a insertar 
	insertarNumero:(arrayMinas)=>{
		//contamos la cantidad de minas
		let cantidadMinas = arrayMinas.length;

		//validamos si el numero generado y la cantidad de minas sean de 0
		//para dar un grado de prioridad a los espacios vacios
		if(Numero.numeroAleatorio == 0 && cantidadMinas == 0){

			return Numero.numeroAleatorio;
		}
		//si el numero generado es mayor a cantidad de minas se dara por concluido
		//la generacion de posibles numeros a insertar
		while(Numero.numeroAleatorio< cantidadMinas){
			Numero.numeroAleatorio = Numero.generarNumeroAleatorio();
		}
		//retornamos el ultimo numero generado
		return Numero.numeroAleatorio;
	}
};
let referi ={
	//cantidad de minas
	cantidadMina : 0,
	//funcion que verificara si abre una mina o coloca una bandera
	validarJugada:(elemento)=>{
		//si la bandera esta seleccionada terminara la funcion padre
		if(document.getElementById("btnEstado").getAttribute("value") == "Bandera"){
			//si el elemento clickeado no fue pulsado antes
			if(elemento.target.innerText == ""){
				//descontando el conteo de minas
				document.getElementById("btnMinas").setAttribute("value",String(parseInt(document.getElementById("btnMinas").getAttribute("value")) - 1));
				//imprimiendo la bandera
				document.getElementById("tblPanel").children[elemento.target.parentElement.dataset.ejex].children[elemento.target.dataset.ejey].innerText = "#";
			}
			//si el elemento clickeado es una bandera
			else if(elemento.target.innerText == "#" ){
				//se aumenta el conteo de mina
				document.getElementById("btnMinas").setAttribute("value",String(parseInt(document.getElementById("btnMinas").getAttribute("value")) + 1));
				//se quita la bandera
				document.getElementById("tblPanel").children[elemento.target.parentElement.dataset.ejex].children[elemento.target.dataset.ejey].innerText = "";
			}
			return true;
		}
		//si es esta activado la mina
		else if(document.getElementById("btnEstado").getAttribute("value") == "Mina"){
			//si es una bandera, un numero o un vacio terminara la funcion
			if(elemento.target.innerText == "#" ||  isNaN(elemento.target.innerText) || elemento.target.innerText == "%" ){
				return true;
			}
			return false;
		}

	},
	//funcion que retornara el numero de minas en el tablero
	contarMinas:()=>{
		var cuenta = 0;
		for(fila in tablaV){
			for(columna in tablaV[fila]){
				if(tablaV[fila][columna] == "*"){
					//referi.cantidadMina += 1;
					cuenta += 1;
				}
			}
		}
		return cuenta;
	},
	//funcion que mostrara todas las minas del tablero
	liberarMinas:()=>{
		//for para recorrer las filas
		for(fila in tablaV){
			//for para recorrer las columnas
			for(columna in tablaV[fila]){
				//valido si la celda contiende una mina, mostrar esa ubicacion en el tablero fisico
				if(tablaV[fila][columna] == "*"){
					document.getElementById("tblPanel").children[fila].children[columna].innerText = "*";
					document.getElementById("tblPanel").children[fila].children[columna].style.backgroundColor = "white";
				}
			}
		}
	},
	//funcion que mostrara todos las cajas alrededor de una central establecidas
	//por un eje x,y
	liberarVacios:(x,y)=>{
		//obtengo el array de coordenadas de bordes de acuerdo a la posicion x,y
		var borde = recorrerNumero(parseInt(x),parseInt(y),tamanoTabla);
		//recorro el array de bordes para validar todo su alrededor
		for(eje of borde){
			document.getElementById("tblPanel").children[eje[0]].children[eje[1]].innerText = tablaV[eje[0]][eje[1]];
			document.getElementById("tblPanel").children[eje[0]].children[eje[1]].style.backgroundColor = "white";
		}
	}
};
let changeBandera =(element)=>{
	//valido si la jugada termino
	if (victoria) 
	{
		return;
	}
	//si el elemento tiene el value de bandera podre cambiarlo a mina
	if(element.getAttribute("value") == "Bandera"){
		element.setAttribute("value", "Mina");
	}
	//si el elemento tiene el value de mina podre cambiarlo a bandera
	else{
		element.setAttribute("value", "Bandera")
	}
};
let nuevaPartida =()=>{
	//genera la estructura de la tabla virtual
	tablaV = generarTablaVirtual(tamanoTabla);
	//construye la estructura de la tabla fisica(html)
	construirTabla(tamanoTabla,document.getElementById("tblPanel"),tablaV);
	//reinicia la variable false para poder jugar
	victoria = false;
	//cambio la bandera a mina
	document.getElementById("btnEstado").setAttribute("value","Mina");
	//escondo el mensaje de derrota
	document.getElementById("lblpierde").setAttribute("hidden","true");
};
let clickBox =  (element)=>{
	//instancio al jues
	var jues = referi;
	//valido si ya termino la jugada
	if(jues.validarJugada(element) == true || victoria == true)
	{
		return;
	};
	//cambio el estilo del elemento clickeado
	element.target.style.backgroundColor = "white";
	//desvelo el numero que esta en la pocision clickeada
	element.target.innerText = tablaV[element.target.parentElement.dataset.ejex][element.target.dataset.ejey]
	//calculo la cantidad de minas y lo imprimo
	//valido la jugadas, si es mina la jugada termina y muestra todas las minas del tablero juento con el mensaje de game over
	if(tablaV[element.target.parentElement.dataset.ejex][element.target.dataset.ejey]=="*"){
		victoria = true;
		document.getElementById("lblpierde").removeAttribute("hidden");
		jues.liberarMinas();
	}
	//si esta vacio, libera todos los cuadros a su alrededor
	else if(tablaV[element.target.parentElement.dataset.ejex][element.target.dataset.ejey]=="%"){
		
		jues.liberarVacios(element.target.parentElement.dataset.ejex,element.target.dataset.ejey)
	}
};

let construirTabla = (tamano,tabla,tablaV)=>{
	//reinicio en contador de minas a 0
	document.getElementById("btnMinas").setAttribute("value","0");
	//limpio la tabla
	tabla.innerText = "";
	//for anidado para generar un eje de coordenadas x,y 
	//for para generar las filas
	for (var i = 0; i < tamano; i++) {
		//creo un elemento tr
		var tr = document.createElement("tr");
		//establesco el atributo ejex como el indice i actual
		tr.setAttribute("data-ejex",i)
		//for para generar las columnsa
		for (var j = 0; j < tamano; j++) {
			//creo un elemento td
			var td = document.createElement("td");
			//establesco sus atributos de elemento html
			td.style.backgroundColor = "yellow";
			//establesco el atributo ejey como el indice j actual
			td.setAttribute("data-ejey",j);
			//agrego el evento click al td generado
			td.onclick = clickBox;
			//inserto el td en el tr
			tr.appendChild(td);
			//iniciando el objeto numero
			let numeroObjeto =  Numero;
			//iniciando el objeto mina
			let minaObjeto =  Mina;
			//obtengo un array de coordenadas,de acuerdo a la coordenada actual
			//indentifico las cajas alrededor de el
			
			minaObjeto.arrayBorde = recorrerNumero(i,j,tamano);
			//obtengo un array de coordenadas de las minas
			minaObjeto.arrayMinas = minaObjeto.contarMinas(minaObjeto.arrayBorde);	
			//obtengo un array de coordenadas de las cajas vacias
			let arrVacios = minaObjeto.diferenciarVacios();
			//calculo la cantidad los elementos vacios
			numeroObjeto.tamanoBorde = arrVacios.length + minaObjeto.arrayMinas.length;
			//establesco un numero aleatorio
			numeroObjeto.numeroAleatorio = numeroObjeto.generarNumeroAleatorio();
			//recalculo el array con las cajas vacias
			numeroObjeto.arrayVacios = minaObjeto.diferenciarVacios(); 
			//valido si en un numero
			if(tablaV[i][j] >= 1  ){
				numeroObjeto.numeroAleatorio =  tablaV[i][j];
			}
			//valido si es una mina
			else if(tablaV[i][j] == "*"){
				continue;
			}
			//||
			//genero numero aleatorio segun la cantidad de minas mas la cantidad de cajas vacias
			let numeroAleatorio = numeroObjeto.insertarNumero(minaObjeto.contarMinas());
			//mina objeto necesita el numero asigando para generar sus minas faltantes
			minaObjeto.numeroGenerado = numeroAleatorio;
			//let arrayMinas = mina.contarMinas(tabla,recorrerNumero(i,j,numeroAleatorio));
			//si es 0 insertara en las cajas disponibles "%" vara identificarlo como vacio
			if(numeroAleatorio == 0 ){
				td.innerText,tablaV[i][j] = "%";
			}else{
				tablaV[i][j] = numeroAleatorio;
				
			}
			//inserto las minas faltantes en las cajas vacias
			minaObjeto.insertarMinas(minaObjeto.diferenciarVacios());
			

		}
		tabla.appendChild(tr);
	};
	var jues = referi;
	//jues.contarMinas();
	document.getElementById("btnMinas").setAttribute("value",jues.contarMinas()/*jues.cantidadMina*/);
};
window.addEventListener("load",()=>{
	construirTabla(tamanoTabla,document.getElementById("tblPanel"),tablaV);
	
});