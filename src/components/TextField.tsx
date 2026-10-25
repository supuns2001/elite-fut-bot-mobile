import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Eye, EyeOff } from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  layout,
  radii,
  spacing,
} from '@/src/theme/tokens';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  sublabel?: string;
  error?: boolean;
  errorMessage?: string;
  isPassword?: boolean;
  isMonospace?: boolean;
  isDashed?: boolean;
  rightAccessory?: React.ReactNode;
}

export const TextField = React.memo(function TextField({
  label,
  sublabel,
  value,
  onChangeText,
  placeholder,
  error = false,
  errorMessage,
  isPassword = false,
  isMonospace = false,
  isDashed = false,
  rightAccessory,
  autoCapitalize,
  keyboardType,
  autoComplete,
  editable = true,
  ...rest
}: TextFieldProps): React.ReactElement {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const containerStyle = [
    styles.container,
    isDashed && styles.dashedContainer,
    isFocused && styles.focusedContainer,
    error && styles.errorContainer,
    !editable && styles.disabledContainer,
  ];

  const inputStyle = [
    styles.input,
    isMonospace && styles.monoInput,
    isPassword && styles.passwordInput,
  ];

  const secureText = isPassword && !showPassword;

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        <View style={styles.textColumn}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{label}</Text>
            {sublabel ? <Text style={styles.sublabel}> · {sublabel}</Text> : null}
          </View>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textPlaceholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureText}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            editable={editable}
            style={inputStyle}
            selectionColor={colors.accent}
            {...rest}
          />
        </View>

        {isPassword ? (
          <Pressable
            onPress={togglePasswordVisibility}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            style={styles.eyeButton}
          >
            {showPassword ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
          </Pressable>
        ) : null}

        {rightAccessory ? (
          <View style={styles.accessoryContainer}>{rightAccessory}</View>
        ) : null}
      </View>

      {error && errorMessage ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    height: layout.inputHeight,
    borderRadius: radii.input,
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.surfaceInput,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.inset,
  },
  dashedContainer: {
    borderStyle: 'dashed',
    borderColor: '#333333',
  },
  focusedContainer: {
    borderColor: colors.borderFocus,
  },
  errorContainer: {
    borderColor: colors.borderError,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSubtle,
  },
  sublabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textPlaceholder,
  },
  input: {
    height: 24,
    padding: spacing.none,
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  monoInput: {
    fontFamily: fonts.monoRegular,
    letterSpacing: 0.8,
  },
  passwordInput: {
    letterSpacing: 0.5,
  },
  eyeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  accessoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.error,
  },
});
