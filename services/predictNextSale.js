import * as tf from '@tensorflow/tfjs'

export async function predictNextSale(sales) {
  const windowSize = 3

  // 🔹 Normalización
  const maxVenta = Math.max(...sales)
  const xs = []
  const ys = []

  for (let i = 0; i < sales.length - windowSize; i++) {
    xs.push(sales.slice(i, i + windowSize))
    ys.push(sales[i + windowSize])
  }

  const xsNorm = xs.map(seq => seq.map(v => v / maxVenta))
  const ysNorm = ys.map(v => v / maxVenta)

  const xsTensor = tf.tensor2d(xsNorm, [xsNorm.length, windowSize])
  const ysTensor = tf.tensor2d(ysNorm, [ysNorm.length, 1])

  // 🔹 Crear y entrenar el modelo en memoria
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 10, inputShape: [windowSize], activation: 'relu' }))
  model.add(tf.layers.dense({ units: 1 }))
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

  await model.fit(xsTensor, ysTensor, {
    epochs: 300,
    verbose: 0,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 100 === 0) console.log(`Epoch ${epoch}: pérdida = ${logs.loss}`)
      }
    }
  })

  // 🔹 Predicción
  const ultimosMeses = sales.slice(-windowSize).map(v => v / maxVenta)
  const prediccion = model.predict(tf.tensor2d([ultimosMeses], [1, windowSize]))
  const resultado = (await prediccion.data())[0] * maxVenta

  // 🔹 Liberar memoria
  tf.dispose([xsTensor, ysTensor, prediccion, model])

  return resultado.toFixed(2)
}


export async function predictNextSalesInCant(sales, numPredictions = 5) {
  try {
    const windowSize = 3;

    // ✅ Validación inicial
    if (!Array.isArray(sales) || sales.length <= windowSize) {
      throw new Error('Se necesitan más valores para predecir ventas futuras.');
    }

    // 🔹 Convertir a números (por si vienen como strings)
    const numericSales = sales.map(Number);
    const maxVenta = Math.max(...numericSales);

    if (maxVenta === 0) {
      throw new Error('Los valores de ventas no pueden ser todos 0.');
    }

    const xs = [];
    const ys = [];

    for (let i = 0; i < numericSales.length - windowSize; i++) {
      xs.push(numericSales.slice(i, i + windowSize));
      ys.push(numericSales[i + windowSize]);
    }

    const xsNorm = xs.map(seq => seq.map(v => v / maxVenta));
    const ysNorm = ys.map(v => v / maxVenta);

    const xsTensor = tf.tensor2d(xsNorm, [xsNorm.length, windowSize]);
    const ysTensor = tf.tensor2d(ysNorm, [ysNorm.length, 1]);

    // 🔹 Crear y entrenar el modelo
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [windowSize], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(xsTensor, ysTensor, {
      epochs: 300,
      verbose: 0,
    });

    // 🔹 Predicciones múltiples encadenadas
    let inputSeq = numericSales.slice(-windowSize).map(v => v / maxVenta);
    const predictions = [];

    for (let i = 0; i < numPredictions; i++) {
      const inputTensor = tf.tensor2d([inputSeq], [1, windowSize]);
      const predTensor = model.predict(inputTensor);
      const predValue = (await predTensor.data())[0];

      if (isNaN(predValue)) throw new Error('Error en el cálculo de la predicción.');

      const denormalized = predValue * maxVenta;
      predictions.push(Number(denormalized.toFixed(2)));

      inputSeq = [...inputSeq.slice(1), predValue];

      tf.dispose([inputTensor, predTensor]);
    }

    tf.dispose([xsTensor, ysTensor, model]);

    return { success: true, predictions };
  } catch (error) {
    console.error('Error en la predicción de ventas:', error.message);
    return { success: false, message: error.message };
  }
}

//modelo sin entrenar y con semilla aleatoria
// export async function predictNextSale(sales) {

//   // Ventas históricas (pueden venir de MongoDB)
//   //const ventas = sales.map(sale => sale.totalVtas);

//   const windowSize = 3 // Usaremos los últimos 3 meses para predecir el siguiente

//   // Crear datos de entrenamiento
//   const xs = []
//   const ys = []
//   for (let i = 0; i < sales.length - windowSize; i++) {
//     xs.push(sales.slice(i, i + windowSize))
//     ys.push(sales[i + windowSize])
//   }

//   // Normalización
//   const maxVenta = Math.max(...sales)
//   const xsNorm = xs.map(seq => seq.map(v => v / maxVenta))
//   const ysNorm = ys.map(v => v / maxVenta)

//   const xsTensor = tf.tensor2d(xsNorm, [xsNorm.length, windowSize])
//   const ysTensor = tf.tensor2d(ysNorm, [ysNorm.length, 1])

//   // Modelo
//   const model = tf.sequential()
//   model.add(tf.layers.dense({ units: 10, inputShape: [windowSize], activation: 'relu' }))
//   model.add(tf.layers.dense({ units: 1 }))
//   model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })

//   console.log('Entrenando modelo...')
//   await model.fit(xsTensor, ysTensor, {
//     epochs: 200,
//     callbacks: {
//       onEpochEnd: (epoch, logs) => {
//         if (epoch % 50 === 0) console.log(`Epoch ${epoch}: pérdida = ${logs.loss}`)
//       }
//     }
//   })

//   // Predicción del próximo mes
//   const ultimosMeses = sales.slice(-windowSize).map(v => v / maxVenta)
//   const prediccion = model.predict(tf.tensor2d([ultimosMeses], [1, windowSize]))
//   const resultado = (await prediccion.data())[0] * maxVenta

//   return resultado.toFixed(2)
// }
