import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const machineInfo: Record<string, { description: string; category: string; exercises: string[]; youtubeLinks: string[] }> = {
  "leg press": {
    description: "A machine that targets your quadriceps, hamstrings, and glutes. It allows you to push weight away using your legs.",
    category: "Legs",
    exercises: ["Leg Press", "Bulgarian Split Squat", "Walking Lunges"],
    youtubeLinks: [
      "https://www.youtube.com/watch?v=IZxyjW7MPJQ", // Leg Press
      "https://www.youtube.com/watch?v=2C-uNgKwPLE", // Bulgarian Split Squat
      "https://www.youtube.com/watch?v=QOVaHwm-Q6U", // Walking Lunges
    ]
  },
  "lat pulldown": {
    description: "Primarily used to target the latissimus dorsi muscles in your back and arms.",
    category: "Back",
    exercises: ["Lat Pulldown", "Pull-ups", "Chin-ups"],
    youtubeLinks: [
      "https://www.youtube.com/watch?v=CAwf7n6Luuc", // Lat Pulldown
      "https://www.youtube.com/watch?v=eGo4IYlbE5g", // Pull-ups
      "https://www.youtube.com/watch?v=brhRXlOhsAM", // Chin-ups
    ]
  },
  "pec deck": {
    description: "Works the chest muscles, especially the pectorals, using a fly motion.",
    category: "Chest",
    exercises: ["Chest Fly", "Push-ups", "Dumbbell Chest Press"],
    youtubeLinks: [
      "https://www.youtube.com/watch?v=6Z0u8E6zddI", // Chest Fly
      "https://www.youtube.com/watch?v=IODxDxX7oi4", // Push-ups
      "https://www.youtube.com/watch?v=VmB1G1K7v94", // Dumbbell Chest Press
    ]
  },
  "abdominal crunch hammer": {
  "description": "Targets the abdominal muscles by providing resistance during the crunch motion, isolating the core for effective contraction.",
  "category": "Core",
  "exercises": ["Machine Crunch", "Weighted Crunch", "Seated Ab Crunch"],
  "youtubeLinks": [
    "https://www.youtube.com/watch?v=Z57CtFmRMxw", // Machine Crunch
    "https://www.youtube.com/watch?v=QilQO5I6Qic", // Weighted Crunch
    "https://www.youtube.com/watch?v=KA97BfGS5zQ"  // Seated Ab Crunch
  ]
  },

  "leg extension and leg curl": {
    description: "Isolates the hamstrings by curling the legs towards the buttocks.",
    category: "Hamstrings",
    exercises: ["Leg Curl", "Stiff-legged Deadlift", "Good Mornings"],
    youtubeLinks: [
      "https://www.youtube.com/watch?v=1Tq3QdYUuHs", // Leg Curl
      "https://www.youtube.com/watch?v=ZyQhOMMG2l4", // Stiff-legged Deadlift
      "https://www.youtube.com/watch?v=93m9ZpSkB6g", // Good Mornings
    ]
  },
  "chest press": {
    description: "Mimics the bench press and targets the chest, shoulders, and triceps.",
    category: "Chest",
    exercises: ["Chest Press", "Barbell Bench Press", "Incline Dumbbell Press"],
    youtubeLinks: [
      "https://www.youtube.com/watch?v=YbX7Wd9dH9g", // Chest Press
      "https://www.youtube.com/watch?v=gRVjAtPip0Y", // Barbell Bench Press
      "https://www.youtube.com/watch?v=8iPEnn-ltC8", // Incline Dumbbell Press
    ]
  },

  "ez bar": {
  description: "A curved barbell primarily used for biceps and triceps exercises, reducing wrist strain during curls and extensions.",
  category: "Arms",
  exercises: ["EZ Bar Curl", "EZ Bar Skull Crushers", "EZ Bar Preacher Curl"],
  youtubeLinks: [
    "https://www.youtube.com/watch?v=kwG2ipFRgfo", // EZ Bar Curl
    "https://www.youtube.com/watch?v=d_KZxkY_0cM", // EZ Bar Skull Crushers
    "https://www.youtube.com/watch?v=2xFuTtMhJ1A"  // EZ Bar Preacher Curl
  ]
  },

  "treadmill": {
  description: "A cardio machine used for walking, jogging, or running in place. Helps improve cardiovascular endurance and burn calories.",
  category: "Cardio",
  exercises: ["Walking", "Jogging", "Sprinting"],
  youtubeLinks: [
    "https://www.youtube.com/watch?v=dq7NfS8UuZU", // Treadmill Walking
    "https://www.youtube.com/watch?v=_Fv4pSVAjEY", // Treadmill Jogging
    "https://www.youtube.com/watch?v=t8K2GkxELy4"  // Treadmill Sprinting
  ]
  },


  // Add more machines if your model supports them
};


const App = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedMachine, setDetectedMachine] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri ?? null;
      if (uri) {
        setImageUri(uri);
        uploadImage(uri);
      }
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri ?? null;
      if (uri) {
        setImageUri(uri);
        uploadImage(uri);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    const apiUrl = 'http://192.168.29.95:8000/predict/'; // Your FastAPI server address
    const formData = new FormData();

    const file = {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any;

    formData.append('file', file);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);
      setDetectedMachine(response.data.detected_machine || 'Unknown');
      setErrorMessage('');
    } catch (error) {
      console.error('Upload Error:', error);
      setErrorMessage('Failed to get prediction. Please try again.');
    }
  };

  const info = detectedMachine ? machineInfo[detectedMachine] : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Capture from Camera" onPress={pickImage} />
      <View style={styles.spacer} />
      <Button title="Select from Gallery" onPress={pickImageFromGallery} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {detectedMachine && (
        <View style={styles.infoContainer}>
          <Text style={styles.resultText}>Detected Machine: {detectedMachine}</Text>
          {info && (
            <>
              <Text style={styles.description}>Description: {info.description}</Text>
              <Text style={styles.category}>Target Muscle: {info.category}</Text>

              <Text style={styles.exercisesTitle}>Famous Exercises:</Text>
              {info.exercises.map((exercise, index) => (
                <Text key={index} style={styles.exercise}>
                  {exercise}
                </Text>
              ))}

              <Text style={styles.youtubeTitle}>YouTube Tutorials:</Text>
              {info.youtubeLinks.map((link, index) => (
                <Text
                  key={index}
                  style={styles.youtubeLink}
                  onPress={() => Linking.openURL(link)}
                >
                  {link}
                </Text>
              ))}
            </>
          )}
        </View>
      )}

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    paddingBottom: 100,
  },
  spacer: {
    height: 20,
  },
  imagePreview: {
    width: 220,
    height: 220,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    color: '#66ff66',
  },
  exercisesTitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  exercise: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 6,
  },
  youtubeTitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  youtubeLink: {
    fontSize: 16,
    color: '#00f',
    marginBottom: 6,
  },
  errorText: {
    marginTop: 15,
    color: 'red',
    fontSize: 16,
  },
});

export default App;
