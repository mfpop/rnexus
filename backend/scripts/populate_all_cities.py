#!/usr/bin/env python
"""
Script to populate all major cities for USA and Mexico in the database.
This script adds comprehensive city data for both countries.
"""

import os
import sys
import django
import requests
import time

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Country, State, City

def get_us_cities_data():
    """Get comprehensive US cities data"""
    return {
        # California
        'CA': [
            'Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 
            'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 
            'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'San Bernardino', 'Modesto', 
            'Fontana', 'Oxnard', 'Moreno Valley', 'Huntington Beach', 'Glendale', 'Santa Clarita', 
            'Garden Grove', 'Oceanside', 'Rancho Cucamonga', 'Santa Rosa', 'Ontario', 'Lancaster',
            'Elk Grove', 'Palmdale', 'Corona', 'Salinas', 'Pomona', 'Torrance', 'Hayward', 
            'Escondido', 'Sunnyvale', 'Pasadena', 'Orange', 'Fullerton', 'Thousand Oaks', 
            'Visalia', 'Simi Valley', 'Concord', 'Roseville', 'Santa Clara', 'Vallejo'
        ],
        # Texas
        'TX': [
            'Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 
            'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Garland', 'Irving', 'Amarillo', 
            'Grand Prairie', 'Brownsville', 'Pasadena', 'Mesquite', 'McKinney', 'McAllen', 
            'Killeen', 'Frisco', 'Waco', 'Carrollton', 'Pearland', 'Denton', 'Midland', 
            'Abilene', 'Round Rock', 'Richardson', 'Odessa', 'Tyler', 'Lewisville', 'College Station',
            'Beaumont', 'San Angelo', 'Allen', 'Sugar Land', 'Longview', 'Edinburg', 'Bryan', 
            'Pharr', 'Baytown', 'Missouri City', 'Flower Mound', 'New Braunfels', 'Cedar Park', 
            'Harlingen', 'Georgetown', 'Port Arthur', 'Mansfield'
        ],
        # New York
        'NY': [
            'New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 
            'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 
            'Binghamton', 'Freeport', 'Valley Stream', 'Long Beach', 'Rome', 'Ithaca', 'Watertown', 
            'Poughkeepsie', 'Elmira', 'Kingston', 'Middletown', 'Newburgh', 'Auburn', 'Glens Falls', 
            'Batavia', 'Oswego', 'Plattsburgh', 'Cortland', 'Oneonta', 'Hornell', 'Lockport', 
            'Saratoga Springs', 'Peekskill', 'Gloversville', 'Beacon', 'Hudson', 'Fulton', 'Geneva', 
            'Canandaigua', 'Malone', 'Ogdensburg', 'Massena', 'Corning', 'Jamestown', 'Dunkirk'
        ],
        # Florida
        'FL': [
            'Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 
            'Fort Lauderdale', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Miramar', 
            'Gainesville', 'Coral Springs', 'Miami Gardens', 'Clearwater', 'Palm Bay', 'West Palm Beach', 
            'Pompano Beach', 'Lakeland', 'Davie', 'Miami Beach', 'Sunrise', 'Plantation', 'Boca Raton', 
            'Deltona', 'Largo', 'Deerfield Beach', 'Boynton Beach', 'Lauderhill', 'Weston', 'Fort Myers', 
            'Kissimmee', 'Homestead', 'Tamarac', 'Delray Beach', 'Daytona Beach', 'North Miami', 'Wellington',
            'Jupiter', 'Ocala', 'Port Orange', 'Margate', 'Coconut Creek', 'Sanford', 'Sarasota', 
            'Pensacola', 'Bradenton', 'Palm Coast'
        ],
        # Illinois
        'IL': [
            'Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 
            'Elgin', 'Waukegan', 'Cicero', 'Champaign', 'Bloomington', 'Arlington Heights', 
            'Evanston', 'Decatur', 'Schaumburg', 'Bolingbrook', 'Palatine', 'Skokie', 'Des Plaines', 
            'Orland Park', 'Tinley Park', 'Oak Lawn', 'Berwyn', 'Mount Prospect', 'Normal', 'Wheaton', 
            'Hoffman Estates', 'Oak Park', 'Downers Grove', 'Elmhurst', 'Glenview', 'Lombard', 
            'Buffalo Grove', 'Bartlett', 'Urbana', 'Quincy', 'Crystal Lake', 'Streamwood', 'Carol Stream',
            'Romeoville', 'Plainfield', 'Hanover Park', 'Carpentersville', 'Wheeling', 'Park Ridge', 
            'Addison', 'Calumet City', 'Northbrook', 'St. Charles'
        ],
        # Pennsylvania
        'PA': [
            'Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 
            'Lancaster', 'Harrisburg', 'Altoona', 'York', 'State College', 'Wilkes-Barre', 'Chester', 
            'Williamsport', 'Easton', 'Lebanon', 'Hazleton', 'New Castle', 'Johnstown', 'McKeesport', 
            'Norristown', 'Pottstown', 'Butler', 'Monroeville', 'Sharon', 'Washington', 'Greensburg', 
            'Coatesville', 'New Kensington', 'Uniontown', 'Meadville', 'Phoenixville', 'West Chester', 
            'Doylestown', 'Bristol', 'Bellefonte', 'Waynesburg', 'Indiana', 'Gettysburg', 'Chambersburg',
            'Carlisle', 'Lewisburg', 'Kutztown', 'Bloomsburg', 'Mansfield', 'Lock Haven', 'Clarion', 
            'Edinboro', 'California'
        ],
        # Ohio
        'OH': [
            'Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 
            'Youngstown', 'Lorain', 'Hamilton', 'Springfield', 'Kettering', 'Elyria', 'Lakewood', 
            'Cuyahoga Falls', 'Middletown', 'Euclid', 'Newark', 'Mansfield', 'Mentor', 'Beavercreek', 
            'Cleveland Heights', 'Strongsville', 'Fairborn', 'Findlay', 'Warren', 'Lancaster', 'Lima', 
            'Huber Heights', 'Westerville', 'Marion', 'Grove City', 'Stow', 'Delaware', 'Reynoldsburg', 
            'Upper Arlington', 'Westlake', 'Gahanna', 'Pickerington', 'North Olmsted', 'Troy', 'Zanesville',
            'Mason', 'Bowling Green', 'Kent', 'Sandusky', 'Massillon', 'Wooster', 'Barberton'
        ],
        # Georgia
        'GA': [
            'Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 
            'Macon', 'Albany', 'Johns Creek', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 
            'Smyrna', 'Dunwoody', 'Rome', 'East Point', 'Peachtree Corners', 'Hinesville', 'Kennesaw', 
            'Newnan', 'Dalton', 'Statesboro', 'Carrollton', 'Griffin', 'LaGrange', 'Union City', 
            'Gainesville', 'Decatur', 'Sugar Hill', 'Milledgeville', 'Canton', 'Acworth', 'Douglasville',
            'Lawrenceville', 'Tucker', 'Duluth', 'Stockbridge', 'Woodstock', 'Cartersville', 'McDonough', 
            'Fayetteville', 'Thomasville', 'Tifton', 'Americus', 'Waycross', 'Brunswick', 'Vidalia', 'Cordele'
        ],
        # North Carolina
        'NC': [
            'Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 
            'Wilmington', 'High Point', 'Concord', 'Asheville', 'Gastonia', 'Jacksonville', 'Chapel Hill', 
            'Rocky Mount', 'Burlington', 'Wilson', 'Huntersville', 'Kannapolis', 'Apex', 'Hickory', 
            'Goldsboro', 'Greenville', 'Mooresville', 'Salisbury', 'New Bern', 'Sanford', 'Matthews', 
            'Thomasville', 'Statesville', 'Mint Hill', 'Kernersville', 'Morganton', 'Lumberton', 'Monroe',
            'Albemarle', 'Shelby', 'Graham', 'Lexington', 'Clemmons', 'Cornelius', 'Garner', 'Fuquay-Varina', 
            'Havelock', 'Kinston', 'Laurinburg', 'Lenoir', 'Mount Airy', 'Oxford', 'Reidsville'
        ],
        # Michigan
        'MI': [
            'Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing', 'Ann Arbor', 'Flint', 
            'Dearborn', 'Livonia', 'Westland', 'Troy', 'Farmington Hills', 'Kalamazoo', 'Wyoming', 
            'Southfield', 'Rochester Hills', 'Taylor', 'Pontiac', 'St. Clair Shores', 'Royal Oak', 
            'Novi', 'Dearborn Heights', 'Battle Creek', 'Saginaw', 'Kentwood', 'East Lansing', 'Portage', 
            'Midland', 'Lincoln Park', 'Bay City', 'Muskegon', 'Holland', 'Walker', 'Wyandotte', 'Inkster',
            'Romulus', 'Garden City', 'Oak Park', 'Madison Heights', 'Allen Park', 'Marquette', 'Traverse City', 
            'Mount Pleasant', 'Niles', 'Jackson', 'Monroe', 'Benton Harbor', 'Ypsilanti', 'Adrian'
        ]
    }

