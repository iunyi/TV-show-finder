**¡Hola!**

Esta es mi propuesta de solución para el ejercicio de **evaluación final** del módulo 2 de **JavaScript** de Adalab.

El ejercicio consiste en desarrollar una aplicación web de búsqueda de series de TV.

Esta propuesta consta de:

1. **Una barra de búsqueda**
    - Los resultados de búsqueda se muestran al mismo tiempo que introducimos un término de búsqueda en el campo input del formulario.
    - El campo input del formulario incluye una x a la derecha que sirve para eliminar los datos escritos en él.

2. **Una sección donde aparecen los resultados tras realizar una búsqueda**
    - Las imágenes de los resultados se iluminan cuando pasamos el cursor sobre ellas
    - Haciendo clic en los resultados podemos guardarlos en una lista de favoritos. Además, las series marcadas como favoritas aparecerán resaltadas en la sección de resultados (corazón en la esquina superior derecha, cambio de colores, borde blanco).
    - Los resultados que previamente hayamos marcado como favoritos se mostrarán resaltados, incluso si realizamos otra búsqueda, siempre y cuando no los desmarquemos nosotros mismos.
    - Volviendo a hacer clic, eliminaremos la opción seleccionada de la lista de favoritos.

3. **Una sección en la que se guardan las series marcadas**
    - Las series marcadas como favoritas aparecerán en esta sección siempre y cuando no borremos los datos del local storage.
    - Las series incluidas en esta sección tienen una x en la esquina superior derecha que podemos clicar para eliminar la serie de esta lista.
    - El botón con el icono de papelera elimina todos las series incluidas en la lista de favoritos