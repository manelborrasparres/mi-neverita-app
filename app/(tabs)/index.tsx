import React, { useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
// Importamos los iconos de la librería que ya viene con Expo
import { Feather, Ionicons } from '@expo/vector-icons';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { width, height } = useWindowDimensions();
  
  // 1. Animación para la posición de la cortina (0 = arriba, 1 = abajo)
  const progresoAnim = useRef(new Animated.Value(0)).current;
  
  // 2. Animación para el tamaño del texto (escala 1 = normal)
  const escalaAnim = useRef(new Animated.Value(1)).current;

  const ejecutarTransicion = () => {
    const latido = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnim, {
          toValue: 1.1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(escalaAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      ])
    );

    // PASO A: Bajar la cortina
    Animated.timing(progresoAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // La posición 'top' no soporta driver nativo
    }).start(() => {
      
      // PASO B: Cuando la cortina termina de bajar, empieza el latido
      latido.start();
      
      // PASO C: Esperamos 1.5 segundos (simulando carga)
      setTimeout(() => {
        
        // PASO D: Detenemos el latido y subimos la cortina
        latido.stop(); 
        
        // Reset suave de la escala a 1 antes de subir
        Animated.timing(escalaAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        Animated.timing(progresoAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();

      }, 1500);
    });
  };

  // Interpolación: mueve la cortina de -alto a 0
  const posicionCortina = progresoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0], 
  });

  const theme = {
    bg: isDarkMode ? '#121212' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    header: isDarkMode ? '#1f1f1f' : '#FFFFFF',
    card: isDarkMode ? '#2c2c2c' : '#FFFFFF',
    border: isDarkMode ? '#444' : '#DDD',
    accent: '#6200EE'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* --- CORTINA --- */}
      <Animated.View 
        style={[
          styles.cortina, 
          { 
            backgroundColor: theme.accent,
            top: posicionCortina,
            height: height,
          }
        ]}
      >
        {/* Aplicamos la animación de escala al texto para que lata */}
        <Animated.View style={{ transform: [{ scale: escalaAnim }] }}>
          <Text style={styles.textCortina}>NEVERITA</Text>
        </Animated.View>
      </Animated.View>

      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
        <TouchableOpacity>
          <Feather name="user" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Mi App</Text>

        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {[1, 2, 3].map((num) => (
          <TouchableOpacity 
            key={num} 
            activeOpacity={0.8}
            onPress={ejecutarTransicion}
            style={[
              styles.card, 
              { 
                backgroundColor: theme.card, 
                borderColor: theme.border, 
                width: width * 0.95,
                height: height * 0.25 
              }
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>Pantalla {num}</Text>
            <Text style={{ color: theme.text }}>Toca para ver la transición</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cortina: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCortina: {
    color: 'white',
    fontWeight: '900',
    fontSize: 48,
    letterSpacing: 4
  },
  subtextCortina: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 20,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    borderBottomWidth: 1 
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingVertical: 20, alignItems: 'center' },
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});