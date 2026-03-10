import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { themeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";

import { data } from "@/data/todo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ThemeContext } from "@react-navigation/native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState("");
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fecthData = async (id) => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const myTodo = storageTodos.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fecthData(id);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  const handleSave = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(
          (todo) => todo.id !== savedTodo.id,
        );

        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput />
        <Pressable></Pressable>
      </View>

      <View>
        <Pressable></Pressable>
        <Pressable></Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}