def get_mexican_cities_data():
    """Get comprehensive Mexican cities data"""
    return {
        # Jalisco
        'JAL': [
            'Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'El Salto', 'Tlajomulco de Zúñiga', 
            'San Pedro Tlaquepaque', 'Ixtlahuacán de los Membrillos', 'Juanacatlán', 'Acatlán de Juárez',
            'Amatitán', 'Arandas', 'Atemajac de Brizuela', 'Atengo', 'Atenguillo', 'Atotonilco el Alto',
            'Atoyac', 'Autlán de Navarro', 'Ayotlán', 'Ayutla', 'Bolaños', 'Cabo Corrientes', 'Cañadas de Obregón',
            'Casimiro Castillo', 'Chapala', 'Chimaltitán', 'Chiquilistlán', 'Cihuatlán', 'Cocula', 'Colotlán',
            'Concepción de Buenos Aires', 'Cuautitlán de García Barragán', 'Cuautla', 'Cuquío', 'Degollado',
            'Ejutla', 'Encarnación de Díaz', 'Etzatlán', 'El Grullo', 'El Limón', 'Gómez Farías', 'Guachinango',
            'Guadalajara', 'Hostotipaquillo', 'Huejúcar', 'Huejuquilla el Alto', 'La Barca', 'La Huerta',
            'La Manzanilla de la Paz', 'Lagos de Moreno', 'Magdalena', 'Mascota', 'Mazamitla', 'Mexticacán',
            'Mezquitic', 'Mixtlán', 'Ocotlán', 'Ojuelos de Jalisco', 'Pihuamo', 'Poncitlán', 'Puerto Vallarta',
            'Quitupan', 'San Cristóbal de la Barranca', 'San Diego de Alejandría', 'San Gabriel', 'San Ignacio Cerro Gordo',
            'San Juan de los Lagos', 'San Julián', 'San Marcos', 'San Martín de Bolaños', 'San Martín Hidalgo',
            'San Miguel el Alto', 'San Sebastián del Oeste', 'Santa María de los Ángeles', 'Sayula', 'Tala',
            'Talpa de Allende', 'Tamazula de Gordiano', 'Tapalpa', 'Tecalitlán', 'Tecolotlán', 'Techaluta de Montenegro',
            'Tenamaxtlán', 'Teocaltiche', 'Teocuitatlán de Corona', 'Tepatitlán de Morelos', 'Tequila', 'Teuchitlán',
            'Tizapán el Alto', 'Tlajomulco de Zúñiga', 'San Pedro Tlaquepaque', 'Tolimán', 'Tomatlán', 'Tonalá',
            'Tonaya', 'Tonila', 'Totatiche', 'Tototlán', 'Tuxcacuesco', 'Tuxcueca', 'Tuxpan', 'Unión de San Antonio',
            'Unión de Tula', 'Valle de Guadalupe', 'Valle de Juárez', 'Villa Corona', 'Villa Guerrero', 'Villa Hidalgo',
            'Villa Purificación', 'Yahualica de González Gallo', 'Zacoalco de Torres', 'Zapopan', 'Zapotiltic',
            'Zapotitlán de Vadillo', 'Zapotlán del Rey', 'Zapotlán el Grande', 'Zapotlanejo'
        ],
        # Mexico City
        'CDMX': [
            'Ciudad de México', 'Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa de Morelos',
            'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo',
            'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'
        ],
        # Nuevo León
        'NLE': [
            'Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca', 'Escobedo', 'Santa Catarina',
            'San Pedro Garza García', 'Cadereyta Jiménez', 'García', 'Juárez', 'Salinas Victoria', 'San Martín',
            'Pesquería', 'Ciénega de Flores', 'El Carmen', 'Hidalgo', 'Linares', 'Montemorelos', 'Sabinas Hidalgo',
            'Salinas Victoria', 'Villaldama', 'Abasolo', 'Agualeguas', 'Allende', 'Anáhuac', 'Aramberri',
            'Bustamante', 'Cerralvo', 'China', 'Doctor Arroyo', 'Doctor Coss', 'Doctor González', 'Galeana',
            'General Bravo', 'General Escobedo', 'General Terán', 'General Treviño', 'General Zaragoza',
            'General Zuazua', 'Higueras', 'Hualahuises', 'Iturbide', 'Lampazos de Naranjo', 'Los Aldamas',
            'Los Herrera', 'Los Ramones', 'Marín', 'Melchor Ocampo', 'Mier y Noriega', 'Mina', 'Parás',
            'Rayones', 'Santiago', 'Vallecillo'
        ],
        # Puebla
        'PUE': [
            'Puebla', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco', 'San Pedro Cholula', 'San Andrés Cholula',
            'Huauchinango', 'Zacatlán', 'Teziutlán', 'Izúcar de Matamoros', 'Ajalpan', 'Amozoc', 'Atempan',
            'Atlequizayan', 'Atoyatempan', 'Atzala', 'Atzitzihuacán', 'Atzitzintla', 'Axutla', 'Ayotoxco de Guerrero',
            'Calpan', 'Caltepec', 'Camocuautla', 'Caxhuacan', 'Chalchicomula de Sesma', 'Chapulco', 'Chiautla',
            'Chiautzingo', 'Chiconcuautla', 'Chichiquila', 'Chietla', 'Chigmecatitlán', 'Chignahuapan', 'Chignautla',
            'Chila', 'Chila de la Sal', 'Chilchotla', 'Chinantla', 'Coatepec', 'Coatzingo', 'Cohetzala', 'Cohuecan',
            'Coronango', 'Coxcatlán', 'Coyomeapan', 'Coyotepec', 'Cuapiaxtla de Madero', 'Cuautempan', 'Cuautinchan',
            'Cuautlancingo', 'Cuayuca de Andrade', 'Cuetzalan del Progreso', 'Cuyoaco', 'Domingo Arenas', 'Eloxochitlán',
            'Epatlán', 'Esperanza', 'Francisco Z. Mena', 'General Felipe Ángeles', 'Guadalupe', 'Guadalupe Victoria',
            'Hermenegildo Galeana', 'Honey', 'Huaquechula', 'Huatlatlauca', 'Huauchinango', 'Huehuetla', 'Huehuetlán el Chico',
            'Huehuetlán el Grande', 'Huejotzingo', 'Hueyapan', 'Hueytamalco', 'Hueytlalpan', 'Huitzilan de Serdán',
            'Huitziltepec', 'Ixcamilpa de Guerrero', 'Ixcaquixtla', 'Ixtacamaxtitlán', 'Ixtepec', 'Izúcar de Matamoros',
            'Jalpan', 'Jolalpan', 'Jonotla', 'Jopala', 'Juan C. Bonilla', 'Juan Galindo', 'Juan N. Méndez',
            'Lafragua', 'Libres', 'La Magdalena Tlatlauquitepec', 'Mazapiltepec de Juárez', 'Mixtla', 'Molcaxac',
            'Naupan', 'Nauzontla', 'Nealtican', 'Nicolás Bravo', 'Nopalucan', 'Ocotepec', 'Ocoyucan', 'Olintla',
            'Oriental', 'Pahuatlán', 'Palmar de Bravo', 'Pantepec', 'Petlalcingo', 'Piaxtla', 'Puebla', 'Quecholac',
            'Quimixtlán', 'Rafael Lara Grajales', 'Los Reyes de Juárez', 'San Andrés Cholula', 'San Antonio Cañada',
            'San Diego la Mesa Tochimiltzingo', 'San Felipe Teotlalcingo', 'San Felipe Tepatlán', 'San Gabriel Chilac',
            'San Gregorio Atzompa', 'San Jerónimo Tecuanipan', 'San Jerónimo Xayacatlán', 'San José Chiapa',
            'San José Miahuatlán', 'San Juan Atenco', 'San Juan Atzompa', 'San Martín Texmelucan', 'San Martín Totoltepec',
            'San Matías Tlalancaleca', 'San Miguel Ixitlán', 'San Miguel Xoxtla', 'San Nicolás Buenos Aires',
            'San Nicolás de los Ranchos', 'San Pablo Anicano', 'San Pedro Cholula', 'San Pedro Yeloixtlahuaca',
            'San Salvador el Seco', 'San Salvador el Verde', 'San Salvador Huixcolotla', 'San Sebastián Tlacotepec',
            'Santa Catarina Tlaltempan', 'Santa Inés Ahuatempan', 'Santa Isabel Cholula', 'Santiago Miahuatlán',
            'Santo Tomás Hueyotlipan', 'Soltepec', 'Tecali de Herrera', 'Tecamachalco', 'Tecomatlán', 'Tehuacán',
            'Tehuitzingo', 'Tenampulco', 'Teopantlán', 'Teotlalco', 'Tepanco de López', 'Tepango de Rodríguez',
            'Tepatlaxco de Hidalgo', 'Tepeaca', 'Tepemaxalco', 'Tepeojuma', 'Tepetzintla', 'Tepexco', 'Tepexi de Rodríguez',
            'Tepeyahualco', 'Tepeyahualco de Cuauhtémoc', 'Tetela de Ocampo', 'Teteles de Ávila Castillo', 'Teziutlán',
            'Tianguismanalco', 'Tilapa', 'Tlacotepec de Benito Juárez', 'Tlacuilotepec', 'Tlachichuca', 'Tlahuapan',
            'Tlaltenango', 'Tlanepantla', 'Tlaola', 'Tlapacoya', 'Tlapanalá', 'Tlatlauquitepec', 'Tlaxco',
            'Tochimilco', 'Tochtepec', 'Totoltepec de Guerrero', 'Tulcingo', 'Tuzamapan de Galeana', 'Tzicatlacoyan',
            'Venustiano Carranza', 'Vicente Guerrero', 'Xayacatlán de Bravo', 'Xicotepec', 'Xicotlán', 'Xiutetelco',
            'Xochiapulco', 'Xochiltepec', 'Xochitlán de Vicente Suárez', 'Xochitlán Todos Santos', 'Yaonáhuac',
            'Yehualtepec', 'Zacapala', 'Zacapoaxtla', 'Zacatlán', 'Zapotitlán', 'Zapotitlán de Méndez', 'Zaragoza',
            'Zautla', 'Zihuateutla', 'Zinacatepec', 'Zongozotla', 'Zoquiapan', 'Zoquitlán'
        ],
        # Veracruz
        'VER': [
            'Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba', 'Poza Rica de Hidalgo', 'Minatitlán', 'Orizaba',
            'Túxpam de Rodríguez Cano', 'Papantla', 'Martínez de la Torre', 'San Andrés Tuxtla', 'Tantoyuca',
            'Pánuco', 'Tierra Blanca', 'Boca del Río', 'Nogales', 'Río Blanco', 'Catemaco', 'Huatusco', 'Agua Dulce',
            'Acajete', 'Acatlán', 'Acayucan', 'Actopan', 'Acula', 'Acultzingo', 'Agua Dulce', 'Álamo Temapache',
            'Alpatláhuac', 'Alto Lucero de Gutiérrez Barrios', 'Altotonga', 'Alvarado', 'Amatitlán', 'Amatlán de los Reyes',
            'Angel R. Cabada', 'Apazapan', 'Aquila', 'Astacinga', 'Atlahuilco', 'Atoyac', 'Atzacan', 'Atzalan',
            'Ayahualulco', 'Banderilla', 'Benito Juárez', 'Boca del Río', 'Calcahualco', 'Camerino Z. Mendoza',
            'Carrillo Puerto', 'Catemaco', 'Cazones de Herrera', 'Cerro Azul', 'Citlaltépetl', 'Coacoatzintla',
            'Coahuitlán', 'Coatepec', 'Coatzacoalcos', 'Coatzintla', 'Coetzala', 'Colipa', 'Comapa', 'Córdoba',
            'Cosamaloapan de Carpio', 'Cosautlán de Carvajal', 'Coscomatepec', 'Cosoleacaque', 'Cotaxtla', 'Coxquihui',
            'Coyutla', 'Cuichapa', 'Cuitláhuac', 'Chacaltianguis', 'Chalma', 'Chiconamel', 'Chiconquiaco', 'Chicontepec',
            'Chinameca', 'Chinampa de Gorostiza', 'Chocamán', 'Chontla', 'Chumatlán', 'Emiliano Zapata', 'Espinal',
            'Filomeno Mata', 'Fortín', 'Gutiérrez Zamora', 'Hidalgotitlán', 'Huatusco', 'Huayacocotla', 'Hueyapan de Ocampo',
            'Huiloapan de Cuauhtémoc', 'Ignacio de la Llave', 'Ilamatlán', 'Isla', 'Ixcatepec', 'Ixhuacán de los Reyes',
            'Ixhuatlán de Madero', 'Ixhuatlán del Café', 'Ixhuatlán del Sureste', 'Ixhuatlancillo', 'Ixmatlahuacan',
            'Ixtaczoquitlán', 'Jalacingo', 'Xalapa', 'Jalcomulco', 'Jáltipan', 'Jamapa', 'Jesús Carranza', 'Xico',
            'Jilotepec', 'Juan Rodríguez Clara', 'Juchique de Ferrer', 'Landero y Coss', 'Lerdo de Tejada', 'Magdalena',
            'Maltrata', 'Manlio Fabio Altamirano', 'Mariano Escobedo', 'Martínez de la Torre', 'Mecatlán', 'Mecayapan',
            'Medellín', 'Miahuatlán', 'Las Minas', 'Minatitlán', 'Misantla', 'Mixtla de Altamirano', 'Moloacán',
            'Naolinco', 'Naranjal', 'Nautla', 'Nogales', 'Oluta', 'Omealca', 'Orizaba', 'Otatitlán', 'Oteapan',
            'Ozuluama de Mascareñas', 'Pajapan', 'Pánuco', 'Papantla', 'Paso del Macho', 'Paso de Ovejas', 'La Perla',
            'Perote', 'Platón Sánchez', 'Playa Vicente', 'Poza Rica de Hidalgo', 'Las Vigas de Ramírez', 'Pueblo Viejo',
            'Puente Nacional', 'Rafael Delgado', 'Rafael Lucio', 'Los Reyes', 'Río Blanco', 'Saltabarranca', 'San Andrés Tenejapan',
            'San Andrés Tuxtla', 'San Juan Evangelista', 'Santiago Tuxtla', 'Sayula de Alemán', 'Soconusco', 'Sochiapa',
            'Soledad Atzompa', 'Soledad de Doblado', 'Soteapan', 'Tamalín', 'Tamiahua', 'Tampico Alto', 'Tancoco',
            'Tantima', 'Tantoyuca', 'Tatatila', 'Castillo de Teayo', 'Tecolutla', 'Tehuipango', 'Álamo Temapache',
            'Tempoal', 'Tenampa', 'Tenochtitlán', 'Teocelo', 'Tepatlaxco', 'Tepetlán', 'Tepetzintla', 'Tequila',
            'José Azueta', 'Texcatepec', 'Texhuacán', 'Texistepec', 'Tezonapa', 'Tierra Blanca', 'Tihuatlán', 'Tlacojalpan',
            'Tlacolulan', 'Tlacotalpan', 'Tlacotepec de Mejía', 'Tlachichilco', 'Tlalixcoyan', 'Tlalnelhuayocan', 'Tlapacoyan',
            'Tlaquilpa', 'Tlilapan', 'Tomatlán', 'Tonayán', 'Totutla', 'Túxpam de Rodríguez Cano', 'Tuxtilla', 'Ursulo Galván',
            'Vega de Alatorre', 'Veracruz', 'Villa Aldama', 'Xoxocotla', 'Yanga', 'Yecuatla', 'Zacualpan', 'Zaragoza',
            'Zentla', 'Zongolica', 'Zontecomatlán de López y Fuentes', 'Zozocolco de Hidalgo', 'Agua Dulce', 'El Higo',
            'Nanchital de Lázaro Cárdenas del Río', 'Tres Valles', 'Carlos A. Carrillo', 'Tatahuicapan de Juárez',
            'Uxpanapa', 'San Rafael', 'Santiago Sochiapan'
        ]
    }

