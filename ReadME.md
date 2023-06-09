# SEGUIMIENTO DE GASTOS DE CRIPTOMONEDAS Y REPRESENTACIÓN GRÁFICA

## Consignas

Desarrollar una aplicación web que permita a los usuarios ingresar gastos relacionados con criptomonedas, especificando la cantidad gastada y la fecha de la transacción. Utilizando una llamada gratuita a una API de criptomonedas, obtener la información de precios y calcular el porcentaje que representa cada gasto con respecto al total gastado.

**Requerimientos:**

1. Utilizar una API pública gratuita para obtener los datos de precios actualizados de las criptomonedas.
2. Crear un formulario donde el usuario pueda ingresar los detalles de sus gastos relacionados con criptomonedas, incluyendo la cantidad gastada y la fecha de la transacción.
3. Utilizando una librería de gráficos (por ejemplo, Chart.js o D3.js), mostrar un gráfico de torta que represente los diferentes porcentajes de cada gasto con respecto al total gastado. Asignar un color diferente a cada porcentaje para facilitar la visualización.
4. La aplicación debe ser responsive, es decir, adaptarse correctamente a diferentes dispositivos y tamaños de pantalla.
5. Utilizar los métodos filter, map y reduce para procesar y filtrar la información específica obtenida de la API de criptomonedas, según los criterios que desees.
6. Diseñar una interfaz fácil de usar y comprensible para los usuarios, con instrucciones claras sobre cómo ingresar los gastos y visualizar el gráfico.

## Solución

1. La API utilizada fue https://docs.coincap.io/#ee30bea9-bb6b-469d-958a-d3e35d442d7a, de donde sacamos toda la información necesario para poblar la aplicación. Los datos mostrados son el top 5 de criptomonedas (basado en el ranking de la API) y luego una lista de todas las criptomonedas con un páginado para ir avanzando. Tanto las filas como las cartas donde se muestra la info de las criptomonedas son links que nos llevan a la página principal de dicha moneda

2. Debajo de la lista vamos a encotrar un formulario donde podemos ingresar nuestros gastos (monto,fecha y descripción). Los mismos se guardan en el localStorage para tener acceso a ellos en futuras sesiones

3. Cada gasto ingresado (como así también borrado) provoca que se actualice el gráfico donde se muestra el proporcional que ocupa cada gasto sobre el total.

4. La aplicación es completamente responsive gracias a las media queries (utilizadas aquellas que nos brinda el navegador de Chrome)

5.

- El **map** se utiliza en el método fetchCriptos para llenar la lista con la información de la API, para cargar el top five y para cargar la lista de criptos. También se usa para llenar la lista de gastos y para dibujar el gráfico

- El **filter** se usa en el select para filtrar la lista de criptomonedas por 3 criterios distintos y también para eliminar los gastos a través del icono del tacho de basura

- El **reduce** se utiliza para calcular y mostrar el total gastado

6. La aplicación si bien simple, tiene un diseño muy intuitivo y fácil de usar
