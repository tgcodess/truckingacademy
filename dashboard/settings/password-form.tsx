import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Password as PasswordIcon } from '@phosphor-icons/react/dist/ssr/Password';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Password is required' }),
    password: z
      .string()
      .min(1, 'Password required')
      .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(value), {
        message:
          'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long.',
      }),
    confirm_password: z.string().min(1, 'Confirm Password required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type Values = z.infer<typeof schema>;

const defaultValues = {
  password: '',
  oldPassword: '',
  confirm_password: '',
} satisfies Values;
export function PasswordForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {}, [setError]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <PasswordIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Change password"
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={3}>
            <Controller
              control={control}
              name="oldPassword"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label="Old Password"
                  InputProps={{
                    endAdornment: showPassword ? (
                      <Eye
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlash
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    ),
                  }}
                  type={showPassword ? 'text' : 'password'}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label="New Password"
                  InputProps={{
                    endAdornment: showNewPassword ? (
                      <Eye
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowNewPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlash
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowNewPassword(true);
                        }}
                      />
                    ),
                  }}
                  type={showNewPassword ? 'text' : 'password'}
                />
              )}
            />
            <Controller
              control={control}
              name="confirm_password"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label="Re-type new Password"
                  type={'password'}
                />
              )}
            />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
              Update
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
