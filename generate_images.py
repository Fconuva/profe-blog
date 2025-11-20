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

# 1. Climograma Austral
def generate_climograma():
    months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    precip = [180, 170, 200, 220, 250, 240, 230, 210, 190, 180, 170, 160] # High rain
    temp = [12, 11, 10, 8, 6, 4, 3, 4, 6, 8, 10, 11] # Low temp

    fig, ax1 = plt.subplots(figsize=(10, 6))

    # Bar chart for precipitation
    color = 'tab:blue'
    ax1.set_xlabel('Meses')
    ax1.set_ylabel('Precipitaciones (mm)', color=color, fontsize=12, fontweight='bold')
    ax1.bar(months, precip, color=color, alpha=0.6, label='Precipitaciones')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.grid(False)

    # Line chart for temperature
    ax2 = ax1.twinx()
    color = 'tab:red'
    ax2.set_ylabel('Temperatura (°C)', color=color, fontsize=12, fontweight='bold')
    ax2.plot(months, temp, color=color, marker='o', linewidth=3, label='Temperatura')
    ax2.tick_params(axis='y', labelcolor=color)
    ax2.set_ylim(0, 25)
    ax2.grid(False)

    plt.title('Climograma Zona Austral (Chile)', fontsize=14, fontweight='bold', pad=20)
    save_plot('climograma_austral.png')
    print('Generated climograma_austral.png')

# 2. Supply and Demand
def generate_supply_demand():
    x = np.linspace(0, 10, 100)
    supply = 2 * x + 1
    demand = -2 * x + 21

    plt.figure(figsize=(8, 6))
    plt.plot(x, supply, label='Oferta', color='blue', linewidth=3)
    plt.plot(x, demand, label='Demanda', color='red', linewidth=3)
    
    # Equilibrium
    eq_x = 5
    eq_y = 11
    plt.plot(eq_x, eq_y, 'ko', markersize=10)
    plt.annotate('Equilibrio (Pe, Qe)', xy=(eq_x, eq_y), xytext=(eq_x+1, eq_y+2),
                 arrowprops=dict(facecolor='black', shrink=0.05))

    plt.xlabel('Cantidad (Q)', fontsize=12, fontweight='bold')
    plt.ylabel('Precio (P)', fontsize=12, fontweight='bold')
    plt.title('Equilibrio de Mercado', fontsize=14, fontweight='bold')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.xlim(0, 10)
    plt.ylim(0, 25)
    save_plot('grafico_oferta_demanda.png')
    print('Generated grafico_oferta_demanda.png')

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

