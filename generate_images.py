import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import os

# Set style
sns.set_theme(style="whitegrid")
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans', 'Liberation Sans', 'Bitstream Vera Sans', 'sans-serif']

OUTPUT_DIR = "imagenes/historia"
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
    print("Generated climograma_austral.png")

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
    print("Generated grafico_oferta_demanda.png")

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
    print("Generated grafico_crisis_1929.png")

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
    print("Generated grafico_isi.png")

# 5. Map: Africa Colonial (Schematic)
def generate_africa_map():
    # Since we can't easily draw a real map without shapefiles, we'll create a conceptual diagram
    # representing "Artificial Borders"
    
    fig, ax = plt.subplots(figsize=(8, 8))
    
    # Draw a blob representing a territory
    theta = np.linspace(0, 2*np.pi, 100)
    r = 10 + 2*np.sin(3*theta) + np.cos(5*theta)
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    
    ax.fill(x, y, color='#f0e4d2', edgecolor='black', linewidth=2)
    
    # Draw straight lines cutting through it (Artificial borders)
    ax.plot([-5, 5], [10, -10], color='red', linewidth=4, linestyle='--')
    ax.plot([-10, 10], [0, 0], color='red', linewidth=4, linestyle='--')
    
    # Add text
    ax.text(-5, 5, "Colonia A", fontsize=14, fontweight='bold', color='darkblue')
    ax.text(5, -5, "Colonia B", fontsize=14, fontweight='bold', color='darkgreen')
    ax.text(0, 8, "Grupo Étnico 1", fontsize=10, color='black', ha='center')
    ax.text(0, -8, "Grupo Étnico 2", fontsize=10, color='black', ha='center')
    
    ax.set_title('Esquema: Fronteras Artificiales en África', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_africa_colonial.png')
    print("Generated mapa_africa_colonial.png")

# 6. Map: German Expansion (Schematic)
def generate_german_expansion():
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Germany (Center)
    rect_germany = plt.Rectangle((0.3, 0.3), 0.4, 0.4, color='#708090', alpha=0.8, label='Alemania (1937)')
    ax.add_patch(rect_germany)
    ax.text(0.5, 0.5, "ALEMANIA", ha='center', va='center', fontsize=14, fontweight='bold', color='white')
    
    # Austria (South)
    rect_austria = plt.Rectangle((0.35, 0.1), 0.3, 0.2, color='#d62728', alpha=0.6, label='Anexión Austria (1938)')
    ax.add_patch(rect_austria)
    ax.text(0.5, 0.2, "AUSTRIA", ha='center', va='center', fontsize=12, fontweight='bold')
    
    # Sudetes (East/Rim)
    rect_sudetes = plt.Rectangle((0.7, 0.3), 0.1, 0.4, color='#ff7f0e', alpha=0.6, label='Sudetes (1938)')
    ax.add_patch(rect_sudetes)
    ax.text(0.75, 0.5, "SUDETES", ha='center', va='center', fontsize=10, fontweight='bold', rotation=90)
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.legend(loc='upper left')
    ax.set_title('Expansión Territorial Alemana (1938)', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_expansion_alemana.png')
    print("Generated mapa_expansion_alemana.png")

# 7. Map: War of the Pacific (Schematic)
def generate_pacific_war_map():
    fig, ax = plt.subplots(figsize=(6, 10))
    
    # Chile (Long strip)
    rect_chile = plt.Rectangle((0.4, 0.0), 0.2, 0.5, color='#1f77b4', alpha=0.6)
    ax.add_patch(rect_chile)
    ax.text(0.5, 0.25, "CHILE\n(Original)", ha='center', va='center', fontsize=12, color='white')
    
    # Antofagasta (Bolivia)
    rect_anto = plt.Rectangle((0.4, 0.5), 0.2, 0.2, color='#ff7f0e', alpha=0.6)
    ax.add_patch(rect_anto)
    ax.text(0.5, 0.6, "ANTOFAGASTA\n(Salitre)", ha='center', va='center', fontsize=12, fontweight='bold')
    
    # Tarapaca (Peru)
    rect_tara = plt.Rectangle((0.4, 0.7), 0.2, 0.2, color='#d62728', alpha=0.6)
    ax.add_patch(rect_tara)
    ax.text(0.5, 0.8, "TARAPACÁ\n(Salitre)", ha='center', va='center', fontsize=12, fontweight='bold')
    
    # Ocean
    rect_ocean = plt.Rectangle((0.0, 0.0), 0.4, 1.0, color='#aec7e8', alpha=0.3)
    ax.add_patch(rect_ocean)
    ax.text(0.2, 0.5, "OCÉANO PACÍFICO", ha='center', va='center', rotation=90, fontsize=14, color='#1f77b4')
    
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.set_title('Territorios en Disputa\nGuerra del Pacífico', fontsize=16, fontweight='bold')
    ax.axis('off')
    save_plot('mapa_guerra_pacifico.png')
    print("Generated mapa_guerra_pacifico.png")

if __name__ == "__main__":
    generate_climograma()
    generate_supply_demand()
    generate_crisis_1929()
    generate_isi_growth()
    generate_africa_map()
    generate_german_expansion()
    generate_pacific_war_map()
