import pandas as pd
import os

# --- Configuración ---
# Asegúrate de que los archivos que descargaste estén en la misma carpeta que este script,
# o cambia la ruta aquí.
LISTINGS_FILE = 'listings.csv'
CLEANED_OUTPUT_FILE = 'madrid_properties_cleaned.csv'

print("Iniciando el procesamiento de datos de Madrid...")

# --- Carga de Datos ---
# Comprobamos si el archivo de listings existe antes de continuar.
if not os.path.exists(LISTINGS_FILE):
    print(f"Error: No se encontró el archivo '{LISTINGS_FILE}'.")
    print("Por favor, asegúrate de que el archivo listings.csv descomprimido está en la misma carpeta que este script.")
    exit()

# Cargamos el archivo listings.csv usando pandas.
# Esto puede tardar unos segundos, ya que el archivo es grande.
print(f"Cargando el archivo '{LISTINGS_FILE}'...")
try:
    df = pd.read_csv(LISTINGS_FILE)
    print(f"¡Éxito! Se han cargado {len(df)} propiedades.")
except Exception as e:
    print(f"Ha ocurrido un error al leer el archivo CSV: {e}")
    exit()

# --- Limpieza y Selección de Columnas ---
# El archivo original tiene más de 70 columnas. Solo necesitamos unas pocas.
# Seleccionamos las columnas que son realmente útiles para nuestro análisis.
columns_to_keep = [
    'id',
    'name',
    'host_id',
    'neighbourhood_cleansed',
    'latitude',
    'longitude',
    'property_type',
    'room_type',
    'accommodates',
    'bathrooms_text',
    'bedrooms',
    'beds',
    'amenities',
    'price',
    'number_of_reviews',
    'review_scores_rating',
    'review_scores_accuracy',
    'review_scores_cleanliness',
    'review_scores_location',
    'review_scores_value'
]

# Nos aseguramos de que todas las columnas que queremos mantener existan en el DataFrame.
existing_columns = [col for col in columns_to_keep if col in df.columns]
print(f"Seleccionando {len(existing_columns)} columnas relevantes...")
df_cleaned = df[existing_columns]


# --- Procesamiento y Formateo ---
# La columna 'price' viene como texto (ej: "$120.00").
# Necesitamos convertirla a un número para poder hacer cálculos.
print("Limpiando y formateando la columna de precios...")
# Eliminamos el símbolo de dólar/euro y las comas, y lo convertimos a un número.
# Si hay algún error en la conversión, se establecerá como 'NaN' (Not a Number).
df_cleaned['price'] = pd.to_numeric(df_cleaned['price'].replace({r'\$': '', r'€': '', ',': ''}, regex=True), errors='coerce')

# Eliminamos las filas donde el precio no sea un número válido.
df_cleaned = df_cleaned.dropna(subset=['price'])


# --- Guardado del Archivo Limpio ---
# Guardamos nuestro DataFrame limpio en un nuevo archivo CSV.
# Este archivo será mucho más pequeño y rápido de cargar en el futuro.
print(f"Guardando los datos limpios en '{CLEANED_OUTPUT_FILE}'...")
df_cleaned.to_csv(CLEANED_OUTPUT_FILE, index=False)

print("\n¡Proceso completado con éxito!")
print(f"Se han procesado y guardado {len(df_cleaned)} propiedades limpias en '{CLEANED_OUTPUT_FILE}'.")
print("Este es el archivo que usaremos como base para nuestra aplicación.")