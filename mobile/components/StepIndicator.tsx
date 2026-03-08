import { View, Text, StyleSheet } from 'react-native';

type Props = {
  step: number;
};

export default function StepIndicator({ step }: Props) {
  const steps = ['Account', 'Profile', 'Review'];

  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;

        const status =
          stepNumber < step ? 'done' : stepNumber === step ? 'active' : 'todo';

        return (
          <View key={index} style={styles.stepWrapper}>
            <View
              style={[
                styles.circle,
                status === 'done' && styles.done,
                status === 'active' && styles.active,
                status === 'todo' && styles.todo,
              ]}
            >
              <Text style={styles.number}>{stepNumber}</Text>
            </View>

            <Text style={styles.label}>{label}</Text>

            {index < steps.length - 1 && <View style={styles.line} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },

  number: {
    color: 'white',
    fontWeight: 'bold',
  },

  label: {
    marginLeft: 6,
    marginRight: 10,
    fontWeight: '500',
  },

  line: {
    width: 40,
    height: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },

  done: {
    backgroundColor: '#4CAF50',
  },

  active: {
    backgroundColor: '#FF9800',
  },

  todo: {
    backgroundColor: '#aaa',
  },
});
