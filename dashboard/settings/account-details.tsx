'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import dayjs from 'dayjs';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { CustomMobileDatePicker } from '@/components/core/date-time-picker';
import { Option } from '@/components/core/option';

const schema = zod.object({
  avatar: zod.string().optional(),
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),

  phone: zod.string().min(10, { message: 'Phone should be at least 10 characters' }),
});

type Values = zod.infer<typeof schema>;
function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}
const defaultValues = {
  avatar: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '+91',
} satisfies Values;

export function AccountDetails(): React.JSX.Element {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      // Refresh the auth state
    },
    [setError]
  );

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const avatar = watch('avatar');

  const handleAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('avatar', url);
      }
    },
    [setValue]
  );

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <UserIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Basic details"
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                border: '1px dashed var(--mui-palette-divider)',
                borderRadius: '50%',
                display: 'inline-flex',
                p: '4px',
              }}
            >
              <Box sx={{ borderRadius: 'inherit', position: 'relative' }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 'inherit',
                    bottom: 0,
                    color: 'var(--mui-palette-common-white)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    opacity: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1,
                    '&:hover': { opacity: 1 },
                  }}
                  onClick={() => {
                    avatarInputRef.current?.click();
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <CameraIcon fontSize="var(--icon-fontSize-md)" />
                    <Typography color="inherit" variant="subtitle2">
                      Select
                    </Typography>
                  </Stack>
                </Box>
                <input hidden onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
                <Avatar src={avatar || '/assets/avatar.png'} sx={{ '--Avatar-size': '100px' }} />
              </Box>
            </Box>
            <Button
              onClick={() => {
                setValue('avatar', '');
              }}
              color="secondary"
              size="small"
            >
              Remove
            </Button>
          </Stack>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} helperText={error?.message} error={Boolean(error?.message)} label="First Name" />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState: { error } }) => (
                <TextField {...field} helperText={error?.message} error={Boolean(error?.message)} label="Last Name" />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label="Email Address"
                />
              )}
            />

            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState: { error } }) => (
                <CustomMobileDatePicker
                  onChange={(e: any) => {
                    console.log(e?.utc(false)?.toISOString());
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState: { error } }) => (
                <MuiTelInput
                  {...field}
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  label="Phone Number"
                  inputMode="tel"
                />
              )}
            />
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="secondary">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Save changes
        </Button>
      </CardActions>
    </Card>
  );
}
