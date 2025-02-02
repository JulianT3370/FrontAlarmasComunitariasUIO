import math

# posicion central clat clon
def formula (lat, lon, clat, clon, radioTierra):
    dLat = math.radians(clat - lat)
    dLon = math.radians(clon - lon)

    a = math.sin(dLat/2) * math.sin(dLat / 2) + math.cos(math.radians(lat)) * math.cos(math.radians(clat)) * math.sin(dLon / 2) * math.sin(dLon / 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radioTierra * c * 1000