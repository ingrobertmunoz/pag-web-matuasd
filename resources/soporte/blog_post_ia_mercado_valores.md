# IA y el Mercado de Valores: ¿Puede el Deep Learning Predecir las Finanzas?

🎓 Contexto Académico: Asignatura "Aplicaciones de IA Generativa", Doctorado en Inteligencia Artificial (Convenio UASD-UMH).

---

## El Gran Desafío

El mercado de valores es uno de los sistemas más complejos e impredecibles que existen. ¿Puede la inteligencia artificial realmente superar los modelos financieros tradicionales para lidiar con todo ese caos? Esta es la pregunta central que abordamos en nuestra investigación doctoral.

Para intentar responderla, analizamos cómo las arquitecturas más recientes de **Deep Learning** se enfrentan a la predicción financiera, y descubrimos que la forma en que formulamos el problema importa tanto como el modelo que elegimos.

## Regresión vs. Clasificación: Dos Filosofías Distintas

Existen dos enfoques fundamentalmente diferentes para atacar la predicción bursátil:

- **Regresión:** Busca predecir un número exacto, como el precio de cierre del día siguiente. Se optimiza minimizando el error cuadrático medio (MSE).
- **Clasificación:** Se concentra únicamente en predecir la *dirección*: ¿subirá o bajará? Se optimiza mediante Cross-Entropy y se evalúa con métricas como F1-Score.

La diferencia parece sutil, pero tiene implicaciones enormes para el trading algorítmico real: un modelo que predice la dirección correcta el 60% de las veces puede ser más rentable que uno que predice el precio con un error muy bajo pero oscila alrededor del valor real sin capturar la tendencia.

## Las Arquitecturas en Competencia

Evaluamos cuatro familias de modelos de Deep Learning, cada una con fortalezas únicas:

- **LSTM (Long Short-Term Memory):** El veterano de las series temporales. Su sistema de compuertas le permite recordar patrones a largo plazo, filtrando información irrelevante.
- **Transformer:** Revolucionó el procesamiento del lenguaje natural y ahora irrumpe en finanzas. Su mecanismo de *self-attention* le permite capturar el contexto global de una secuencia de una sola vez.
- **xLSTM (Extended LSTM):** Una evolución reciente (2024) del LSTM clásico, propuesta por el propio Hochreiter. Introduce compuertas exponenciales y memoria matricial, logrando una capacidad de almacenamiento mucho más sofisticada.
- **Mamba (State Space Model):** Un competidor diseñado para la eficiencia. Procesa secuencias en tiempo lineal y utiliza selección selectiva, enfocándose solo en las señales relevantes e ignorando el ruido del mercado.

## Resultados: No Hay un Campeón Definitivo

Los hallazgos de la literatura revelan un panorama complejo y contradictorio:

- El **LSTM** mostró buenos resultados en predicción de precios (regresión).
- El **AC-Former** (basado en Transformer) alcanzó una precisión del **69%** en clasificación de dirección.
- **SAMBA** (Graph-Mamba) logró el error más bajo en pruebas de regresión específicas.
- **xLSTM** demostró mejoras consistentes sobre el LSTM original en forecasting.

**La conclusión más importante:** no existe un modelo campeón universal, porque los estudios actuales no son comparables entre sí. Cada uno utiliza datos distintos (S&P 500 vs. NASDAQ vs. Dow Jones), métricas diferentes y horizontes temporales variables. **Este vacío de comparación estandarizada es precisamente el gap de investigación que nuestra tesis doctoral busca llenar.**

## 🎬 Video: Deep Learning vs. el Mercado de Valores

Este análisis fue sintetizado en un video generado con **Google NotebookLM** a partir de 12 artículos científicos revisados. En él, dos presentadores de IA debaten las fortalezas y debilidades de cada arquitectura con un enfoque accesible y dinámico:

👉 **[Ver video en YouTube: IA y el Mercado de Valores](https://youtu.be/tqffvw1x0OY)**

---

## Referencias Académicas

Este contenido está fundamentado en los siguientes artículos científicos indexados:

1. López Gil, Duhamel-Sebline, McCarren (2024). *An Evaluation of Deep Learning Models for Stock Market Trend Prediction (xLSTM-TS)*. [arXiv:2408.12408](https://arxiv.org/abs/2408.12408)
2. Shi (2024). *MambaStock: Selective State Space Model for Stock Prediction*. [arXiv:2402.18959](https://arxiv.org/abs/2402.18959)
3. Gu, Kelly, Xiu (2020). *Empirical Asset Pricing via Machine Learning*. Review of Financial Studies / NBER.
4. Alharthi, Mahmood (2024). *xLSTMTime: Long-term Time Series Forecasting With xLSTM*. [arXiv:2407.10240](https://arxiv.org/abs/2407.10240)
5. SAMBA (2024). *Mamba Meets Financial Markets (Graph-Mamba)*. ICASSP 2025.
6. Zhang, Ye, Lai (2023). *Stock Price Prediction Using CNN-BiLSTM-Attention Model*. MDPI Mathematics.
7. Transformers versus LSTMs for Electronic Trading (2023). [arXiv:2309.11400](https://arxiv.org/abs/2309.11400)
8. Beck, Hochreiter et al. (2024). *xLSTM: Extended Long Short-Term Memory*. [arXiv:2405.04517](https://arxiv.org/abs/2405.04517)
9. Gu, Dao (2023). *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*. [arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
10. HIGSTM (2025). *Hierarchical Information-Guided Spatio-Temporal Mamba*. [arXiv:2503.11387](https://arxiv.org/abs/2503.11387)
11. ACEFormer (2024). *End-to-End Structure with Novel Position Mechanism and Improved EMD*. [arXiv:2404.07969](https://arxiv.org/abs/2404.07969)
12. Xie, Chen, Yu (2024). *Deep Convolutional Transformer Network for Stock Movement Prediction*. MDPI Electronics.
