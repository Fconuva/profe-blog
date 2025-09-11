/**
 * MÓDULO DE CÁLCULO DE CALIFICACIONES
 * Maneja todos los cálculos relacionados con notas y evaluaciones
 */

class GradeCalculator {
    constructor() {
        this.gradingScales = {
            rubrica: [7.0, 5.0, 3.0, 1.0],
            logrado: [7.0, 1.0],
            directa: { min: 1.0, max: 7.0 }
        };
        
        this.passingGrade = 4.0;
        this.roundingPrecision = 1;
        
        console.log('🧮 Grade Calculator inicializado');
    }

    /**
     * Calcula el promedio de un conjunto de notas
     */
    calculateAverage(grades, excludeEmpty = true) {
        try {
            let validGrades = grades.filter(grade => {
                const numGrade = parseFloat(grade);
                return !isNaN(numGrade) && numGrade >= 1.0 && numGrade <= 7.0;
            });

            if (validGrades.length === 0) {
                return excludeEmpty ? 1.0 : 0;
            }

            const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
            const average = sum / validGrades.length;
            
            return this.roundGrade(average);
        } catch (error) {
            console.error('❌ Error calculando promedio:', error);
            return 1.0;
        }
    }

    /**
     * Calcula nota final con ponderación
     */
    calculateFinalGrade(processGrade, ponderatedGrade, ponderatedWeight) {
        try {
            const numProcessGrade = parseFloat(processGrade) || 1.0;
            const numPonderatedGrade = parseFloat(ponderatedGrade);
            const numPonderatedWeight = parseFloat(ponderatedWeight) || 0;

            // Si no hay nota ponderada válida, retornar solo la nota de proceso
            if (isNaN(numPonderatedGrade) || numPonderatedGrade < 1.0 || numPonderatedGrade > 7.0) {
                return numProcessGrade;
            }

            // Calcular ponderación
            const ponderatedW = numPonderatedWeight / 100;
            const processW = 1 - ponderatedW;
            
            const finalGrade = (numProcessGrade * processW) + (numPonderatedGrade * ponderatedW);
            
            return this.roundGrade(finalGrade);
        } catch (error) {
            console.error('❌ Error calculando nota final:', error);
            return processGrade;
        }
    }

    /**
     * Calcula estadísticas de un conjunto de calificaciones
     */
    calculateStatistics(grades) {
        try {
            const validGrades = grades.filter(grade => {
                const numGrade = parseFloat(grade);
                return !isNaN(numGrade) && numGrade >= 1.0 && numGrade <= 7.0;
            }).map(grade => parseFloat(grade));

            if (validGrades.length === 0) {
                return {
                    count: 0,
                    average: 0,
                    median: 0,
                    mode: 0,
                    min: 0,
                    max: 0,
                    standardDeviation: 0,
                    passed: 0,
                    failed: 0,
                    passRate: 0,
                    distribution: {}
                };
            }

            // Estadísticas básicas
            const count = validGrades.length;
            const sum = validGrades.reduce((a, b) => a + b, 0);
            const average = sum / count;
            const min = Math.min(...validGrades);
            const max = Math.max(...validGrades);

            // Mediana
            const sortedGrades = [...validGrades].sort((a, b) => a - b);
            const median = count % 2 === 0 
                ? (sortedGrades[count / 2 - 1] + sortedGrades[count / 2]) / 2
                : sortedGrades[Math.floor(count / 2)];

            // Moda
            const frequency = {};
            validGrades.forEach(grade => {
                frequency[grade] = (frequency[grade] || 0) + 1;
            });
            const mode = Object.keys(frequency).reduce((a, b) => 
                frequency[a] > frequency[b] ? a : b
            );

            // Desviación estándar
            const variance = validGrades.reduce((acc, grade) => 
                acc + Math.pow(grade - average, 2), 0
            ) / count;
            const standardDeviation = Math.sqrt(variance);

            // Aprobados/Reprobados
            const passed = validGrades.filter(grade => grade >= this.passingGrade).length;
            const failed = count - passed;
            const passRate = (passed / count) * 100;

            // Distribución por rangos
            const distribution = this.calculateGradeDistribution(validGrades);

            return {
                count: count,
                average: this.roundGrade(average),
                median: this.roundGrade(median),
                mode: parseFloat(mode),
                min: min,
                max: max,
                standardDeviation: this.roundGrade(standardDeviation),
                passed: passed,
                failed: failed,
                passRate: this.roundGrade(passRate),
                distribution: distribution
            };
        } catch (error) {
            console.error('❌ Error calculando estadísticas:', error);
            return null;
        }
    }

