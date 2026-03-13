import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useSignupStore } from '../../store/useSignupStore';
import StepIndicator from '../../components/StepIndicator';

export default function Step2() {
  const { updateFormData, formData } = useSignupStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...formData,
      linkType: 'yes',
    },
  });

  const linkType = useWatch({
    control,
    name: 'linkType',
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    router.push('/apply/review');
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <StepIndicator step={2} />

        <Text style={styles.title}>Step 2 : Profile</Text>

        {/* PHONE */}
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
          <Text style={styles.errorText}>{errors.phone.message as string}</Text>
        )}

        {/* ADDRESS */}
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

        {/* RADIO + LINK */}
        <View style={styles.radioRow}>
          <Controller
            control={control}
            name="linkType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => onChange('yes')}
                >
                  <View style={styles.radioOuter}>
                    {value === 'yes' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>
                    ช่องทางอีเมลติดต่อเพิ่มเติม
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => onChange('no')}
                >
                  <View style={styles.radioOuter}>
                    {value === 'no' && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>อื่น ๆ / ไม่ระบุ </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="link"
            rules={{
              validate: (value) => {
                if (linkType === 'yes') {
                  if (!value) return 'Link is required for this opt@ion';
                  if (!value.includes('@')) return 'Link must contain @';
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.linkInput, errors.link && styles.inputError]}
                placeholder="Link"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {errors.link && (
          <Text style={styles.errorText}>{errors.link.message as string}</Text>
        )}

        {/* BUTTON */}
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
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
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

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  radioGroup: {
    flexDirection: 'row',
    marginRight: 20,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ff7f50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff7f50',
  },

  radioText: {
    fontSize: 14,
  },

  linkInput: {
    flex: 1,
    backgroundColor: '#fff7e6',
    borderRadius: 10,
    padding: 14,
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
    marginTop: 30,
  },

  button: {
    backgroundColor: '#ff7f50',
    padding: 12,
    borderRadius: 10,
  },

  back: {
    backgroundColor: '#999',
    padding: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
