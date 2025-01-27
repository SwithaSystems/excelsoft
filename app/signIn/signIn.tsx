import Header from '@/components/Header';
import Button from '@/components/commonComponents/Button';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { globalStyles } from "../../assets/styles/globalStyles";
import styles from './signInStyles';


const signIn = () => {

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<{email?: string, password?: string}> >({});

  const validateFields = () => {
    const newErrors = {} as {email?: string, password?: string};  
    if (!email) {
      newErrors.email = "Email or Phone number is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      !/^\d{10}$/.test(email)
    ) {
      newErrors.email = "Enter a valid email or phone number.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (validateFields()) {
      Alert.alert("Success", "Signed in successfully.");
    } else {
      Alert.alert("Validation Error", "Please fix the errors before submitting.");
    }
  };

  const handleBlur = (fieldName:string) => {
    validateFields();
  };
  return (
    <View style={styles.container}>
      <Header headerText={"Sign In"}/>

      <View style={styles.sectionContainer}>

      <Text style={styles.label}>Email Address/Phone Number</Text>
      <TextInput
        style={[globalStyles.input, errors.email && globalStyles.errorInput]}
        placeholder="Enter your email or phone number"
        value={email}
        onChangeText={setEmail}
        onBlur={() => handleBlur("email")}
      />
      {errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>Enter your Password</Text>
      <TextInput
        style={[globalStyles.input, errors.password && globalStyles.errorInput]}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={() => handleBlur("password")}
      />
      {errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}

      <TouchableOpacity onPress={() => Alert.alert("Forgot Password?", "Feature not implemented yet.")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button title='Sign In' style={styles.signInButton} onPress={handleSignIn}/>

      <Text style={styles.signUpText}>
        Don’t have an account? <Text style={styles.signUpLink}>Sign Up</Text>
      </Text>
        </View>
    </View>
  );
};

export default signIn;
