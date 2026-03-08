import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useSignupStore } from '../../store/useSignupStore';
import StepIndicator from '../../components/StepIndicator';

export default function Step1() {
  const { updateFormData } = useSignupStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    updateFormData(data);
    router.push('/apply/step2');
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <StepIndicator step={1} />

        <Text style={styles.title}>Step 1 : Account</Text>

        <View style={styles.inputGroup}>
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
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Next</Text>
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
    minHeight: 530,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  inputGroup: {
    width: '100%',
  },

  input: {
    width: '100%',
    backgroundColor: '#fff7e6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f8c390',
  },

  inputError: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#ff7f50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
