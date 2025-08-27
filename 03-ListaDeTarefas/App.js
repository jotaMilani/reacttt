import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  //variavel de armazenamento das tarefas
  const [task, setTask] = useState([]);
  //estado para o texto da tarefa
  const [newtask, setNewtask] = useState("");

useEffect(() => {
  const loadTasks = async () => {
    try{
      const savedTasks = await AsyncStorage.getItem("tasks");
      savedTasks && setStatusBarNetworkActivityIndicatorVisible(JSON.parse(savedTasks));
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error)
    }
  }
  loadTasks();
} )


useEffect(()=>{
  const saveTasks = async () => {
    try{
      await AsyncStorage.setItem("task", JSON.stringify(task))
    } catch (error) {
      console.error("Erro ao salvar tarefas", error);
    }
  };

saveTasks();

},[task])

  const addtask = () => {
    if (newtask.trim().length > 0) {
      setTask((prevtask) => [
        ...prevtask,
        {
          id: Date.now().toString(),
          text: newtask.trim(),
          completed: false,
        },
      ]);
      setNewtask("");
      Keyboard.dismiss();
    } else {
      Alert.alert("Atenção", "Por favor informe uma tarefa");
    }
  };

  const toggleCompleteted = (id) => {
    setTask((prevTask) =>
      prevTask.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert(
      "confirmar exclusão",
      "Tem certeza que deseja excluir essa tarefa?",
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTask((prev) => prev.filter((task) => task.id !== id)),
        },
      ]
    );
  };

  const renderList = ({ item }) => (
    <View style={styles.taskItem} key={item.id}>
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => toggleCompleteted(item.id)}
      >
        <Text
          style={[styles.taskText, item.completed && styles.completedTaskItem]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.taskText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTittle}>Minhas Tarefas</Text>
        <TouchableOpacity>
          <Text>🌛</Text>
        </TouchableOpacity>
      </View>

      {/* local onde o usuario insere as tarefas */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          value={newtask}
          onChangeText={setNewtask} //onChangeText especifica somente o texto
          onSubmitEditing={addtask} //executa a função quando o usuario clicar em "ok no Keyboard(teclado)"
        />
        <TouchableOpacity style={styles.addButton} onPress={addtask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      {/* lista de tarefas */}
      <FlatList
        style={[styles.flatList]}
        data={task}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            Nenhuma tarefa adicionando ainda
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
  },
  topBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0, 0.1)",
  },
  topBarTittle: {
    color: "#051650",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    backgroundColor: "#fcfcfc",
    color: "#333",
    borderColor: "#b0bec5",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#123499",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10, //espaçamento no final da lista
  },
  taskItem: {
    backgroundColor: "#fff",
    color: "#333",
    borderColor: "rgba(0,0,0, 0.1)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    color: "#333",
    fontSize: 18,
    flexWrap: "wrap",
  },
  completedTaskItem: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyListText: {
    color: "#9e9e9e",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
