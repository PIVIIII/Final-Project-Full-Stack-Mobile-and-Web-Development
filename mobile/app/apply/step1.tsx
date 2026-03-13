import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useSignupStore } from '../../store/useSignupStore';
import StepIndicator from '../../components/StepIndicator';
import { useEffect, useState } from 'react';

export default function Step1() {
  const { updateFormData, formData } = useSignupStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const username = watch('username');

  const [checking, setChecking] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);

  // debounce async validation
  useEffect(() => {
    if (!username) {
      setUsernameTaken(false);
      return;
    }

    const timer = setTimeout(() => {
      setChecking(true);

      // simulate database check
      setTimeout(() => {
        if (
          username.toLowerCase() === 'admin' ||
          username.toLowerCase() === 'root'
        ) {
          setUsernameTaken(true);
        } else {
          setUsernameTaken(false);
        }

        setChecking(false);
      }, 500);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const onSubmit = (data: any) => {
    if (usernameTaken || checking) return;

    updateFormData(data);
    router.push('/apply/step2');
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <StepIndicator step={1} />

        <Text style={styles.title}>Step 1 : Account</Text>

        <View style={styles.inputGroup}>
          {/* username */}
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Only letters allowed',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  (errors.username || usernameTaken) && styles.inputError,
                ]}
                placeholder="Username"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {checking && (
            <View style={styles.checking}>
              <ActivityIndicator size="small" />
              <Text style={{ marginLeft: 6 }}>Checking username...</Text>
            </View>
          )}

          {usernameTaken && (
            <Text style={styles.errorText}>Username นี้มีคนใช้ไปแล้ว</Text>
          )}

          {errors.username && (
            <Text style={styles.errorText}>
              {errors.username.message as string}
            </Text>
          )}

          {/* email */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.email && (
            <Text style={styles.errorText}>
              {errors.email.message as string}
            </Text>
          )}

          {/* password */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.password && (
            <Text style={styles.errorText}>
              {errors.password.message as string}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (checking || usernameTaken) && styles.buttonDisabled,
          ]}
          disabled={checking || usernameTaken}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>
            {checking ? 'Checking...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  inputGroup: {
    width: '100%',
  },

  input: {
    width: '100%',
    backgroundColor: '#fff7e6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f8c390',
  },

  inputError: {
    borderColor: 'red',
  },

  checking: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#ff7f50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#ccc',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
