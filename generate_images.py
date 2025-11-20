# -*- coding: utf-8 -*-
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import pandas as pd
import seaborn as sns
import os

# Set style
sns.set_theme(style='whitegrid')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans', 'Liberation Sans', 'Bitstream Vera Sans', 'sans-serif']

OUTPUT_DIR = 'imagenes/historia'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_plot(filename):
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, filename), dpi=300, bbox_inches='tight')
    plt.close()

# 1. Climograma Austral (Pregunta 1 - Much more elaborate)
def generate_climograma():
    months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    precip = [180, 170, 200, 220, 250, 240, 230, 210, 190, 180, 170, 160]
    temp = [12, 11, 10, 8, 6, 4, 3, 4, 6, 8, 10, 11]
    humidity = [85, 87, 88, 90, 92, 95, 94, 92, 89, 87, 86, 85]
    wind = [18, 16, 20, 22, 25, 28, 30, 27, 24, 20, 19, 17]

    fig = plt.figure(figsize=(20, 14))
    
    # Main climogram
    ax1 = plt.subplot(2, 2, 1)
    color = '#1e88e5'
    ax1.set_xlabel('Meses', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Precipitaciones (mm)', color=color, fontsize=14, fontweight='bold')
    bars = ax1.bar(months, precip, color=color, alpha=0.7, edgecolor='black', linewidth=1.5)
    ax1.tick_params(axis='y', labelcolor=color, labelsize=11)
    ax1.grid(True, alpha=0.3, linestyle='--')
    
    # Gradient effect on bars
    for i, bar in enumerate(bars):
        bar.set_facecolor(plt.cm.Blues(0.4 + 0.5 * precip[i]/max(precip)))
    
    ax2 = ax1.twinx()
    color = '#d32f2f'
    ax2.set_ylabel('Temperatura (°C)', color=color, fontsize=14, fontweight='bold')
    ax2.plot(months, temp, color=color, marker='o', linewidth=4, markersize=10, label='Temperatura', markeredgecolor='black', markeredgewidth=2)
    ax2.fill_between(range(len(months)), temp, alpha=0.2, color=color)
    ax2.tick_params(axis='y', labelcolor=color, labelsize=11)
    ax2.set_ylim(0, 20)
    ax2.grid(False)
    ax1.set_title('Precipitaciones y Temperatura', fontsize=16, fontweight='bold', pad=15)
    
    # Humidity chart
    ax3 = plt.subplot(2, 2, 2)
    ax3.plot(months, humidity, color='#43a047', marker='s', linewidth=3, markersize=8, markeredgecolor='black', markeredgewidth=1.5)
    ax3.fill_between(range(len(months)), humidity, alpha=0.3, color='#43a047')
    ax3.set_ylabel('Humedad Relativa (%)', fontsize=14, fontweight='bold')
    ax3.set_xlabel('Meses', fontsize=14, fontweight='bold')
    ax3.set_title('Humedad Relativa', fontsize=16, fontweight='bold', pad=15)
    ax3.grid(True, alpha=0.4, linestyle='--')
    ax3.set_ylim(80, 100)
    
    # Wind speed chart
    ax4 = plt.subplot(2, 2, 3)
    ax4.bar(months, wind, color='#fb8c00', alpha=0.8, edgecolor='black', linewidth=1.5)
    ax4.set_ylabel('Velocidad del Viento (km/h)', fontsize=14, fontweight='bold')
    ax4.set_xlabel('Meses', fontsize=14, fontweight='bold')
    ax4.set_title('Velocidad del Viento', fontsize=16, fontweight='bold', pad=15)
    ax4.grid(True, alpha=0.4, linestyle='--')
    
    # Annual summary table
    ax5 = plt.subplot(2, 2, 4)
    ax5.axis('off')
    
    summary_data = [
        ['INDICADOR', 'PROMEDIO ANUAL'],
        ['Temperatura', f'{np.mean(temp):.1f}°C'],
        ['Precipitación Total', f'{sum(precip)} mm'],
        ['Humedad', f'{np.mean(humidity):.1f}%'],
        ['Viento', f'{np.mean(wind):.1f} km/h'],
        ['', ''],
        ['CLASIFICACIÓN CLIMÁTICA', ''],
        ['Tipo', 'Oceánico Frío'],
        ['Característica', 'Lluvia todo el año'],
    ]
    
    table = ax5.table(cellText=summary_data, cellLoc='left', loc='center',
                      colWidths=[0.5, 0.5],
                      bbox=[0, 0, 1, 1])
    table.auto_set_font_size(False)
    table.set_fontsize(12)
    table.scale(1, 2.5)
    
    for i in range(len(summary_data)):
        if i == 0 or i == 6:
            table[(i, 0)].set_facecolor('#37474f')
            table[(i, 1)].set_facecolor('#37474f')
            table[(i, 0)].set_text_props(weight='bold', color='white')
            table[(i, 1)].set_text_props(weight='bold', color='white')
        else:
            table[(i, 0)].set_facecolor('#eceff1')
            table[(i, 1)].set_facecolor('#eceff1')
    
    plt.suptitle('CLIMOGRAMA ZONA AUSTRAL (CHILE)\nAnálisis Climatológico Detallado', 
                 fontsize=20, fontweight='bold', y=0.98)
    
    save_plot('climograma_austral.png')
    print('Generated climograma_austral.png (VERY ELABORATE)')

# 2. Supply and Demand (Pregunta 8 - BIGGER)
def generate_supply_demand():
    x = np.linspace(0, 10, 100)
    supply = 2 * x + 1
    demand = -2 * x + 21

    plt.figure(figsize=(18, 13))
    plt.plot(x, supply, label='Oferta', color='#1976d2', linewidth=5, marker='o', markersize=8, markevery=10)
    plt.plot(x, demand, label='Demanda', color='#d32f2f', linewidth=5, marker='s', markersize=8, markevery=10)
    
    # Fill areas
    plt.fill_between(x, supply, alpha=0.2, color='#1976d2')
    plt.fill_between(x, demand, alpha=0.2, color='#d32f2f')
    
    # Equilibrium
    eq_x = 5
    eq_y = 11
    plt.plot(eq_x, eq_y, 'ko', markersize=18, markeredgewidth=3, markeredgecolor='#ffc107')
    plt.annotate('PUNTO DE EQUILIBRIO\n(Pe, Qe)', xy=(eq_x, eq_y), xytext=(eq_x+1.5, eq_y+4),
                 arrowprops=dict(facecolor='black', shrink=0.05, width=3, headwidth=10),
                 fontsize=16, fontweight='bold', bbox=dict(boxstyle='round,pad=0.5', facecolor='#ffc107', alpha=0.8))
    
    # Grid lines from equilibrium
    plt.axvline(eq_x, color='gray', linestyle='--', linewidth=2, alpha=0.5)
    plt.axhline(eq_y, color='gray', linestyle='--', linewidth=2, alpha=0.5)
    
    # Labels at equilibrium
    plt.text(eq_x, -0.8, f'Qe = {eq_x}', ha='center', fontsize=14, fontweight='bold', 
             bbox=dict(boxstyle='round', facecolor='white', edgecolor='black', linewidth=2))
    plt.text(-0.8, eq_y, f'Pe = {eq_y}', ha='center', fontsize=14, fontweight='bold',
             bbox=dict(boxstyle='round', facecolor='white', edgecolor='black', linewidth=2))

    plt.xlabel('Cantidad (Q)', fontsize=16, fontweight='bold')
    plt.ylabel('Precio (P)', fontsize=16, fontweight='bold')
    plt.title('EQUILIBRIO DE MERCADO\nInteracción entre Oferta y Demanda', fontsize=20, fontweight='bold', pad=20)
    plt.legend(fontsize=14, loc='upper right', framealpha=0.9, edgecolor='black', fancybox=True)
    plt.grid(True, linestyle='--', alpha=0.4, linewidth=1.5)
    plt.xlim(-0.5, 10.5)
    plt.ylim(-1, 26)
    plt.tick_params(labelsize=12)
    save_plot('grafico_oferta_demanda.png')
    print('Generated grafico_oferta_demanda.png (BIGGER)')

# 3. Crisis 1929 (Salitre Exports)
def generate_crisis_1929():
    years = [1910, 1915, 1920, 1925, 1929, 1930, 1931, 1932, 1935]
    exports = [250, 300, 450, 350, 400, 150, 50, 30, 40] # Schematic values

    plt.figure(figsize=(10, 6))
    plt.plot(years, exports, marker='o', color='#d62728', linewidth=3)
    
    plt.annotate('Gran Depresión', xy=(1929, 400), xytext=(1931, 450),
                 arrowprops=dict(facecolor='black', shrink=0.05), fontsize=12)
    
    plt.annotate('Caída abrupta', xy=(1932, 30), xytext=(1933, 100),
                 arrowprops=dict(facecolor='black', shrink=0.05), fontsize=12)

    plt.xlabel('Año', fontsize=12, fontweight='bold')
    plt.ylabel('Exportaciones de Salitre (Millones de pesos oro)', fontsize=12, fontweight='bold')
    plt.title('Impacto de la Crisis de 1929 en Chile', fontsize=14, fontweight='bold')
    plt.grid(True, linestyle='--', alpha=0.7)
    save_plot('grafico_crisis_1929.png')
    print('Generated grafico_crisis_1929.png')

# 4. ISI Model Growth
def generate_isi_growth():
    years = np.arange(1940, 1956)
    # Exponential-ish growth
    growth = [100 * (1.08 ** i) for i in range(len(years))]

    plt.figure(figsize=(10, 6))
    plt.plot(years, growth, marker='s', color='#2ca02c', linewidth=3)
    
    plt.fill_between(years, growth, color='#2ca02c', alpha=0.2)

    plt.xlabel('Año', fontsize=12, fontweight='bold')
    plt.ylabel('Índice de Producción Industrial (Base 1940=100)', fontsize=12, fontweight='bold')
    plt.title('Crecimiento Industrial bajo el Modelo ISI (1940-1955)', fontsize=14, fontweight='bold')
    plt.grid(True, linestyle='--', alpha=0.7)
    save_plot('grafico_isi.png')
    print('Generated grafico_isi.png')

# 5. Map: Africa Colonial (Schematic)
def generate_africa_map():
    fig, ax = plt.subplots(figsize=(8, 8))
    
    theta = np.linspace(0, 2*np.pi, 100)
    r = 10 + 2*np.sin(3*theta) + np.cos(5*theta)
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    
    ax.fill(x, y, color='#f0e4d2', edgecolor='black', linewidth=2)
    
    ax.plot([-5, 5], [10, -10], color='red', linewidth=4, linestyle='--')
    ax.plot([-10, 10], [0, 0], color='red', linewidth=4, linestyle='--')
    
    ax.text(-5, 5, 'Colonia A', fontsize=14, fontweight='bold', color='darkblue')
    ax.text(5, -5, 'Colonia B', fontsize=14, fontweight='bold', color='darkgreen')
    ax.text(0, 8, 'Grupo Étnico 1', fontsize=10, color='black', ha='center')
    ax.text(0, -8, 'Grupo Étnico 2', fontsize=10, color='black', ha='center')
    
    ax.set_title('Esquema: Fronteras Artificiales en África', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_africa_colonial.png')
    print('Generated mapa_africa_colonial.png')

# 6. Map: German Expansion (Improved)
def generate_german_expansion():
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Rough shapes using polygons
    # Germany
    germany_x = [0.3, 0.4, 0.5, 0.7, 0.75, 0.6, 0.3]
    germany_y = [0.4, 0.35, 0.3, 0.4, 0.8, 0.85, 0.8]
    
    # Austria (South of Germany)
    austria_x = [0.4, 0.7, 0.75, 0.5]
    austria_y = [0.35, 0.4, 0.2, 0.2]
    
    # Sudetenland (Rim around Czech)
    sudetes_x = [0.7, 0.85, 0.9, 0.8, 0.7]
    sudetes_y = [0.4, 0.4, 0.6, 0.65, 0.6]

    ax.add_patch(patches.Polygon(xy=list(zip(germany_x, germany_y)), closed=True, color='#708090', alpha=0.9, label='Alemania (1937)'))
    ax.add_patch(patches.Polygon(xy=list(zip(austria_x, austria_y)), closed=True, color='#d62728', alpha=0.7, label='Anexión Austria (Anschluss, 1938)'))
    ax.add_patch(patches.Polygon(xy=list(zip(sudetes_x, sudetes_y)), closed=True, color='#ff7f0e', alpha=0.7, label='Anexión Sudetes (1938)'))
    
    # Labels
    ax.text(0.5, 0.6, 'ALEMANIA\n(III REICH)', ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    ax.text(0.6, 0.28, 'AUSTRIA', ha='center', va='center', fontsize=12, fontweight='bold', color='white')
    ax.text(0.82, 0.5, 'SUDETES', ha='center', va='center', fontsize=10, fontweight='bold', rotation=-45)
    
    ax.set_xlim(0.1, 1.0)
    ax.set_ylim(0.1, 1.0)
    ax.legend(loc='upper left')
    ax.set_title('Expansión Territorial Alemana (1935-1939)', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_expansion_alemana.png')
    print('Generated mapa_expansion_alemana.png (Improved)')

# 7. Map: War of the Pacific (Pregunta 14 - Centered and bigger)
def generate_pacific_war_map():
    fig, ax = plt.subplots(figsize=(12, 16))
    
    # Define rough coordinates for the coast - CENTERED
    # Chile (Long strip)
    chile_x = [0.45, 0.50, 0.50, 0.45, 0.40, 0.40]
    chile_y = [0.05, 0.05, 0.45, 0.45, 0.35, 0.05]
    
    # Antofagasta (Bolivia)
    anto_x = [0.40, 0.65, 0.65, 0.50, 0.45]
    anto_y = [0.45, 0.45, 0.58, 0.58, 0.45]
    
    # Tarapaca (Peru)
    tara_x = [0.40, 0.65, 0.60, 0.35]
    tara_y = [0.58, 0.58, 0.72, 0.72]
    
    # Peru (North)
    peru_x = [0.35, 0.60, 0.55, 0.25]
    peru_y = [0.72, 0.72, 0.88, 0.82]

    # Draw Polygons with borders
    ax.add_patch(patches.Polygon(xy=list(zip([0.40, 0.50, 0.50, 0.40], [0.05, 0.05, 0.45, 0.45])), 
                                 closed=True, color='#1e88e5', alpha=0.8, label='Chile (Pre-1879)',
                                 edgecolor='black', linewidth=3))
    ax.add_patch(patches.Polygon(xy=list(zip(anto_x, anto_y)), closed=True, color='#ffa726', 
                                 alpha=0.8, label='Antofagasta (Bolivia)', edgecolor='black', linewidth=3))
    ax.add_patch(patches.Polygon(xy=list(zip(tara_x, tara_y)), closed=True, color='#ef5350', 
                                 alpha=0.8, label='Tarapacá (Perú)', edgecolor='black', linewidth=3))
    ax.add_patch(patches.Polygon(xy=list(zip(peru_x, peru_y)), closed=True, color='#ab47bc', 
                                 alpha=0.6, label='Resto de Perú', edgecolor='black', linewidth=2))
    
    # Labels with backgrounds
    ax.text(0.45, 0.25, 'CHILE', ha='center', va='center', fontsize=20, fontweight='bold', 
            color='white', bbox=dict(boxstyle='round,pad=0.8', facecolor='#0d47a1', alpha=0.9))
    ax.text(0.52, 0.51, 'ANTOFAGASTA\n(Litoral Boliviano)\n⛏️ SALITRE', ha='center', va='center', 
            fontsize=14, fontweight='bold', bbox=dict(boxstyle='round,pad=0.6', facecolor='#e65100', alpha=0.9))
    ax.text(0.50, 0.65, 'TARAPACÁ\n(Perú)\n⛏️ SALITRE', ha='center', va='center', 
            fontsize=14, fontweight='bold', bbox=dict(boxstyle='round,pad=0.6', facecolor='#c62828', alpha=0.9))
    ax.text(0.40, 0.77, 'PERÚ', ha='center', va='center', fontsize=18, fontweight='bold', 
            color='white', bbox=dict(boxstyle='round,pad=0.6', facecolor='#7b1fa2', alpha=0.9))
    
    # Arrows showing conflict
    ax.annotate('', xy=(0.52, 0.51), xytext=(0.45, 0.40),
                arrowprops=dict(arrowstyle='->', lw=4, color='red'))
    ax.annotate('', xy=(0.50, 0.65), xytext=(0.45, 0.40),
                arrowprops=dict(arrowstyle='->', lw=4, color='red'))
    
    # Ocean
    ax.set_facecolor('#b3e5fc')
    ax.text(0.15, 0.5, 'OCÉANO\nPACÍFICO', ha='center', va='center', rotation=0, 
            fontsize=22, fontweight='bold', color='#01579b', alpha=0.6,
            bbox=dict(boxstyle='round,pad=1', facecolor='white', alpha=0.3))
    
    # Compass rose
    ax.text(0.85, 0.9, 'N', ha='center', va='center', fontsize=24, fontweight='bold',
            bbox=dict(boxstyle='circle,pad=0.3', facecolor='white', edgecolor='black', linewidth=2))
    ax.arrow(0.85, 0.85, 0, 0.03, head_width=0.02, head_length=0.01, fc='black', ec='black', linewidth=2)
    
    ax.set_xlim(0.1, 0.9)
    ax.set_ylim(0, 1)
    ax.legend(loc='lower right', fontsize=12, framealpha=0.95, edgecolor='black', fancybox=True)
    ax.set_title('TERRITORIOS EN DISPUTA\nGuerra del Pacífico (1879-1884)', 
                 fontsize=22, fontweight='bold', pad=20,
                 bbox=dict(boxstyle='round,pad=1', facecolor='#ffeb3b', alpha=0.8))
    ax.axis('off')
    save_plot('mapa_guerra_pacifico.png')
    print('Generated mapa_guerra_pacifico.png (CENTERED & BIGGER)')

# 8. Infographic: Greenpeace (Pregunta 26 - MUCH BIGGER with emojis and effects)
def generate_greenpeace_infographic():
    fig, ax = plt.subplots(figsize=(16, 20))
    ax.set_facecolor('#eceff1')
    
    # Header Background with gradient effect
    for i in range(10):
        rect = patches.Rectangle((0, 0.88 + i*0.012), 1, 0.012, color=plt.cm.Greens(0.3 + i*0.07), alpha=0.8)
        ax.add_patch(rect)
    
    # Main title with emoji
    ax.text(0.5, 0.95, '🌍 GREENPEACE CHILE 🌿', ha='center', va='center', 
            fontsize=36, fontweight='bold', color='white',
            bbox=dict(boxstyle='round,pad=1.5', facecolor='#1b5e20', alpha=0.9, edgecolor='#ffc107', linewidth=5))
    ax.text(0.5, 0.91, 'CAMPAÑA: #ChaoCarbón ⚡', ha='center', va='center', 
            fontsize=28, fontweight='bold', color='#ffc107',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='#263238', alpha=0.95))
    
    # Subtitle
    ax.text(0.5, 0.86, '🚫 FIN A LAS ZONAS DE SACRIFICIO 🚫', ha='center', va='center', 
            fontsize=24, color='#c62828', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='white', alpha=0.9, edgecolor='#c62828', linewidth=4))
    
    # Main visual area - Industrial landscape
    rect_scene = patches.Rectangle((0.05, 0.48), 0.9, 0.32, color='#37474f', alpha=0.15, 
                                    edgecolor='black', linewidth=3)
    ax.add_patch(rect_scene)
    
    # Factory chimneys (bigger and more detailed)
    chimney_positions = [(0.15, 0.48), (0.30, 0.48), (0.45, 0.48), (0.60, 0.48), (0.75, 0.48)]
    chimney_heights = [0.18, 0.24, 0.20, 0.26, 0.22]
    
    for i, (x, y) in enumerate(chimney_positions):
        # Chimney body
        chimney = patches.Rectangle((x, y), 0.08, chimney_heights[i], 
                                    color='#424242', edgecolor='black', linewidth=2)
        ax.add_patch(chimney)
        # Chimney top
        top = patches.Rectangle((x-0.01, y+chimney_heights[i]), 0.10, 0.02, 
                                color='#212121', edgecolor='black', linewidth=2)
        ax.add_patch(top)
        
        # Windows
        for w in range(3):
            window = patches.Rectangle((x+0.015, y+0.03+w*0.05), 0.025, 0.03, 
                                       color='#ffc107', alpha=0.7)
            ax.add_patch(window)
            window2 = patches.Rectangle((x+0.045, y+0.03+w*0.05), 0.025, 0.03, 
                                        color='#ffc107', alpha=0.7)
            ax.add_patch(window2)
    
    # Toxic smoke (larger circles with gradient)
    smoke_data = [
        (0.19, 0.70, 0.06), (0.17, 0.74, 0.07), (0.21, 0.76, 0.08),
        (0.34, 0.74, 0.07), (0.32, 0.78, 0.09), (0.36, 0.80, 0.08),
        (0.49, 0.71, 0.06), (0.47, 0.75, 0.08), (0.51, 0.77, 0.07),
        (0.64, 0.76, 0.09), (0.62, 0.80, 0.08), (0.66, 0.82, 0.07),
        (0.79, 0.72, 0.07), (0.77, 0.76, 0.08), (0.81, 0.78, 0.09),
    ]
    
    for x, y, r in smoke_data:
        smoke = patches.Circle((x, y), r, color='#616161', alpha=0.5, 
                              edgecolor='#424242', linewidth=1.5)
        ax.add_patch(smoke)
    
    # Warning text on the scene
    ax.text(0.5, 0.63, '☠️ EMISIONES TÓXICAS ☠️', ha='center', va='center', 
            fontsize=32, fontweight='bold', color='#b71c1c',
            bbox=dict(boxstyle='round,pad=1', facecolor='#ffeb3b', alpha=0.85, 
                     edgecolor='#b71c1c', linewidth=4))
    ax.text(0.5, 0.56, '💨 CO₂ • SO₂ • MP 2.5 • NOₓ 💨', ha='center', va='center',
            fontsize=18, fontweight='bold', color='#1a237e',
            bbox=dict(boxstyle='round,pad=0.6', facecolor='white', alpha=0.9))
    
    # Problem section
    ax.text(0.25, 0.43, '⚠️ PROBLEMÁTICA', fontsize=22, fontweight='bold', color='#c62828',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='#ffcdd2', alpha=0.9, 
                     edgecolor='#c62828', linewidth=3))
    
    problems = [
        '🫁 Enfermedades respiratorias crónicas',
        '🏥 Aumento de hospitalizaciones',
        '🐟 Contaminación del ecosistema marino',
        '🏭 Daño irreversible al medio ambiente',
        '👶 Afectación a niños y adultos mayores'
    ]
    
    for i, prob in enumerate(problems):
        ax.text(0.25, 0.37 - i*0.04, prob, fontsize=16, va='top',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.8,
                         edgecolor='#e53935', linewidth=2))
    
    # Action section
    ax.text(0.75, 0.43, '✊ ACCIÓN CIUDADANA', fontsize=22, fontweight='bold', color='#1b5e20',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='#c8e6c9', alpha=0.9,
                     edgecolor='#1b5e20', linewidth=3))
    
    actions = [
        '✍️ Firmar la petición online',
        '📢 Manifestaciones pacíficas',
        '🏛️ Presión legislativa al Congreso',
        '📱 Compartir en redes sociales',
        '🤝 Unirse a Greenpeace'
    ]
    
    for i, act in enumerate(actions):
        ax.text(0.75, 0.37 - i*0.04, act, fontsize=16, va='top',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.8,
                         edgecolor='#43a047', linewidth=2))
    
    # Statistics boxes
    ax.text(0.5, 0.12, '📊 CIFRAS ALARMANTES', ha='center', fontsize=20, fontweight='bold',
            color='white', bbox=dict(boxstyle='round,pad=0.8', facecolor='#1565c0', alpha=0.9))
    
    stats = [
        ('28', 'Zonas de\nSacrificio', '#ef5350'),
        ('300%', 'Aumento de\nCáncer', '#ec407a'),
        ('12M', 'Personas\nAfectadas', '#ab47bc')
    ]
    
    for i, (num, desc, color) in enumerate(stats):
        x_pos = 0.2 + i*0.3
        ax.text(x_pos, 0.06, num, ha='center', fontsize=28, fontweight='bold', color='white',
                bbox=dict(boxstyle='round,pad=0.8', facecolor=color, alpha=0.9,
                         edgecolor='black', linewidth=3))
        ax.text(x_pos, 0.01, desc, ha='center', fontsize=14, fontweight='bold')
    
    # Footer Call to Action (BIGGER)
    for i in range(5):
        rect_cta = patches.Rectangle((0.1, 0.18 + i*0.005), 0.8, 0.005, 
                                     color=plt.cm.Reds(0.6 + i*0.08))
        ax.add_patch(rect_cta)
    
    ax.text(0.5, 0.22, '👉 ¡FIRMA AHORA Y SALVA VIDAS! 👈', ha='center', va='center', 
            fontsize=30, fontweight='bold', color='white',
            bbox=dict(boxstyle='round,pad=1.2', facecolor='#b71c1c', alpha=0.95,
                     edgecolor='#ffc107', linewidth=6))
    
    ax.text(0.5, 0.16, '🌐 www.greenpeace.cl/chacocarbon', ha='center', va='center',
            fontsize=20, fontweight='bold', color='#1565c0',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='white', alpha=0.9,
                     edgecolor='#1565c0', linewidth=3))
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    save_plot('infografia_greenpeace.png')
    print('Generated infografia_greenpeace.png (MUCH BIGGER with EMOJIS & EFFECTS)')

if __name__ == '__main__':
    generate_climograma()
    generate_supply_demand()
    generate_crisis_1929()
    generate_isi_growth()
    generate_africa_map()
    generate_german_expansion()
    generate_pacific_war_map()
    generate_greenpeace_infographic()
