import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextField } from '@/src/components/TextField';
import { spacing } from '@/src/theme/tokens';

export interface RegisterNameFieldsProps {
  first: string;
  last: string;
  badFirst?: boolean;
  badLast?: boolean;
  onFirstChange: (text: string) => void;
  onLastChange: (text: string) => void;
}

export const RegisterNameFields = React.memo(function RegisterNameFields({
  first,
  last,
  badFirst,
  badLast,
  onFirstChange,
  onLastChange,
}: RegisterNameFieldsProps): React.ReactElement {
  return (
    <View style={styles.nameRow}>
      <View style={styles.nameCol}>
        <TextField
          label="First name"
          value={first}
          onChangeText={onFirstChange}
          placeholder="Alex"
          autoComplete="given-name"
          error={badFirst}
        />
      </View>
      <View style={styles.nameCol}>
        <TextField
          label="Last name"
          value={last}
          onChangeText={onLastChange}
          placeholder="Silva"
          autoComplete="family-name"
          error={badLast}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  nameCol: {
    flex: 1,
  },
});
