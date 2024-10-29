const filas = parseInt(localStorage.getItem('rows')) || 3;
const columnas = parseInt(localStorage.getItem('cols')) + 1 || 3;
const tablaValores = Array.from({ length: filas + 1 }, () => Array(columnas + 1).fill(''));

function validarEntrada(e) {
    const valor = e.target.value;

    // Solo se permite un número positivo o una única 'M'
    if (!/^(M|\d+)?$/.test(valor)) {
        e.target.value = valor.slice(0, -1); // Eliminar último carácter si es inválido
    }
}

function generarTabla() {
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Generar encabezado
    const encabezado = document.createElement('tr');
    for (let j = 0; j <= columnas; j++) {
        const th = document.createElement('th');
        if (j === 0) {
        th.textContent = ''; // Esquina superior izquierda
        } else if (j === columnas) {
        th.textContent = 'Oferta'; // Última columna
        } else {
        th.textContent = `W${j}`; // Columnas W1, W2, ..., Wn
        }
        encabezado.appendChild(th);
    }
    thead.appendChild(encabezado);

    // Generar filas con inputs
    for (let i = 0; i <= filas; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j <= columnas; j++) {
        const celda = document.createElement('td');

        if (j === 0) {
            // Primera columna con F1, F2, ..., Demanda
            celda.textContent = i === filas ? 'Demanda' : `F${i + 1}`;
        } else if (i === filas && j === columnas) {
            // Intersección bloqueada (Demanda vs Oferta)
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true;
            celda.appendChild(input);
        } else {
            // Crear input para celdas editables
            const input = document.createElement('input');
            input.type = 'text';
            input.value = tablaValores[i][j] || '';
            input.addEventListener('input', validarEntrada);
            input.addEventListener('input', (e) => {
            tablaValores[i][j] = e.target.value;
            
            });
            celda.appendChild(input);
        }
        fila.appendChild(celda);
        }
        tbody.appendChild(fila);
    }

    tabla.appendChild(thead);
    tabla.appendChild(tbody);

    // Insertar la tabla en el contenedor con ID 'formContainer'
    const formContainer = document.getElementById('formContainer');
    formContainer.appendChild(tabla);

    var button = document.createElement('button');
    button.type = 'button';
    button.onclick = processValue;
    button.textContent = 'Continuar';
    formContainer.appendChild(button);

    var button = document.createElement('button');
    button.type = 'button';
    button.onclick = function() {window.location.href = "main.html";};
    button.textContent = 'Volver';
    formContainer.appendChild(button);
  
}

// Generar la tabla al cargar la página
generarTabla();

function processValue(){
    // Obtener la matriz original y borrar la primera columna
    let newMatrix = tablaValores.map(fila => fila.slice(1));

    // Convertir los valores vacíos a 0
    newMatrix = newMatrix.map(fila =>
        fila.map(valor => valor === "" ? 0 : valor)
    );

    // Convertir strings a números evitando M
    newMatrix = newMatrix.map(fila =>
        fila.map(valor => /^-?\d+(\.\d+)?$/.test(valor) ? Number(valor) : valor)
    );

    let oferta = newMatrix.map(fila => fila.pop()); 
    oferta.pop();
    
    let demanda = newMatrix.pop(); 

    // MaxValue
    let maxValue = Math.max(
        ...newMatrix.flatMap(fila => fila) 
            .filter(valor => typeof valor === 'number')
    );

    // Cambiar M por maxValue
    newMatrix = newMatrix.map(fila =>
        fila.map(valor => valor === 'M' ? maxValue * 100 : valor)
    );

    let funcType = localStorage.getItem("funcType");
    console.log("FuncType: ", funcType);
    if (funcType == 1) {
        maxValue = Math.max(
            ...newMatrix.flatMap(fila => fila) 
                .filter(valor => typeof valor === 'number')
        );

        newMatrix = newMatrix.map((fila) =>
            fila.map((valor) => maxValue - valor) 
        );       
    }

    console.log("Nueva Matriz:", newMatrix);
    console.log("Demanda:", demanda);
    console.log("Oferta:", oferta);

    localStorage.setItem('newMatrix', JSON.stringify(newMatrix));
    localStorage.setItem('demanda', JSON.stringify(demanda));
    localStorage.setItem('oferta', JSON.stringify(oferta));

    window.location.href = "resultado.html";

}