    /**
     * Calcula distribución de calificaciones por rangos
     */
    calculateGradeDistribution(grades) {
        const ranges = {
            'Excelente (6.0-7.0)': 0,
            'Bueno (5.0-5.9)': 0,
            'Suficiente (4.0-4.9)': 0,
            'Insuficiente (1.0-3.9)': 0
        };

        grades.forEach(grade => {
            if (grade >= 6.0) {
                ranges['Excelente (6.0-7.0)']++;
            } else if (grade >= 5.0) {
                ranges['Bueno (5.0-5.9)']++;
            } else if (grade >= 4.0) {
                ranges['Suficiente (4.0-4.9)']++;
            } else {
                ranges['Insuficiente (1.0-3.9)']++;
            }
        });

        return ranges;
    }

    /**
     * Valida una calificación según el tipo de evaluación
     */
    validateGrade(grade, evaluationType) {
        try {
            const numGrade = parseFloat(grade);
            
            if (isNaN(numGrade)) {
                return { valid: false, error: 'La calificación debe ser un número' };
            }

            switch (evaluationType) {
                case 'rubrica':
                    if (!this.gradingScales.rubrica.includes(numGrade)) {
                        return { 
                            valid: false, 
                            error: `La calificación debe ser una de: ${this.gradingScales.rubrica.join(', ')}` 
                        };
                    }
                    break;
                    
                case 'logrado':
                    if (!this.gradingScales.logrado.includes(numGrade)) {
                        return { 
                            valid: false, 
                            error: `La calificación debe ser ${this.gradingScales.logrado[0]} (Logrado) o ${this.gradingScales.logrado[1]} (No Logrado)` 
                        };
                    }
                    break;
                    
                case 'directa':
                    if (numGrade < this.gradingScales.directa.min || numGrade > this.gradingScales.directa.max) {
                        return { 
                            valid: false, 
                            error: `La calificación debe estar entre ${this.gradingScales.directa.min} y ${this.gradingScales.directa.max}` 
                        };
                    }
                    break;
                    
                default:
                    return { valid: false, error: 'Tipo de evaluación no válido' };
            }

            return { valid: true, grade: numGrade };
        } catch (error) {
            console.error('❌ Error validando calificación:', error);
            return { valid: false, error: 'Error de validación' };
        }
    }

    /**
     * Convierte calificación numérica a texto descriptivo
     */
    gradeToText(grade, evaluationType = 'rubrica') {
        try {
            const numGrade = parseFloat(grade);
            
            if (isNaN(numGrade)) {
                return 'Sin calificación';
            }

            if (evaluationType === 'logrado') {
                return numGrade >= 4.0 ? 'Logrado' : 'No Logrado';
            }

            // Para rúbrica y directa
            if (numGrade >= 6.5) return 'Excelente';
            if (numGrade >= 5.5) return 'Muy Bueno';
            if (numGrade >= 4.5) return 'Bueno';
            if (numGrade >= 4.0) return 'Suficiente';
            return 'Insuficiente';
        } catch (error) {
            console.error('❌ Error convirtiendo calificación a texto:', error);
            return 'Error';
        }
    }

    /**
     * Obtiene el color CSS para una calificación
     */
    getGradeColor(grade) {
        try {
            const numGrade = parseFloat(grade);
            
            if (isNaN(numGrade)) {
                return '#9ca3af'; // gray-400
            }

            if (numGrade >= 6.0) return '#3b82f6'; // blue-500
            if (numGrade >= 5.0) return '#10b981'; // emerald-500
            if (numGrade >= 4.0) return '#f59e0b'; // amber-500
            return '#ef4444'; // red-500
        } catch (error) {
            console.error('❌ Error obteniendo color de calificación:', error);
            return '#9ca3af';
        }
    }

    /**
     * Obtiene la clase CSS para una calificación
     */
    getGradeClass(grade) {
        try {
            const numGrade = parseFloat(grade);
            
            if (isNaN(numGrade)) {
                return 'note-empty';
            }

            const floorGrade = Math.floor(numGrade);
            return `note-${floorGrade}`;
        } catch (error) {
            console.error('❌ Error obteniendo clase de calificación:', error);
            return 'note-empty';
        }
    }

    /**
     * Redondea una calificación según la precisión configurada
     */
    roundGrade(grade) {
        try {
            const numGrade = parseFloat(grade);
            if (isNaN(numGrade)) return 1.0;
            
            return Math.round(numGrade * Math.pow(10, this.roundingPrecision)) / Math.pow(10, this.roundingPrecision);
        } catch (error) {
            console.error('❌ Error redondeando calificación:', error);
            return grade;
        }
    }

