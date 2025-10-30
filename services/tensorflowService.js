import * as tf from '@tensorflow/tfjs'

export async function trainAndPredict() {
  // 🔹 Datos originales
  const gastos = [50, 100, 150, 200, 250]
  const ventas = [100, 200, 300, 400, 500]

  // 🔹 Normalización (lleva los valores entre 0 y 1)
  const maxGasto = Math.max(...gastos)
  const maxVenta = Math.max(...ventas)
  const gastosNorm = gastos.map(g => g / maxGasto)
  const ventasNorm = ventas.map(v => v / maxVenta)

  // 🔹 Tensores normalizados-Convierte los datos en matrices de TensorFlow
  const xs = tf.tensor2d(gastosNorm, [gastos.length, 1])
  const ys = tf.tensor2d(ventasNorm, [ventas.length, 1])

  // 🔹 Modelo simple - Crea una red neuronal simple
  const model = tf.sequential()
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }))

  //Compilacion - Define cómo aprenderá (optimización y pérdida)
  model.compile({
    optimizer: tf.train.adam(0.01), // más estable que sgd
    loss: 'meanSquaredError'
  })


  //Entrenamiento-Ajusta pesos para reducir el error
  console.log('Entrenando modelo...')
  await model.fit(xs, ys, {
    epochs: 200,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 20 === 0) console.log(`Epoch ${epoch}: pérdida = ${logs.loss}`)
      }
    }
  })

  // 🔹 Predicción con dato nuevo-Usa el modelo entrenado para estimar nuevos valores
  const gastoNuevo = 300
  const gastoNormalizado = gastoNuevo / maxGasto
  const prediccion = model.predict(tf.tensor2d([gastoNormalizado], [1, 1]))
  const resultadoNormalizado = (await prediccion.data())[0]
  const resultadoReal = resultadoNormalizado * maxVenta

  console.log(`📈 Predicción de ventas para un gasto de ${gastoNuevo}: ${resultadoReal.toFixed(2)}`)
}
