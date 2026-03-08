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

export default function Step2() {
  const { updateFormData } = useSignupStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    updateFormData(data);
    router.push('/apply/review');
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <StepIndicator step={2} />

        <Text style={styles.title}>Step 2 : Profile</Text>

        <View style={styles.inputGroup}>
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Username must contain only letters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Username"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.username && (
            <Text style={styles.errorText}>
              {errors.username.message as string}
            </Text>
          )}

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Phone required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Phone must be 10 digits',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.phone && (
            <Text style={styles.errorText}>
              {errors.phone.message as string}
            </Text>
          )}

          <Controller
            control={control}
            name="link"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Link"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            rules={{
              required: 'Address required',
              minLength: {
                value: 20,
                message: 'Address must be at least 20 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="Address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.address && (
            <Text style={styles.errorText}>
              {errors.address.message as string}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  button: {
    backgroundColor: '#ff7f50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  back: {
    backgroundColor: '#999',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