    /**
     * Calcula tendencia de calificaciones a lo largo del tiempo
     */
    calculateTrend(grades, dates) {
        try {
            if (grades.length !== dates.length || grades.length < 2) {
                return { trend: 'stable', change: 0, description: 'Datos insuficientes' };
            }

            // Combinar y ordenar por fecha
            const gradeData = grades.map((grade, index) => ({
                grade: parseFloat(grade),
                date: new Date(dates[index])
            })).filter(item => !isNaN(item.grade))
              .sort((a, b) => a.date - b.date);

            if (gradeData.length < 2) {
                return { trend: 'stable', change: 0, description: 'Datos insuficientes' };
            }

            // Calcular tendencia lineal simple
            const firstGrade = gradeData[0].grade;
            const lastGrade = gradeData[gradeData.length - 1].grade;
            const change = lastGrade - firstGrade;

            let trend = 'stable';
            let description = 'Rendimiento estable';

            if (change > 0.5) {
                trend = 'improving';
                description = 'Tendencia al alza';
            } else if (change < -0.5) {
                trend = 'declining';
                description = 'Tendencia a la baja';
            }

            return {
                trend: trend,
                change: this.roundGrade(change),
                description: description,
                firstGrade: firstGrade,
                lastGrade: lastGrade
            };
        } catch (error) {
            console.error('❌ Error calculando tendencia:', error);
            return { trend: 'stable', change: 0, description: 'Error en cálculo' };
        }
    }

    /**
     * Genera recomendaciones basadas en el rendimiento
     */
    generateRecommendations(statistics, trend) {
        try {
            const recommendations = [];

            // Recomendaciones basadas en promedio
            if (statistics.average < 4.0) {
                recommendations.push({
                    type: 'warning',
                    title: 'Promedio bajo',
                    message: 'El promedio del curso está por debajo del mínimo de aprobación. Considera refuerzo adicional.',
                    priority: 'high'
                });
            } else if (statistics.average < 5.0) {
                recommendations.push({
                    type: 'info',
                    title: 'Oportunidad de mejora',
                    message: 'El promedio es suficiente pero hay espacio para mejorar. Identifica áreas específicas de dificultad.',
                    priority: 'medium'
                });
            }

            // Recomendaciones basadas en tasa de aprobación
            if (statistics.passRate < 60) {
                recommendations.push({
                    type: 'error',
                    title: 'Baja tasa de aprobación',
                    message: `Solo el ${statistics.passRate.toFixed(1)}% de estudiantes aprueba. Revisa metodología y contenidos.`,
                    priority: 'high'
                });
            } else if (statistics.passRate < 80) {
                recommendations.push({
                    type: 'warning',
                    title: 'Tasa de aprobación mejorable',
                    message: `El ${statistics.passRate.toFixed(1)}% de aprobación puede mejorarse con apoyo adicional.`,
                    priority: 'medium'
                });
            }

            // Recomendaciones basadas en tendencia
            if (trend.trend === 'declining') {
                recommendations.push({
                    type: 'warning',
                    title: 'Tendencia descendente',
                    message: 'Las calificaciones muestran una tendencia a la baja. Intervención temprana recomendada.',
                    priority: 'high'
                });
            } else if (trend.trend === 'improving') {
                recommendations.push({
                    type: 'success',
                    title: 'Progreso positivo',
                    message: 'Las calificaciones muestran mejora continua. Mantén las estrategias actuales.',
                    priority: 'low'
                });
            }

            // Recomendaciones basadas en dispersión
            if (statistics.standardDeviation > 1.5) {
                recommendations.push({
                    type: 'info',
                    title: 'Alta variabilidad',
                    message: 'Hay gran diferencia entre las calificaciones. Considera estrategias de diferenciación.',
                    priority: 'medium'
                });
            }

            return recommendations.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } catch (error) {
            console.error('❌ Error generando recomendaciones:', error);
            return [];
        }
    }

    /**
     * Exporta estadísticas en formato para gráficos
     */
    exportForCharts(statistics) {
        try {
            return {
                distributionChart: {
                    labels: Object.keys(statistics.distribution),
                    data: Object.values(statistics.distribution),
                    type: 'doughnut'
                },
                summaryChart: {
                    labels: ['Aprobados', 'Reprobados'],
                    data: [statistics.passed, statistics.failed],
                    type: 'pie'
                },
                statsData: {
                    average: statistics.average,
                    median: statistics.median,
                    min: statistics.min,
                    max: statistics.max,
                    standardDeviation: statistics.standardDeviation
                }
            };
        } catch (error) {
            console.error('❌ Error exportando para gráficos:', error);
            return null;
        }
    }

    /**
     * Configura escalas de calificación personalizadas
     */
    setCustomGradingScale(type, scale) {
        try {
            if (Array.isArray(scale) && scale.length > 0) {
                this.gradingScales[type] = scale;
                console.log(`📊 Escala personalizada configurada para ${type}:`, scale);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error configurando escala personalizada:', error);
            return false;
        }
    }

    /**
     * Obtiene configuración actual de escalas
     */
    getGradingScales() {
        return { ...this.gradingScales };
    }
}

// Crear instancia global
const gradeCalculator = new GradeCalculator();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradeCalculator;
} else {
    window.GradeCalculator = GradeCalculator;
    window.gradeCalculator = gradeCalculator;
}
