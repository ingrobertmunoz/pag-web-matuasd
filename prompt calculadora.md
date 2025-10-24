Eres un **experto en desarrollo web y finanzas**.  
Vas a **modificar el archivo `@matematica-financiera.html`** para incluir **tres calculadoras financieras** completamente funcionales y una **tabla de amortización**.  
El diseño debe ser **moderno, limpio, responsivo y profesional**.

---

### 🧮 Requerimientos funcionales:

#### 1. Calculadora de Monto Simple
- **Variables de entrada:**
  - Capital (**C**)
  - Tasa de interés (**i**) → incluir una **lista desplegable** con opciones: **“mensual”** o **“anual”**
  - Tiempo (**t**) → incluir una **lista desplegable** con opciones: **“meses”** o **“años”**

  Recuerda hacer la conversion de la tasa y el tiempo incorporados por el usuario para que los calculos esten correctos.
- **Fórmula:**
  \[
  M = C (1 + i t)
  \]
- **Resultado:** mostrar el **monto final (M)** con dos decimales.

---

#### 2. Calculadora de Monto Compuesto
- **Variables de entrada:**
  - Capital (**C**)
  - Tasa nominal anual (**j**)
  - Período de capitalización → lista desplegable con opciones:
    - **Mensual (por defecto)**
    - **Trimestral**
    - **Cuatrimestral**
    - **Semestral**
    - **Anual**
  - Tiempo (**t**) en **años**
- **Fórmula:**
  $
  M = C \left(1 + \frac{j}{m}\right)^{m t}
  $
  donde \( m \) es el número de capitalizaciones por año según el período seleccionado.
- **Resultado:** mostrar el **monto final (M)** con dos decimales.

---

#### 3. Calculadora de Cuotas o Rentas de un Préstamo
- **Variables de entrada:**
  - Monto del préstamo (**P**)
  - Tasa nominal anual (**j**)
  - Tiempo (**t**) en **años**
- **Fórmula:**
  $$
  R = P \frac{j/n}{1 - (1 + j/m)^{-mt}}
  $$
  donde \( m = 12 \) (mensual).
- **Resultado:** mostrar la **cuota mensual (R)** con dos decimales.
- **Después del cálculo**, generar y mostrar una **tabla de amortización** con el detalle de cada pago.

---

### 📊 Tabla de Amortización

- Se genera dinámicamente con **JavaScript** al calcular la cuota.  
- Debe mostrar una fila por cada mes del préstamo con las siguientes columnas:
  1. **Mes**
  2. **Cuota total**
  3. **Interés pagado**
  4. **Amortización al capital**
  5. **Saldo restante**
- La tabla debe:
  - Ser **responsive** y **desplazable horizontalmente** en dispositivos móviles.
  - Mostrar los valores numéricos con **dos decimales**.
  - Mostrar **saldo = 0.00** al finalizar el período.
  - Incluir un **encabezado claro y sombreado** para las columnas.

Ejemplo de estructura sugerida:

```html
<div id="tabla-amortizacion" class="mt-4 overflow-x-auto">
  <table class="min-w-full text-sm text-center border">
    <thead class="bg-gray-200">
      <tr>
        <th>Mes</th>
        <th>Cuota</th>
        <th>Interés</th>
        <th>Amortización</th>
        <th>Saldo</th>
      </tr>
    </thead>
    <tbody id="amortizacion-body">
      <!-- Filas generadas dinámicamente con JavaScript -->
    </tbody>
  </table>
</div>