def populate_cities_for_country(country_code, cities_data):
    """Populate cities for a specific country"""
    print(f"\nAdding cities for {country_code}...")
    
    # Get the country
    try:
        country = Country.objects.get(code=country_code)
    except Country.DoesNotExist:
        print(f"Error: {country_code} country not found in database")
        return
    
    total_added = 0
    for state_code, city_names in cities_data.items():
        # Get the state
        try:
            state = State.objects.get(country=country, code=state_code)
        except State.DoesNotExist:
            print(f"  Warning: State {state_code} not found for {country.name}")
            continue
        
        print(f"  Adding cities for {state.name} ({state_code}):")
        state_added = 0
        
        for city_name in city_names:
            city, created = City.objects.get_or_create(
                name=city_name,
                state=state,
                country=country,
                defaults={'is_active': True}
            )
            if created:
                state_added += 1
                total_added += 1
                print(f"    Added: {city_name}")
        
        print(f"    {state_added} new cities added for {state.name}")
    
    print(f"Total cities added for {country.name}: {total_added}")

def main():
    """Main function to populate all cities"""
    print("🏙️ Populating all major cities for USA and Mexico...")
    print("=" * 60)
    
    # Check if countries exist
    us_country = Country.objects.filter(code='USA').first()
    mexico_country = Country.objects.filter(code='MEX').first()
    
    if not us_country:
        print("Error: United States country not found. Please run populate_location_data.py first.")
        return
    
    if not mexico_country:
        print("Error: Mexico country not found. Please run populate_location_data.py first.")
        return
    
    # Get city data
    us_cities = get_us_cities_data()
    mexican_cities = get_mexican_cities_data()
    
    # Populate cities
    populate_cities_for_country('USA', us_cities)
    populate_cities_for_country('MEX', mexican_cities)
    
    # Summary
    total_us_cities = City.objects.filter(country__code='USA').count()
    total_mexican_cities = City.objects.filter(country__code='MEX').count()
    
    print("\n" + "=" * 60)
    print("✅ City population complete!")
    print(f"Total US cities: {total_us_cities}")
    print(f"Total Mexican cities: {total_mexican_cities}")
    print(f"Total cities: {total_us_cities + total_mexican_cities}")

if __name__ == '__main__':
    main()