# 7. Map: War of the Pacific (Improved)
def generate_pacific_war_map():
    fig, ax = plt.subplots(figsize=(8, 12))
    
    # Define rough coordinates for the coast
    # Chile (Long strip)
    chile_x = [0.4, 0.45, 0.45, 0.4, 0.35, 0.35]
    chile_y = [0.0, 0.0, 0.5, 0.5, 0.4, 0.0]
    
    # Antofagasta (Bolivia)
    anto_x = [0.35, 0.6, 0.6, 0.45, 0.4]
    anto_y = [0.5, 0.5, 0.65, 0.65, 0.5]
    
    # Tarapaca (Peru)
    tara_x = [0.35, 0.6, 0.55, 0.3]
    tara_y = [0.65, 0.65, 0.8, 0.8]
    
    # Peru (North)
    peru_x = [0.3, 0.55, 0.5, 0.2]
    peru_y = [0.8, 0.8, 0.95, 0.9]

    # Draw Polygons
    ax.add_patch(patches.Polygon(xy=list(zip([0.35, 0.45, 0.45, 0.35], [0.0, 0.0, 0.5, 0.5])), closed=True, color='#1f77b4', alpha=0.6, label='Chile (Pre-1879)'))
    ax.add_patch(patches.Polygon(xy=list(zip(anto_x, anto_y)), closed=True, color='#ff7f0e', alpha=0.6, label='Antofagasta (Bolivia)'))
    ax.add_patch(patches.Polygon(xy=list(zip(tara_x, tara_y)), closed=True, color='#d62728', alpha=0.6, label='Tarapacá (Perú)'))
    ax.add_patch(patches.Polygon(xy=list(zip(peru_x, peru_y)), closed=True, color='#9467bd', alpha=0.4, label='Resto de Perú'))
    
    # Labels
    ax.text(0.4, 0.25, 'CHILE', ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    ax.text(0.5, 0.57, 'ANTOFAGASTA\n(Salitre)', ha='center', va='center', fontsize=10, fontweight='bold')
    ax.text(0.45, 0.72, 'TARAPACÁ\n(Salitre)', ha='center', va='center', fontsize=10, fontweight='bold')
    ax.text(0.35, 0.85, 'PERÚ', ha='center', va='center', fontsize=14, fontweight='bold')
    
    # Ocean
    ax.set_facecolor('#e3f2fd')
    ax.text(0.1, 0.5, 'OCÉANO PACÍFICO', ha='center', va='center', rotation=90, fontsize=16, color='#1f77b4', alpha=0.5)
    
    ax.set_xlim(0, 0.8)
    ax.set_ylim(0, 1)
    ax.legend(loc='lower right')
    ax.set_title('Territorios en Disputa - Guerra del Pacífico (1879)', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_guerra_pacifico.png')
    print('Generated mapa_guerra_pacifico.png (Improved)')

# 8. Infographic: Greenpeace (New)
def generate_greenpeace_infographic():
    fig, ax = plt.subplots(figsize=(10, 12))
    ax.set_facecolor('#f8f9fa')
    
    # Header Background
    rect_header = patches.Rectangle((0, 0.85), 1, 0.15, color='#2c3e50')
    ax.add_patch(rect_header)
    
    # Title
    ax.text(0.5, 0.92, 'CAMPAÑA: #ChaoCarbón', ha='center', va='center', fontsize=24, fontweight='bold', color='#ffc107')
    ax.text(0.5, 0.88, 'Fin a las Zonas de Sacrificio', ha='center', va='center', fontsize=16, color='white')
    
    # Main Image Area (Simulated)
    rect_img = patches.Rectangle((0.1, 0.45), 0.8, 0.35, color='#343a40', alpha=0.1)
    ax.add_patch(rect_img)
    
    # Chimneys (Simple shapes)
    ax.add_patch(patches.Rectangle((0.2, 0.45), 0.1, 0.2, color='#555'))
    ax.add_patch(patches.Rectangle((0.4, 0.45), 0.1, 0.25, color='#555'))
    ax.add_patch(patches.Rectangle((0.6, 0.45), 0.1, 0.15, color='#555'))
    
    # Smoke
    circle1 = patches.Circle((0.25, 0.7), 0.05, color='#777', alpha=0.6)
    circle2 = patches.Circle((0.45, 0.75), 0.06, color='#777', alpha=0.6)
    ax.add_patch(circle1)
    ax.add_patch(circle2)
    
    ax.text(0.5, 0.6, 'EMISIONES TÓXICAS', ha='center', va='center', fontsize=20, fontweight='bold', color='#dc3545', alpha=0.8)
    
    # Info boxes
    ax.text(0.2, 0.35, 'PROBLEMÁTICA', fontsize=14, fontweight='bold', color='#0d6efd')
    ax.text(0.2, 0.30, '- Contaminación del aire\n- Problemas respiratorios\n- Daño al ecosistema marino', fontsize=12, va='top')
    
    ax.text(0.6, 0.35, 'ACCIÓN CIUDADANA', fontsize=14, fontweight='bold', color='#198754')
    ax.text(0.6, 0.30, '- Firmar peticiones\n- Manifestaciones pacíficas\n- Presión legislativa', fontsize=12, va='top')
    
    # Footer Call to Action
    rect_footer = patches.Rectangle((0.2, 0.05), 0.6, 0.1, color='#dc3545', alpha=0.9)
    ax.add_patch(rect_footer)
    ax.text(0.5, 0.1, '¡FIRMA AHORA!', ha='center', va='center', fontsize=18, fontweight='bold', color='white')
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    save_plot('infografia_greenpeace.png')
    print('Generated infografia_greenpeace.png')

if __name__ == '__main__':
    generate_climograma()
    generate_supply_demand()
    generate_crisis_1929()
    generate_isi_growth()
    generate_africa_map()
    generate_german_expansion()
    generate_pacific_war_map()
    generate_greenpeace_infographic()
